import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
    Pencil,
    Settings as SettingsIcon,
    Bot,
    Database,
    Upload,
    Save,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    FileText
} from "lucide-react";
import useAxiosSecure from "../hooks/useAxios";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("general");
    const [rate, setRate] = useState(1530);
    const [systemPrompt, setSystemPrompt] = useState("");
    const [isEditingRate, setIsEditingRate] = useState(false);
    const [isEditingAI, setIsEditingAI] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [kbFile, setKbFile] = useState(null);
    const [kbFiles, setKbFiles] = useState([]);

    const axiosSecure = useAxiosSecure();
    const fileInputRef = useRef(null);

    const fetchKbFiles = async () => {
        try {
            const res = await axiosSecure.get("/api/v1/knowledge/");
            if (res.data && res.data.files) {
                setKbFiles(res.data.files);
            }
        } catch (error) {
            console.error("Failed to fetch knowledge base files:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Rate
                const rateRes = await axiosSecure.get("/api/v1/leads/rate/");
                if (rateRes.data && rateRes.data.iqd_rate) {
                    setRate(rateRes.data.iqd_rate);
                }

                // Fetch System Prompt
                const promptRes = await axiosSecure.get("/api/v1/prompt/");
                if (promptRes.data && promptRes.data.prompt) {
                    setSystemPrompt(promptRes.data.prompt);
                }

                // Fetch Knowledge Base Files
                await fetchKbFiles();
            } catch (error) {
                console.error("Failed to fetch settings data:", error);
            }
        };
        fetchData();
    }, [axiosSecure]);

    const handleSaveRate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axiosSecure.post("/api/v1/leads/rate/", { iqd_rate: Number(rate) });
            toast.success("Conversion rate updated!");
            setIsEditingRate(false);
        } catch (error) {
            toast.error("Failed to update rate");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAI = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axiosSecure.put("/api/v1/prompt/", { prompt: systemPrompt });
            toast.success("AI configuration updated!");
            setIsEditingAI(false);
        } catch (error) {
            console.error("Failed to update AI prompt:", error);
            toast.error("Failed to update AI config");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setKbFile(file);
        }
    };

    const processKbUpload = async () => {
        if (!kbFile) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", kbFile);
            await axiosSecure.post("/api/v1/knowledge/upload/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Knowledge base file uploaded!");
            setKbFile(null);
            await fetchKbFiles();
        } catch (error) {
            console.error("Upload failed:", error);
            const errMsg = error.response?.data?.detail || "Upload failed";
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteKbFile = async (knowledgeId, filename) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete "${filename}" from the knowledge base?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00CE51",
            cancelButtonColor: "#262626",
            confirmButtonText: "Yes, delete it!",
            background: "#1A1A1A",
            color: "#FFFFFF",
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);
        try {
            await axiosSecure.delete(`/api/v1/knowledge/${knowledgeId}/`);
            toast.success("Knowledge base file deleted!");
            await fetchKbFiles();
        } catch (error) {
            console.error("Deletion failed:", error);
            toast.error("Failed to delete file");
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: "general", label: "General", icon: <SettingsIcon size={18} />, desc: "Global application parameters" },
        { id: "ai", label: "AI Config", icon: <Bot size={18} />, desc: "Behavior & personality settings" },
        { id: "kb", label: "Knowledge Base", icon: <Database size={18} />, desc: "Training data for AI" },
    ];

    return (
        <div className="p-6 h-full flex flex-col bg-[#0B0B0B] text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your application configuration and AI behavior</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-grow">
                {/* Internal Sidebar */}
                <div className="w-full lg:w-64 flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all border ${activeTab === tab.id
                                    ? "bg-[#00CE51]/10 border-[#00CE51]/20 text-[#00CE51] shadow-[0_0_20px_rgba(0,206,81,0.05)]"
                                    : "bg-[#1A1A1A] border-transparent text-gray-500 hover:bg-[#222] hover:text-gray-300"
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${activeTab === tab.id ? "bg-[#00CE51] text-[#0B0B0B]" : "bg-[#0B0B0B]"}`}>
                                {tab.icon}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold">{tab.label}</p>
                                <p className="text-[10px] opacity-60 line-clamp-1">{tab.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-grow bg-[#1A1A1A] border border-[#262626] rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00CE51]/5 blur-[100px] -mr-32 -mt-32 pointer-events-none rounded-full" />

                    <div className="relative z-10 max-w-3xl">
                        {activeTab === "general" && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <DollarSign className="text-[#00CE51]" size={20} />
                                    Currency Configuration
                                </h2>

                                <form onSubmit={handleSaveRate} className="space-y-6">
                                    <div className="p-6 bg-[#0B0B0B] rounded-xl border border-[#262626]">
                                        <label className="block text-sm font-medium text-gray-400 mb-4">
                                            Dollar Conversion Rate (IQD)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-gray-500 text-sm font-mono">$1 = </span>
                                            </div>
                                            <input
                                                type="number"
                                                className={`bg-[#141414] border ${isEditingRate ? 'border-[#00CE51]' : 'border-[#262626]'} text-white text-lg font-mono rounded-xl focus:ring-[#00CE51] focus:border-[#00CE51] block w-full pl-14 pr-12 py-4 outline-none transition-all disabled:opacity-50`}
                                                value={rate}
                                                onChange={(e) => setRate(e.target.value)}
                                                disabled={!isEditingRate}
                                            />
                                            {!isEditingRate && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditingRate(true)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#00CE51] transition-colors"
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="mt-4 text-xs text-gray-600">
                                            This rate is used globally for all price calculations in the system.
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!isEditingRate || isLoading}
                                            className={`flex items-center gap-2 font-bold py-3 px-8 rounded-xl transition-all ${isEditingRate
                                                    ? "bg-[#00CE51] hover:bg-[#00b045] text-[#0B0B0B] shadow-[0_10px_20px_rgba(0,206,81,0.2)]"
                                                    : "bg-[#262626] text-gray-600 cursor-not-allowed"
                                                }`}
                                        >
                                            <Save size={18} />
                                            {isLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "ai" && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Bot className="text-[#00CE51]" size={20} />
                                    AI System Prompt
                                </h2>

                                <form onSubmit={handleSaveAI} className="space-y-6">
                                    <div className="p-6 bg-[#0B0B0B] rounded-xl border border-[#262626]">
                                        <label className="block text-sm font-medium text-gray-400 mb-4">
                                            Core Personality & Instructions
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                rows={12}
                                                className={`bg-[#141414] border ${isEditingAI ? 'border-[#00CE51]' : 'border-[#262626]'} text-white text-sm rounded-xl focus:ring-[#00CE51] focus:border-[#00CE51] block w-full p-4 pr-12 outline-none transition-all resize-none font-mono leading-relaxed disabled:opacity-50`}
                                                placeholder="You are an expert sales assistant for switch2online..."
                                                value={systemPrompt}
                                                onChange={(e) => setSystemPrompt(e.target.value)}
                                                disabled={!isEditingAI}
                                            />
                                            {!isEditingAI && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditingAI(true)}
                                                    className="absolute top-4 right-4 text-gray-400 hover:text-[#00CE51] transition-colors"
                                                    title="Edit Prompt"
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-4 flex items-start gap-2 text-xs text-gray-600 italic">
                                            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                                            The system prompt defines how the AI interacts with customers. Changes here take effect immediately for all new conversations.
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!isEditingAI || isLoading}
                                            className={`flex items-center gap-2 font-bold py-3 px-8 rounded-xl transition-all ${isEditingAI
                                                    ? "bg-[#00CE51] hover:bg-[#00b045] text-[#0B0B0B] shadow-[0_10px_20px_rgba(0,206,81,0.2)]"
                                                    : "bg-[#262626] text-gray-600 cursor-not-allowed"
                                                }`}
                                        >
                                            <Save size={18} />
                                            {isLoading ? "Updating AI..." : "Update Config"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "kb" && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Database className="text-[#00CE51]" size={20} />
                                    AI Knowledge Base
                                </h2>

                                <div className="space-y-6">
                                    <div
                                        className={`bg-[#0B0B0B] border-2 border-dashed rounded-2xl p-12 text-center transition-all ${kbFile ? 'border-[#00CE51] bg-[#00CE51]/5' : 'border-[#262626] hover:border-[#00CE51]/30'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-2xl ${kbFile ? 'bg-[#00CE51] text-[#0B0B0B]' : 'bg-[#1A1A1A] text-gray-500'
                                                }`}>
                                                <FileText size={40} />
                                            </div>

                                            <h3 className="text-white font-bold text-xl mb-2">
                                                {kbFile ? "File Selected" : "Upload Knowledge Source"}
                                            </h3>
                                            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
                                                Upload PDF, DOCX or TXT files to provide the AI with specific business knowledge, FAQs, and product details.
                                            </p>

                                            {!kbFile ? (
                                                <button
                                                    onClick={() => fileInputRef.current.click()}
                                                    className="bg-[#00CE51]/10 text-[#00CE51] border border-[#00CE51]/20 hover:bg-[#00CE51] hover:text-[#0B0B0B] px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-3"
                                                >
                                                    <Upload size={20} />
                                                    Browse Files
                                                </button>
                                            ) : (
                                                <div className="w-full max-w-sm space-y-4">
                                                    <div className="flex items-center justify-between gap-4 text-[#00CE51] bg-[#00CE51]/10 px-5 py-3 rounded-xl border border-[#00CE51]/30">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <CheckCircle2 size={18} className="flex-shrink-0" />
                                                            <span className="text-sm font-bold truncate">{kbFile.name}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => setKbFile(null)}
                                                            className="text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={processKbUpload}
                                                        disabled={isLoading}
                                                        className="w-full bg-[#00CE51] text-[#0B0B0B] py-4 rounded-xl font-bold shadow-[0_10px_30px_rgba(0,206,81,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {isLoading ? "Syncing..." : "Sync Knowledge Base"}
                                                    </button>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept=".pdf,.docx,.txt"
                                                onChange={handleFileUpload}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Active Knowledge ({kbFiles.length})
                                            </p>
                                        </div>

                                        {kbFiles.length === 0 ? (
                                            <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-xl text-center text-gray-500 text-xs font-medium">
                                                No active knowledge base files. Upload a source file above to sync!
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-3">
                                                {kbFiles.map((file) => (
                                                    <div
                                                        key={file.id}
                                                        className="flex items-center justify-between p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl transition-all hover:border-[#00CE51]/20 group"
                                                    >
                                                        <div className="flex items-center gap-3 overflow-hidden text-left">
                                                            <div className="p-2 bg-white/5 text-gray-400 rounded-lg flex-shrink-0">
                                                                <FileText size={18} className="text-[#00CE51]" />
                                                            </div>
                                                            <div className="truncate">
                                                                <p className="text-sm font-bold text-white truncate">
                                                                    {file.original_filename}
                                                                </p>
                                                                <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                                                                    {file.characters?.toLocaleString() || 0} chars • Uploaded {new Date(file.uploaded_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[9px] font-extrabold bg-[#00CE51]/10 text-[#00CE51] border border-[#00CE51]/20 px-2 py-1 rounded uppercase tracking-wider">
                                                                SYNCED
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteKbFile(file.id, file.original_filename)}
                                                                disabled={isLoading}
                                                                className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                                                                title="Delete file"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
