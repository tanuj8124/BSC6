from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny
from sentence_transformers import SentenceTransformer
from langchain_community.document_loaders import PyPDFDirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import faiss
import numpy as np
import os
import pinecone
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import google.generativeai as genai

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import JsonResponse, FileResponse, HttpResponseNotFound
from django.conf import settings

load_dotenv() # Load environment variables from the .env file

# Global variables
embedding_model = None  # For SentenceTransformer
documents = []
index = None

# Constants
FAISS_INDEX_FILE = 'faiss_index.index'  # Path where FAISS index will be saved
PINECONE_INDEX_NAME = "your_pinecone_index"

# Initialize Pinecone with the new method
pc = Pinecone(api_key='pcsk_3ceY7z_4QDeLtVjYRLTDTbTrDjGbEsRn8EiEp9Qv2NaqQanfexbJkvZoyRnTXcJ4fuo5tg')

# Initialize documents and FAISS index
def initialize_documents():
    """
    Load and preprocess documents and initialize FAISS index.
    This function is called during server startup to initialize global data.
    """
    global embedding_model, documents, index

    try:
        # Initialize the sentence transformer model
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model loaded successfully.")

        # Load documents
        file_loader = PyPDFDirectoryLoader('documents/')
        raw_documents = file_loader.load()
        print(f"Number of documents loaded: {len(raw_documents)}")

        # Split documents into smaller chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=50)
        documents = text_splitter.split_documents(raw_documents)
        print(f"Number of chunks created: {len(documents)}")

        # Attach metadata to each chunk
        for i, doc in enumerate(documents):
            doc.metadata["filename"] = os.path.basename(doc.metadata.get("source", "unknown"))
            doc.metadata["page_number"] = doc.metadata.get("page", 0)
            doc.metadata["chunk_number"] = i

        # Generate embeddings for document chunks
        embeddings = embedding_model.encode([doc.page_content for doc in documents])
        print(f"Shape of embeddings: {np.array(embeddings).shape}")

        # Initialize FAISS index if not already initialized
        if os.path.exists(FAISS_INDEX_FILE):
            index = faiss.read_index(FAISS_INDEX_FILE)
            print(f"Loaded FAISS index with {index.ntotal} embeddings.")
        else:
            dimension = embeddings[0].shape[0]
            index = faiss.IndexFlatL2(dimension)
            index.add(np.array(embeddings))
            print(f"Number of embeddings in FAISS index: {index.ntotal}")
            faiss.write_index(index, FAISS_INDEX_FILE)
            print(f"FAISS index saved to {FAISS_INDEX_FILE}.")
            
    except Exception as e:
        print(f"Error during initialization: {e}")

# Initialize documents and FAISS index on server startup
initialize_documents()

def save_to_pinecone():
    """
    Save the FAISS index data to Pinecone.
    """
    global index, documents

    try:
        if PINECONE_INDEX_NAME not in pc.list_indexes().names():
            pc.create_index(
                name=PINECONE_INDEX_NAME,
                dimension=index.d,
                metric='euclidean',
                spec=ServerlessSpec(cloud='aws', region='us-west-2')
            )
            print(f"Created Pinecone index {PINECONE_INDEX_NAME}.")

        index_pinecone = pc.index(PINECONE_INDEX_NAME)

        batch = []
        for i, doc in enumerate(documents):
            vector = index.reconstruct(i).tolist()
            metadata = {"content": doc.page_content}
            batch.append((str(i), vector, metadata))
            if len(batch) >= 1000:
                index_pinecone.upsert(vectors=batch)
                batch = []

        if batch:
            index_pinecone.upsert(vectors=batch)

        print(f"FAISS embeddings successfully saved to Pinecone.")

    except Exception as e:
        print(f"Error during Pinecone upsert: {e}")

def retrieve_query(query, k=2):
     global index, documents
     try:
        query_embedding = embedding_model.encode([query])
        distances, indices = index.search(np.array(query_embedding), min(k, len(documents)))
        
        if indices is None or len(indices) == 0 or len(indices[0]) == 0:
            return []

        results = []
        for i in indices[0]:
            if i < len(documents):
                results.append((documents[i], distances[0][list(indices[0]).index(i)]))

        return results
     except Exception as e:
        print(f"Error during query retrieval: {e}")
        return []

def retrieve_answers(query):
    try:
        search_results = retrieve_query(query)
        top_docs = [result[0].page_content for result in search_results]
        return "\n".join(top_docs)
    except Exception as e:
        print(f"Error during answer retrieval: {e}")
        return "An error occurred while retrieving the answer."

class QueryAPIView(APIView):
    authentication_classes = []  # Disable authentication
    permission_classes = [AllowAny]  # Allow unrestricted access
    parser_classes = [JSONParser]

    def post(self, request):
        query = request.data.get("query", "").strip()
        use_gemini = str(request.data.get("useGemini", "false")).lower() == "true"

        if not query:
            return Response({"error": "Query cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            embeddings = embedding_model.encode([doc.page_content for doc in documents])
            temp_index = faiss.IndexFlatL2(embeddings[0].shape[0])
            temp_index.add(np.array(embeddings))

            query_embedding = embedding_model.encode([query])
            distances, indices = temp_index.search(np.array(query_embedding), min(5, len(documents)))

            results = []
            for i in range(len(indices[0])):
                doc_idx = indices[0][i]
                doc_obj = documents[doc_idx]
                dist = round(float(distances[0][i]), 5)
                results.append({
                    "distance": dist,
                    "content": doc_obj.page_content[:2000],
                    "filename": doc_obj.metadata.get("filename", ""),
                    "page_number": doc_obj.metadata.get("page_number", 0),
                    "chunk_number": doc_obj.metadata.get("chunk_number", 0),
                })

            pdf_context = "\n".join([res["content"] for res in results])
            answer = get_gemini_response(query, pdf_context) if use_gemini else pdf_context

            return Response({"query": query, "answer": answer, "results": results}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# Configure the Generative AI API
genai.configure(api_key='AIzaSyDkOFUtzh-3nkbkvx0Masir7OuEirnD8BQ')

# Create the model configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Initialize chat session
gen_model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
)

chat_session = gen_model.start_chat(
    history=[
        {
            "role": "user",
            "parts": [
                "You are PDelF, an AI assistant designed to provide answers strictly based on the content of the provided PDF documents. Your primary task is to craft responses that align precisely with the context and information contained in the PDF, regardless of the content’s accuracy or correctness. Your role is to interpret and present the PDF’s context in a manner that best addresses the user’s query.\n\nGuidelines:\nAdherence to PDF Content:\nAlways base your answers strictly on the PDF content. Refrain from adding external information, interpretations, or assumptions outside the context provided.\n\nWhen Context Deviates:\nIf the query cannot reasonably be answered based on the PDF content, respond with:\n\"I reviewed the attached documents but could not find exact information related to your query. The closest information available is as follows: [insert relevant content].\"\nYou can express this in a similar manner, but ensure the intent remains consistent.\n\nIf the PDF Content Is Empty:\nIn cases where the PDF is empty or lacks usable information, respond with:\n\"I reviewed the attached documents but found no relevant information to answer your query. You might consider reframing your question or providing additional context.\"\n\nYour sole responsibility is to mold the PDF content into coherent, accurate responses that align with the user’s questions while adhering to the parameters above.",
            ],
        },
        {
            "role": "model",
            "parts": [
                "Okay, I understand. I will act as PDelF and provide answers strictly based on the provided PDF content, following the guidelines you've outlined. I'm ready when you are. Please provide the PDF document and your question.\n",
            ],
        },
    ]
)


def get_gemini_response(query, pdf_context):
    """
    Sends the structured query (query + pdf_context) to the Gemini model and returns its response.
    """
    try:
        formatted_input = f"Query: {query}\n\nPDF Context:\n{pdf_context}"
        response = chat_session.send_message([{"text": formatted_input}])  # Gemini input format
        print(response.text)

        return response.text if response else "Error: No response from Gemini."
    except Exception as e:
        return f"Error: Unable to generate response from Gemini. {str(e)}"


class UploadPDFAPIView(APIView):
    authentication_classes = []  # Disable authentication
    permission_classes = [AllowAny]  # Allow unrestricted access
    parser_classes = [MultiPartParser, FormParser]  # Enable file uploads

    def post(self, request, *args, **kwargs):
        file = request.FILES.get("file")
        if not file or not file.name.endswith(".pdf"):
            return Response({"error": "Please upload a valid PDF file."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save the uploaded file to the documents/ folder
            file_path = os.path.join("documents", file.name)
            with open(file_path, "wb") as f:
                for chunk in file.chunks():
                    f.write(chunk)

            # Process and index the uploaded PDF
            self.process_and_index_pdf(file_path)

            return Response({"message": "File uploaded and indexed successfully.", "file_name": file.name}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"File upload failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def process_and_index_pdf(self, file_path):
        """
        Processes the uploaded PDF: extracts text, splits into chunks, and updates FAISS index.
        """
        global documents, index, embedding_model

        try:
            # Load the PDF
            pdf_loader = PyPDFLoader(file_path)
            raw_documents = pdf_loader.load()

            # Split into chunks
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=50)
            pdf_documents = text_splitter.split_documents(raw_documents)

            # Add to global document list
            documents.extend(pdf_documents)

            # Generate embeddings for new documents
            new_embeddings = embedding_model.encode([doc.page_content for doc in pdf_documents])

            # Update FAISS index
            if index is None:
                index = faiss.IndexFlatL2(new_embeddings.shape[1])
            index.add(np.array(new_embeddings))

            # Save FAISS index
            faiss.write_index(index, "faiss_index.index")

            print(f"Indexed {len(pdf_documents)} new chunks from {file_path}")

        except Exception as e:
            print(f"Error processing {file_path}: {e}")


class ListFilesAPIView(APIView):
    def get(self, request):
        documents_path = os.path.join(settings.BASE_DIR, "documents")
        if not os.path.exists(documents_path):
            return JsonResponse({"files": []})

        files = [
            f for f in os.listdir(documents_path)
            if os.path.isfile(os.path.join(documents_path, f))
        ]
        return JsonResponse({"files": files})


class DeleteFileAPIView(APIView):
    authentication_classes = []  # Disable authentication
    permission_classes = [AllowAny]  # Allow unrestricted access

    def delete(self, request):
        file_name = request.data.get("file_name")
        if not file_name:
            return Response({"error": "File name is required."}, status=status.HTTP_400_BAD_REQUEST)

        file_path = os.path.join(settings.BASE_DIR, "documents", file_name)
        if os.path.exists(file_path):
            os.remove(file_path)
            return Response({"message": "File deleted successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "File not found."}, status=status.HTTP_404_NOT_FOUND)
        

def download_pdf(request, filename):
    file_path = os.path.join("documents", filename)

    if os.path.exists(file_path):
        response = FileResponse(open(file_path, "rb"), as_attachment=True)
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
    else:
        return HttpResponseNotFound("File not found.")