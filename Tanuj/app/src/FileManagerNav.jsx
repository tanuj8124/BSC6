import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faUpload, faSpinner } from "@fortawesome/free-solid-svg-icons";

const FileManagerNav = ({ fetchFiles }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("Choose File");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "Choose File");
    setSelectedFile(event.target.files[0]);
    setUploadStatus("");
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload-pdf/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadStatus(`✅ File uploaded successfully: ${data.file_name}`);
      } else {
        setUploadStatus(`❌ Error: ${data.error || "File upload failed."}`);
      }
    } catch (error) {
      setUploadStatus("❌ Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className=" rounded-2xl flex flex-col items-center bg-gray-800/50 backdrop-blur-sm px-4 py-3 border-b border-gray-700/30 w-full shadow-lg"
    >
      <div className=" flex flex-col md:flex-row md:items-center md:justify-between w-full">
        <motion.h2
          className="text-lg font-semibold text-gray-200 flex items-center mb-2 md:mb-0"
          whileHover={{ scale: 1.02 }}
        >
          📂 File Manager
        </motion.h2>
        <div className="file-upload flex flex-wrap items-center gap-2 ml-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >

            {/* //upload */}
            {/* <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input bg-gray-700/50 border border-gray-600/30 rounded-lg text-sm text-gray-300 h-9 px-3 
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent
                hover:bg-gray-700/70 transition-all duration-200"
            /> */}

<div className="flex items-center gap-3 border border-gray-600/30 bg-gray-700/50 rounded-lg px-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-700/70 transition-all duration-200">
      <label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m4-10a9 9 0 1 0 9 9 9 9 0 0 0-9-9z"/>
        </svg>
        <span className="text-sm truncate max-w-[150px]">{fileName}</span>
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>

          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFileUpload}
            className={`px-3 py-2 text-gray-300 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-lg
              ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isUploading}
          >
            <FontAwesomeIcon
              icon={isUploading ? faSpinner : faUpload}
              className={isUploading ? "animate-spin" : ""}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchFiles}
            className="px-3 py-2 text-gray-300 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-lg"
          >
            <FontAwesomeIcon icon={faRedo} />
          </motion.button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {uploadStatus && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full text-center mt-2 text-sm text-gray-300 bg-gray-700/50 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-600/30"
          >
            {uploadStatus}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default FileManagerNav;