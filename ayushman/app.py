# email_spam_app.py

import streamlit as st
import time
import pickle
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

# Download NLTK data
nltk.download('stopwords')

# Load the trained model and vectorizer
with open('vectorizer.pkl', 'rb') as f:
    tfidf = pickle.load(f)

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# Text preprocessing function
ps = PorterStemmer()


def transform_text(text):
    text = text.lower()
    text = nltk.word_tokenize(text)
    text = [word for word in text if word.isalnum()]
    text = [word for word in text if word not in stopwords.words('english') and word not in string.punctuation]
    text = [ps.stem(word) for word in text]
    return " ".join(text)


# Streamlit UI
st.set_page_config(page_title="Email Spam Classifier", layout="centered")
st.title("📧 Email Spam Detection")
st.write("Paste the email content below and click verify.")

# Input box
email_input = st.text_area("✉️ Enter email content here:")

# Button and logic
if st.button("✅ Verify"):
    if not email_input.strip():
        st.warning("Please enter some email content.")
    else:
        with st.spinner("Analyzing email..."):
            time.sleep(2)  # Simulate loading animation
            # Preprocess and predict
            transformed_text = transform_text(email_input)
            vector_input = tfidf.transform([transformed_text])
            result = model.predict(vector_input)[0]

        # Animated result
        st.subheader("🔍 Result:")
        if result == 1:
            st.error("🚨 This email is **SPAM**!", icon="⚠️")
        else:
            st.success("✅ This email is **NOT SPAM**!", icon="📨")
