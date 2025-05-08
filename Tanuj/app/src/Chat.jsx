import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContext } from "./ChatContext";
import ReactMarkdown from "react-markdown";
import "./App.css";

const Chat = () => {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [useGemini, setUseGemini] = useState(false);
  const chatContainerRef = useRef(null);
  const { apiResponse, setApiResponse } = useContext(ChatContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (query.trim() || file) {
      const userQuery = { query: query || "Uploaded PDF", answer: "Loading..." };
      setChatHistory((prev) => [...prev, userQuery]);

      const requestBody = {
        query: query,
        useGemini: useGemini,
      };

      try {
        const response = await fetch("http://127.0.0.1:8000/api/query/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          setApiResponse(data);

          setChatHistory((prev) => {
            const updatedHistory = [...prev];
            updatedHistory[updatedHistory.length - 1].answer = data.answer;
            return updatedHistory;
          });
        } else {
          setApiResponse({ error: "Unable to fetch response" });

          setChatHistory((prev) => {
            const updatedHistory = [...prev];
            updatedHistory[updatedHistory.length - 1].answer = "Error: Unable to fetch response.";
            return updatedHistory;
          });
        }
      } catch (error) {
        setApiResponse({ error: "Network issue or server error" });

        setChatHistory((prev) => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1].answer = "Error: Network issue or server error.";
          return updatedHistory;
        });
      }

      setQuery("");
      setFile(null);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen w-full bg-gray-900/50 backdrop-blur-sm p-4 flex flex-col"
    >
      {/* Chat History Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-1 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-700/30"
      >
        <div className="flex justify-between items-center border-b border-gray-700/30 pb-3 mb-3">
          <motion.h2 
            whileHover={{ scale: 1.02 }}
            className="text-sm font-semibold text-gray-200"
          >
            Robust Response (GEMINI)
          </motion.h2>
          <motion.label 
            whileHover={{ scale: 1.05 }}
            className="relative inline-flex items-center cursor-pointer text-sm"
          >
            <input
              type="checkbox"
              className="sr-only peer"
              checked={useGemini}
              onChange={(e) => setUseGemini(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </motion.label>
        </div>

        <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto text-sm pr-2">
          <AnimatePresence>
            {chatHistory.length > 0 ? (
              chatHistory.map((chat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col space-y-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="bg-indigo-600/20 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-indigo-500/30"
                  >
                    <strong className="text-indigo-300">You:</strong>
                    <p className="mt-1 text-gray-300">{chat.query}</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-700/30"
                  >
                    <strong className="text-gray-300">Response:</strong>
                    <div className="mt-2 text-gray-300">
                      {useGemini ? (
                        <ReactMarkdown>{chat.answer}</ReactMarkdown>
                      ) : (
                        <div>
                          {apiResponse?.results?.length > 0 ? (
                            apiResponse.results.map((result, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg shadow-lg mb-3 border border-gray-600/30"
                              >
                                <div className="font-semibold text-gray-200 group hover:cursor-pointer">
                                  <p className="text-sm text-gray-400 group-hover:text-indigo-400 transition-colors">{result.filename || "N/A"}</p>
                                  <p className="text-sm text-gray-400 group-hover:text-indigo-400 transition-colors">
                                    Distance: {result.distance || "N/A"} | Page: {result.page_number || "N/A"}
                                  </p>
                                </div>
                                <div className="mt-2 text-gray-300">{result.content || "No content available."}</div>
                              </motion.div>
                            ))
                          ) : (
                            <motion.p
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="text-gray-400"
                            >
                              Loading...
                            </motion.p>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 text-center"
              >
                No chat history available.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Query Input Section */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="flex flex-col mt-4 gap-2 text-sm"
      >
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          id="query"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your query here..."
          className="p-3 bg-gray-800/50 backdrop-blur-sm text-gray-200 border border-gray-700/30 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent
            placeholder-gray-500 shadow-lg transition-all duration-200"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-gray-200 font-semibold rounded-lg shadow-lg
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            transition-all duration-200"
        >
          Submit
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Chat;