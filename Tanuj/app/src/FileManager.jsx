// import React, { useEffect, useState, useContext } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faDownload, faTrash, faFile } from "@fortawesome/free-solid-svg-icons";
// import FileManagerNav from "./FileManagerNav";
// import { ChatContext } from "./ChatContext";

// const fileIcons = {
//     pdf: "📕",
//     doc: "📄",
//     docx: "📄",
//     xls: "📊",
//     xlsx: "📊",
//     png: "🖼️",
//     jpg: "🖼️",
//     jpeg: "🖼️",
//     txt: "📜",
//     default: "📁",
// };

// const FileManager = () => {
//     const [files, setFiles] = useState(new Set());
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [viewAll, setViewAll] = useState(false);
//     const { apiResponse } = useContext(ChatContext);

//     useEffect(() => {
//         if (viewAll) {
//             fetchFiles();
//         } else {
//             if (apiResponse && apiResponse.results) {
//                 setFiles(new Set(apiResponse.results.map((item) => item.filename)));
//             } else {
//                 setFiles(new Set());
//             }
//         }
//     }, [viewAll, apiResponse]);

//     const fetchFiles = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch("http://127.0.0.1:8000/api/list-files/");
//             if (!response.ok) throw new Error("Failed to fetch files");
//             const data = await response.json();
//             setFiles(new Set(data.files));
//         } catch (err) {
//             setError("Error fetching files. Make sure the backend is running.");
//         }
//         setLoading(false);
//     };

//     const handleDownload = (fileName) => {
//         const url = `http://127.0.0.1:8000/download/${encodeURIComponent(fileName)}`;
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", fileName);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     const handleDelete = async (fileName) => {
//         if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;
//         try {
//             const response = await fetch("http://127.0.0.1:8000/api/delete-file/", {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ file_name: fileName }),
//             });

//             if (!response.ok) throw new Error("Failed to delete file");
//             setFiles(new Set([...files].filter((file) => file !== fileName)));
//         } catch (err) {
//             alert("Error deleting file.");
//         }
//     };

//     return (
//         <div className="bg-gray-100 h-full flex flex-col min-w-0">
//             <FileManagerNav />
//             <div className="p-4 overflow-auto">
//                 <button
//                     onClick={() => setViewAll(!viewAll)}
//                     className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4 hover:bg-blue-600 transition cursor-pointer"
//                 >
//                     {viewAll ? "Show Similar Files" : "View All"}
//                 </button>
//                 {loading ? (
//                     <p className="text-center text-gray-600">
//                         {viewAll
//                             ? "Loading files..."
//                             : "Files carrying similar context to that your searched query will be shown here."}
//                     </p>
//                 ) : error ? (
//                     <p className="text-center text-red-500">{error}</p>
//                 ) : null}

//                 <div
//                     className="flex flex-wrap gap-x-4 gap-y-6 mt-4"
//                 >
//                     {[...files].map((file, index) => {
//                         const fileExt = file.split(".").pop().toLowerCase();
//                         const fileIcon = fileIcons[fileExt] || fileIcons.default;
//                         return (
//                             <div
//                                 key={index}
//                                 className="bg-white w-[200px] p-4 rounded-lg shadow-md flex flex-col items-center justify-between overflow-hidden"
//                             >
//                                 <div className="text-6xl">{fileIcon}</div>
//                                 <p
//                                     className="mt-2 text-sm font-medium text-center truncate w-full"
//                                     title={file}
//                                 >
//                                     {file}
//                                 </p>
//                                 <div className="flex space-x-2 mt-3 w-full justify-center">
//                                     <a
//                                         href={`http://127.0.0.1:8000/documents/${file}`}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="px-3 py-2 text-white bg-green-500 rounded-md text-sm hover:bg-green-600 transition cursor-pointer"
//                                     >
//                                         <FontAwesomeIcon icon={faFile} />
//                                     </a>
//                                     <button
//                                         onClick={() => handleDownload(file)}
//                                         className="px-3 py-2 text-white bg-blue-500 rounded-md text-sm hover:bg-blue-600 transition cursor-pointer"
//                                     >
//                                         <FontAwesomeIcon icon={faDownload} />
//                                     </button>
//                                     <button
//                                         onClick={() => handleDelete(file)}
//                                         className="px-3 py-2 text-white bg-red-500 rounded-md text-sm hover:bg-red-600 transition cursor-pointer"
//                                     >
//                                         <FontAwesomeIcon icon={faTrash} />
//                                     </button>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FileManager;


import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash, faFile } from "@fortawesome/free-solid-svg-icons";
import FileManagerNav from "./FileManagerNav";
import { ChatContext } from "./ChatContext";

const fileIcons = {
    pdf: "📕",
    doc: "📄",
    docx: "📄",
    xls: "📊",
    xlsx: "📊",
    png: "🖼️",
    jpg: "🖼️",
    jpeg: "🖼️",
    txt: "📜",
    default: "📁",
};

const FileManager = () => {
    const [files, setFiles] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewAll, setViewAll] = useState(true);
    const { apiResponse } = useContext(ChatContext);

    useEffect(() => {
        if (viewAll) {
            fetchFiles();
        } else {
            if (apiResponse && apiResponse.results) {
                setFiles(new Set(apiResponse.results.map((item) => item.filename)));
            } else {
                setFiles(new Set());
            }
        }
    }, [viewAll, apiResponse]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/list-files/");
            if (!response.ok) throw new Error("Failed to fetch files");
            const data = await response.json();
            setFiles(new Set(data.files));
        } catch (err) {
            setError("Error fetching files. Make sure the backend is running.");
        }
        setLoading(false);
    };

    const handleDownload = (fileName) => {
        const url = `http://127.0.0.1:8000/download/${encodeURIComponent(fileName)}`;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (fileName) => {
        if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;
        try {
            const response = await fetch("http://127.0.0.1:8000/api/delete-file/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ file_name: fileName }),
            });

            if (!response.ok) throw new Error("Failed to delete file");
            setFiles(new Set([...files].filter((file) => file !== fileName)));
        } catch (err) {
            alert("Error deleting file.");
        }
    };

    return (
        <div className=" h-full flex flex-col min-w-0">
            <FileManagerNav />
            <div className="p-4 overflow-auto">
                <button
                    onClick={() => setViewAll(!viewAll)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4 hover:bg-blue-600 transition cursor-pointer w-52 text-sm"
                >
                    {viewAll ? "Contextually-Similar Files" : "View All Files"}
                </button>
                {loading ? (
                    <p className="text-center text-gray-600">
                        {viewAll
                            ? "Loading files..."
                            : "Files carrying similar context to that of your searched query will be shown here."}
                    </p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : null}

                <div
                    className=" grid gap-5 mt-4"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}
                >
                    {[...files].map((file, index) => {
                        const fileExt = file.split(".").pop().toLowerCase();
                        const fileIcon = fileIcons[fileExt] || fileIcons.default;
                        return (
                            <div
                                key={index}
                                className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg p-4 shadow-md flex flex-col items-center justify-between overflow-hidden"
                            >
                                <div className="text-6xl">{fileIcon}</div>
                                <p
                                    className="mt-2 text-sm font-medium text-center truncate w-full"
                                    title={file}
                                >
                                    {file}
                                </p>
                                <div className="flex space-x-2 mt-3 w-full justify-center">
                                    <a
                                        href={`http://127.0.0.1:8000/documents/${file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 text-white bg-green-500 rounded-md text-sm hover:bg-green-600 transition cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faFile} />
                                    </a>
                                    <button
                                        onClick={() => handleDownload(file)}
                                        className="px-3 py-2 text-white bg-blue-500 rounded-md text-sm hover:bg-blue-600 transition cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faDownload} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file)}
                                        className="px-3 py-2 text-white bg-red-500 rounded-md text-sm hover:bg-red-600 transition cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FileManager;
