import React, { useState, useEffect, useRef } from 'react';
import { Book, GraduationCap, Play, ChevronRight, Layout, Search, Settings, Info, Star, Cloud, FileText, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import manifest from './manifest.json';

const uniqueGrades = [...new Set(manifest.map(c => c.grade))].sort();
const GRADES = ["All", ...uniqueGrades];

export default function App() {
    const [selectedGrade, setSelectedGrade] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All"); // "All", "Games", "Documents"
    const [activeCourse, setActiveCourse] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const filteredCourses = manifest.filter(course => {
        const matchesGrade = selectedGrade === "All" || course.grade === selectedGrade;
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.grade.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesType = true;
        if (filterType === "Games") {
            matchesType = course.type === "Quest" || course.type === "Interactive";
        } else if (filterType === "Documents") {
            matchesType = course.type === "Document";
        }

        return matchesGrade && matchesSearch && matchesType;
    });

    return (
        <div className="flex h-screen overflow-hidden font-['Outfit'] text-slate-700 relative">

            {/* Playful background decorative elements */}
            <div className="absolute top-10 left-10 text-pink-300/30 w-32 h-32 blur-xl animate-pulse"><Cloud size={120} /></div>
            <div className="absolute bottom-10 right-20 text-cyan-300/30 w-40 h-40 blur-xl animate-pulse delay-1000"><Cloud size={160} /></div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed lg:relative w-72 h-[calc(100vh-2rem)] glass border-r-4 border-white/60 flex flex-col z-40 m-4 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 bg-white/40 transition-transform duration-300 ease-bounce ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}`}>
                <div className="absolute top-4 right-4 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/50 rounded-full text-slate-500 hover:text-pink-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-lg shadow-pink-500/30 transform -rotate-6">
                            <GraduationCap className="text-white relative z-10" size={26} />
                        </div>
                        <h1 className="text-xl font-extrabold bg-gradient-to-br from-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                            Kidz English
                        </h1>
                    </div>

                    <nav className="space-y-2">
                        {GRADES.map((grade, idx) => {
                            // Give each category a slightly different pastel hover tint
                            const colors = ['hover:bg-pink-100/80', 'hover:bg-purple-100/80', 'hover:bg-blue-100/80', 'hover:bg-green-100/80', 'hover:bg-yellow-100/80'];
                            const colorClass = colors[idx % colors.length];

                            return (
                                <button
                                    key={grade}
                                    onClick={() => {
                                        setSelectedGrade(grade);
                                        setActiveCourse(null);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold ${selectedGrade === grade
                                        ? 'bg-white text-purple-600 shadow-[0_4px_15px_-3px_rgba(167,139,250,0.3)] scale-[1.02] border-2 border-purple-100'
                                        : `text-slate-500 ${colorClass} hover:scale-[1.01] border-2 border-transparent`
                                        }`}
                                >
                                    <Book size={20} className={selectedGrade === grade ? "text-pink-400" : "text-slate-300"} />
                                    <span className="text-sm tracking-wide">{grade}</span>
                                    {selectedGrade === grade && (
                                        <motion.div layoutId="activeStar" className="ml-auto">
                                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        </motion.div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 bg-white/30 border-t-2 border-white/50 space-y-4">
                    <div className="flex items-center gap-3 text-slate-500 font-bold hover:text-purple-600 cursor-pointer transition-colors bg-white/50 p-3 rounded-xl">
                        <Info size={18} className="text-blue-400" />
                        <span className="text-sm">Help for Parents</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden z-10">
                {/* Header */}
                <header className="h-24 flex items-center justify-between px-4 sm:px-8 z-10 gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-3 rounded-2xl bg-white border-2 border-white shadow-md text-purple-400 hover:text-purple-600 transition-all"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="relative w-full max-w-md hidden sm:block">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search your favorite games..."
                            className="w-full bg-white/80 border-4 border-white shadow-xl shadow-purple-500/5 rounded-full py-4 pl-14 pr-6 text-slate-600 font-bold placeholder:text-slate-400 focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-300/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white/50 backdrop-blur p-1.5 rounded-2xl shadow-sm border-2 border-white">
                        {["All", "Games", "Documents"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${filterType === type
                                    ? 'bg-white text-purple-600 shadow-md'
                                    : 'text-slate-500 hover:text-purple-400'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8 custom-scrollbar">
                    <div className="max-w-6xl mx-auto pt-4">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-slate-700 tracking-tight">
                                Let's Learn English! <span className="inline-block animate-bounce origin-bottom">🎉</span>
                            </h2>
                            <p className="text-slate-500 font-medium text-base sm:text-lg">Pick a magical game or book to start!</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                            {filteredCourses.map((course, idx) => {
                                // Rotate gradients for cuteness
                                const cardColors = [
                                    "from-pink-100 to-rose-50 border-pink-200",
                                    "from-violet-100 to-purple-50 border-violet-200",
                                    "from-cyan-100 to-blue-50 border-cyan-200",
                                    "from-emerald-100 to-teal-50 border-emerald-200",
                                    "from-amber-100 to-yellow-50 border-amber-200"
                                ];
                                const style = cardColors[idx % cardColors.length];
                                const dotColor = style.split('-')[1]; // e.g., 'pink', 'violet'

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05, type: 'spring', stiffness: 100 }}
                                        key={course.id}
                                        onClick={() => setActiveCourse(course)}
                                        className={`glass group card-hover rounded-[2rem] p-6 cursor-pointer relative overflow-hidden bg-gradient-to-br ${style}`}
                                    >
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-colors"></div>

                                        <div className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg shadow-black/5">
                                                {course.type === 'Document' ? (
                                                    <FileText className={`text-${dotColor}-500 fill-${dotColor}-500`} size={18} />
                                                ) : (
                                                    <Play className={`text-${dotColor}-500 fill-${dotColor}-500 translate-x-0.5`} size={18} />
                                                )}
                                            </div>
                                        </div>

                                        <div className={`mb-5 w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-${dotColor}-500 group-hover:rotate-12 transition-transform duration-300`}>
                                            {course.type === 'Document' ? (
                                                <FileText size={32} strokeWidth={2.5} />
                                            ) : (
                                                <Layout size={32} strokeWidth={2.5} />
                                            )}
                                        </div>

                                        <div className="space-y-2 relative z-10">
                                            <div className={`inline-block px-3 py-1 rounded-full bg-white/60 text-[11px] uppercase tracking-widest font-extrabold text-${dotColor}-600`}>
                                                {course.grade}
                                            </div>
                                            <h3 className="font-extrabold text-xl text-slate-700 leading-tight pt-1">{course.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium line-clamp-2">{course.description}</p>
                                        </div>

                                        <div className={`mt-8 flex items-center justify-center w-full py-3 rounded-xl bg-white/50 text-sm font-bold text-${dotColor}-600 group-hover:bg-white transition-colors`}>
                                            {course.type === 'Document' ? 'Read Now' : 'Play Now'} <ChevronRight size={16} className="ml-1" strokeWidth={3} />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            {/* Player Overlay */}
            <AnimatePresence>
                {activeCourse && (
                    <FlashPlayer
                        course={activeCourse}
                        onClose={() => setActiveCourse(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function FlashPlayer({ course, onClose }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (course.type === "Document") return; // Docs don't need Ruffle

        if (window.RufflePlayer) {
            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();
            // Adjust player size/fit
            player.style.width = "100%";
            player.style.height = "100%";

            containerRef.current.appendChild(player);

            // Serve directly from the new assets-flash folder in public
            const swfUrl = `/assets-flash/${course.path}`;
            const basePath = swfUrl.substring(0, swfUrl.lastIndexOf('/') + 1);

            player.load({
                url: swfUrl,
                base: basePath,
                autoplay: "off",
                unmuteOverlay: "visible",
                allowScriptAccess: true,
                backgroundColor: "#fdf4ff" // Nice pastel pink background for the player if it borders
            });

            return () => {
                if (player) player.remove();
            };
        }
    }, [course]);

    const isDocument = course.type === "Document";
    const documentUrl = `/assets-flash/${course.path}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 sm:inset-4 z-50 bg-white shadow-2xl shadow-purple-900/20 sm:rounded-[3rem] sm:border-8 border-white flex flex-col overflow-hidden"
        >
            <header className="h-16 sm:h-20 flex flex-wrap items-center justify-between px-4 sm:px-8 bg-gradient-to-r from-pink-50 to-purple-50 border-b-2 border-purple-100 shrink-0">
                <div className="flex items-center gap-4 sm:gap-6">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all transform hover:-translate-x-1"
                    >
                        <ChevronRight className="rotate-180" size={24} strokeWidth={3} />
                    </button>
                    <div className="max-w-[150px] sm:max-w-none">
                        <h2 className="font-extrabold text-lg sm:text-2xl text-slate-700 truncate">{course.name}</h2>
                        <div className="flex items-center gap-2 sm:mt-1 hidden sm:flex">
                            <span className="px-2 py-0.5 rounded-md bg-purple-200/50 text-[10px] text-purple-700 font-extrabold uppercase tracking-widest">{course.grade}</span>
                            <span className="text-[12px] text-slate-400 font-medium">{course.type}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={() => window.location.reload()} className="hidden sm:block px-4 py-2 text-sm font-bold text-slate-500 hover:text-purple-600 bg-white rounded-xl shadow-sm border border-slate-100">
                        🔄 Refresh
                    </button>
                    <button onClick={onClose} className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-500/30 text-xs sm:text-sm font-extrabold hover:shadow-lg hover:from-pink-400 hover:to-rose-300 hover:-translate-y-0.5 transition-all">
                        Exit Game
                    </button>
                </div>
            </header>

            <div className={`flex-1 ${isDocument ? 'bg-slate-100 p-2 sm:p-6' : 'bg-gradient-to-b from-purple-50 to-pink-50 p-6'} relative flex items-center justify-center`}>
                <div ref={!isDocument ? containerRef : null} className={`w-full h-full ${!isDocument ? 'max-w-[1024px] max-h-[768px]' : 'max-w-[1400px]'} rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border-4 ${isDocument ? 'bg-slate-100 border-slate-200' : 'border-white bg-white'}`}>
                    {isDocument ? (
                        <iframe src={documentUrl} className="w-full h-full border-none rounded-2xl" title={course.name} />
                    ) : (
                        /* Ruffle player will be injected here */
                        null
                    )}
                </div>
            </div>

            {!isDocument && (
                <div className="absolute bottom-6 w-full text-center pointer-events-none">
                    <span className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full text-xs font-bold text-purple-500 shadow-sm border border-purple-100">
                        Click the big play button to start! 🎮
                    </span>
                </div>
            )}
        </motion.div>
    );
}
