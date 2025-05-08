import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chat from "./Chat";
import FileManager from "./FileManager.jsx";
import Particles from "./components/Particles.jsx";
import SplitText from "./components/SplitText.jsx";
import StarBorder from "./components/StarBorder.jsx";
import { FaGithub } from "react-icons/fa";
import GradientText from "./components/GradientText.jsx";


const App = () => {
    const [dividerPos, setDividerPos] = useState(60);

    const handleMouseDown = (event) => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = (dividerPos / 100) * window.innerWidth;
        const handleMouseMove = (moveEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            const newPercentage = (newWidth / window.innerWidth) * 100;
            if (newPercentage >= 25 && newPercentage <= 75) {
                setDividerPos(newPercentage);
            }
        };
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleScrollToMain = () => {
        document.getElementById("main-content").scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div id="main">
            <div className="homepage">

                <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black text-white">
                    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-black bg-opacity-30 backdrop-blur-lg">
                        <h1 className="text-2xl font-bold">PDelf</h1>
                        <a href="https://github.com/tanuj8124" target="_blank" rel="noopener noreferrer">
                            <FaGithub className="text-3xl hover:text-gray-400 transition-all" />
                        </a>
                    </nav>
                    <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
                        <Particles particleColors={["#ffffff", "#ffffff"]} particleCount={200} particleSpread={10} speed={0.1} particleBaseSize={100} moveParticlesOnHover={true} alphaParticles={false} disableRotation={false} />
                    </div>
                    <h1 className="relative text-5xl font-bold mb-6">
                        <SplitText text="Welcome to PDelf" className="text-5xl font-bold text-center" delay={150} animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} easing="easeOutCubic" threshold={0.2} rootMargin="-50px" />
                        🪄</h1>
                    {/* Gradient Text Below SplitText */}
                    <GradientText
                        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        animationSpeed={3}
                        showBorder={false}
                        className="text-sm mb-6"
                    >
                        Universal search library with AI
                    </GradientText>
                    {/* Get Started Button */}
                    <StarBorder as="button" onClick={handleScrollToMain} className="px-6 py-3 text-lg font-semibold text-white hover:bg-cyan-400 hover:text-black transition-all" color="cyan" speed="5s">
                        Get Started
                    </StarBorder>
                    <a href="https://github.com/tanuj8124" className="absolute bottom-4 text-sm text-gray-400">@Created by Tanuj Kashyap | 2025</a>
                </div>
            </div>
            <div id="main-content" className='max-w-screen-2xl mx-auto bg-gradient-to-b from-gray-900 to-gray-950 text-gray-200'>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <main className="flex h-screen relative">
                        <motion.div layout className="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-2xl rounded-r-lg" style={{ width: `${dividerPos}%`, minWidth: "30%", maxWidth: "70%" }}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <FileManager />
                            </motion.div>
                        </motion.div>
                        <motion.div className="w-1 cursor-ew-resize hover:bg-indigo-500 hover:w-1.5 transition-all duration-200 relative group" onMouseDown={handleMouseDown} style={{ flexShrink: 0 }} whileHover={{ scale: 1.5 }}>
                            <div className="absolute inset-y-0 -left-2 right-0 group-hover:bg-indigo-500/20 transition-colors duration-200" />
                        </motion.div>
                        <motion.div layout className="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-2xl rounded-l-lg" style={{ width: `${100 - dividerPos}%`, minWidth: "30%", maxWidth: "70%" }}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Chat />
                            </motion.div>
                        </motion.div>
                    </main>
                </motion.div>
            </div>
        </div>
    );
};

export default App;
