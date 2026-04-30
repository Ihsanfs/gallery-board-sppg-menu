import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Video,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Menu as MenuIcon,
  X,
  Layout,
  UtensilsCrossed
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SliderData {
  id: number;
  name: string;
  menu_date: string;
  formatted_date: string;
  image_url: string;
  energi: string;
  protein: string;
  lemak: string;
  karbohidrat: string;
  serat: string;
  menu: string[];
}

interface VideoData {
  id: number;
  title: string;
  video_url: string;
  is_active: boolean;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("sliders");
  const [sliders, setSliders] = useState<SliderData[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Slider Form State
  const [name, setName] = useState("");
  const [menuDate, setMenuDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [energi, setEnergi] = useState("");
  const [protein, setProtein] = useState("");
  const [lemak, setLemak] = useState("");
  const [karbohidrat, setKarbohidrat] = useState("");
  const [serat, setSerat] = useState("");
  const [menuItems, setMenuItems] = useState<string[]>([""]);

  // Video Form State
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSource, setVideoSource] = useState<"local" | "youtube">("local");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  // Helper function to format date to Indonesian format
  const formatDateToIndonesian = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${monthName} ${year}`;
  };

  // Auto-generate name when menuDate changes
  useEffect(() => {
    if (menuDate) {
      setName(formatDateToIndonesian(menuDate));
    }
  }, [menuDate]);

  useEffect(() => {
    if (token) {
      if (activeTab === "sliders") fetchSliders();
      else if (activeTab === "videos") fetchVideos();
    }
  }, [token, activeTab]);

  const fetchSliders = async (page = 1) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/sliders?page=${page}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setSliders(response.data.data);
      setPagination(response.data);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/videos", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const resetForm = () => {
    setName(""); setMenuDate(""); setImage(null); setEnergi(""); setProtein("");
    setLemak(""); setKarbohidrat(""); setSerat(""); setMenuItems([""]);
    setEditId(null);
  };

  const handleSliderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("menu_date", menuDate);
    if (image) formData.append("image", image);
    formData.append("energi", energi);
    formData.append("protein", protein);
    formData.append("lemak", lemak);
    formData.append("karbohidrat", karbohidrat);
    formData.append("serat", serat);
    menuItems.filter(item => item.trim() !== "").forEach((item, index) => {
      formData.append(`menu[${index}]`, item);
    });

    if (editId) formData.append("_method", "PUT");

    try {
      const url = editId ? `http://localhost:8000/api/sliders/${editId}` : "http://localhost:8000/api/sliders";
      await axios.post(url, formData, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setShowModal(false);
      resetForm();
      fetchSliders(pagination?.current_page || 1);
    } catch (error: any) {
      alert("Gagal menyimpan data.");
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append("title", videoTitle);

    if (videoSource === "youtube") {
      formData.append("youtube_url", youtubeUrl);
    } else {
      if (!videoFile) {
        alert("Pilih file video terlebih dahulu.");
        setUploading(false);
        return;
      }
      formData.append("video", videoFile);
    }

    try {
      await axios.post("http://localhost:8000/api/videos", formData, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setVideoTitle("");
      setVideoFile(null);
      setYoutubeUrl("");
      setVideoSource("local");
      fetchVideos();
    } catch (error) {
      alert("Gagal mengunggah video.");
    } finally {
      setUploading(false);
    }
  };

  const activateVideo = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/api/videos/${id}/activate`, {}, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchVideos();
    } catch (error) {
      alert("Gagal mengaktifkan video.");
    }
  };

  const deleteVideo = async (id: number) => {
    if (!window.confirm("Hapus video ini?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/videos/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchVideos();
    } catch (error) {
      alert("Gagal menghapus video.");
    }
  };

  if (!token) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 admin-layout">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col z-30`}>
        <div className="h-20 flex items-center px-6 gap-3 border-b border-white/5">
          <div className="bg-blue-600 p-2 rounded-xl shrink-0">
            <Layout className="text-white w-6 h-6" />
          </div>
          {sidebarOpen && <span className="font-black text-white text-xl tracking-tight italic">SPPG ADMIN</span>}
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("sliders")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'sliders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <UtensilsCrossed className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-bold tracking-wide">Menu Sliders</span>}
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'videos' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Video className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-bold tracking-wide">Live Kitchen</span>}
          </button>

          <div className="my-6 px-4">
             <div className="h-px bg-white/5 w-full"></div>
          </div>

          <a href="/" target="_blank" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <ExternalLink className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-bold tracking-wide">Public Site</span>}
          </a>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-bold tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
              <MenuIcon className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-black text-slate-900">Administrator</p>
              <span className="text-[10px] font-black text-emerald-500 tracking-tighter uppercase">● Active Session</span>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black shadow-inner border border-slate-200">
               A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {activeTab === "sliders" && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sliders Display</h1>
                    <p className="text-slate-500 font-medium">Configure your daily menu gallery</p>
                  </div>
                  <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.25rem] font-black flex items-center justify-center gap-2 shadow-2xl shadow-blue-500/30 transition-all active:scale-95"
                  >
                    <Plus className="w-6 h-6" /> TAMBAH SLIDER
                  </button>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Preview</th>
                          <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Title / Info</th>
                          <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nutrients</th>
                          <th className="px-8 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sliders.length > 0 ? sliders.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-8 py-5">
                              <img src={s.image_url} className="w-24 h-14 object-cover rounded-2xl shadow-md border border-white" alt="" />
                            </td>
                            <td className="px-8 py-5">
                              <p className="font-black text-slate-800">{s.formatted_date || s.name}</p>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slider ID: #{s.id}</span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-wrap gap-2">
                                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black italic">E: {s.energi}</div>
                                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black italic">P: {s.protein}</div>
                                <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black italic">L: {s.lemak}</div>
                                <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[10px] font-black italic">K: {s.karbohidrat}</div>
                                <div className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black italic">S: {s.serat}</div>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => {
                                    setEditId(s.id); setName(s.name); setMenuDate(s.menu_date); setEnergi(s.energi);
                                    setProtein(s.protein); setLemak(s.lemak); setKarbohidrat(s.karbohidrat);
                                    setSerat(s.serat); setMenuItems(s.menu || [""]); setShowModal(true);
                                  }}
                                  className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-100 transition-all"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={async () => { if(window.confirm("Yakin hapus?")) { await axios.delete(`http://localhost:8000/api/sliders/${s.id}`, { headers: { "Authorization": `Bearer ${token}` } }); fetchSliders(pagination.current_page); } }}
                                  className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic">No data available</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {pagination && pagination.last_page > 1 && (
                    <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Displaying Page {pagination.current_page} of {pagination.last_page}</span>
                      <div className="flex gap-2">
                        <button disabled={pagination.current_page === 1} onClick={() => fetchSliders(pagination.current_page - 1)} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all">
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button disabled={pagination.current_page === pagination.last_page} onClick={() => fetchSliders(pagination.current_page + 1)} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "videos" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                    <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight italic uppercase">Upload Video</h3>
                    <form onSubmit={handleVideoSubmit} className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Video Title</label>
                        <input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-600/10 outline-none font-bold text-sm transition-all" required />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Video Source</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setVideoSource("local")}
                            className={`flex-1 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                              videoSource === "local"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            Local File
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoSource("youtube")}
                            className={`flex-1 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                              videoSource === "youtube"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            YouTube
                          </button>
                        </div>
                      </div>

                      {videoSource === "local" ? (
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">MP4 File</label>
                          <input type="file" accept="video/mp4" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-600 file:uppercase file:tracking-widest cursor-pointer" required />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">YouTube URL</label>
                          <input
                            type="url"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-600/10 outline-none font-bold text-sm transition-all"
                            required
                          />
                        </div>
                      )}
                      <button type="submit" disabled={uploading} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black tracking-widest text-xs shadow-2xl transition-all disabled:opacity-50">
                        {uploading ? "PROCESSING..." : "PUSH VIDEO"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Video Library</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {videos.map((v) => (
                       <div key={v.id} className={`bg-white rounded-[2.5rem] overflow-hidden border-4 transition-all ${v.is_active ? 'border-blue-600 shadow-2xl shadow-blue-500/20' : 'border-transparent shadow-xl shadow-slate-200/50'}`}>
                          <div className="aspect-video bg-black relative">
                            {v.video_url && v.video_url.includes('youtube.com') ? (
                              <iframe
                                src={getYouTubeEmbedUrl(v.video_url)}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video src={v.video_url} className="w-full h-full object-cover opacity-80" />
                            )}
                            {v.is_active && <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] shadow-xl">● LIVE NOW</div>}
                          </div>
                          <div className="p-8 flex justify-between items-center">
                            <div>
                              <p className="font-black text-slate-900 text-lg truncate max-w-[120px]">{v.title}</p>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Video Content</span>
                            </div>
                            <div className="flex gap-3">
                              {!v.is_active && <button onClick={() => activateVideo(v.id)} className="bg-blue-50 text-blue-600 p-3 rounded-2xl hover:bg-blue-100 transition-all"><CheckCircle className="w-5 h-5" /></button>}
                              <button onClick={() => deleteVideo(v.id)} className="bg-red-50 text-red-500 p-3 rounded-2xl hover:bg-red-100 transition-all"><Trash2 className="w-5 h-5" /></button>
                            </div>
                          </div>
                       </div>
                   ))}
                 </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowModal(false)}></motion.div>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl custom-scrollbar">
               <div className="p-12">
                 <div className="flex justify-between items-center mb-12">
                   <div>
                     <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">{editId ? 'Edit Data' : 'New Entry'}</h2>
                     <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Slider Configuration System</p>
                   </div>
                   <button onClick={() => setShowModal(false)} className="p-4 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all"><X className="w-6 h-6" /></button>
                 </div>

                 <form onSubmit={handleSliderSubmit} className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="col-span-full">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Tanggal Menu</label>
                       <input type="date" value={menuDate} onChange={(e) => setMenuDate(e.target.value)} required className="w-full px-8 py-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-600/10 font-bold transition-all text-sm" />
                     </div>
                     <div className="col-span-full">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Label Name (Auto-Generated)</label>
                       <input value={name} disabled className="w-full px-8 py-5 bg-slate-100 rounded-[1.5rem] outline-none font-bold transition-all text-sm text-slate-600 cursor-not-allowed" placeholder="Pilih tanggal terlebih dahulu" />
                     </div>
                     <div className="col-span-full">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Product Image</label>
                       <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} required={!editId} className="text-xs file:bg-blue-600 file:text-white file:border-0 file:px-6 file:py-3 file:rounded-2xl file:mr-6 file:font-black file:uppercase file:tracking-widest file:shadow-lg file:shadow-blue-500/20" />
                     </div>
                     <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Energi</label>
                       <input value={energi} onChange={(e) => setEnergi(e.target.value)} placeholder="320 kcal" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" />
                     </div>
                     <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Protein</label>
                       <input value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="24g" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" />
                     </div>
                     <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Lemak</label>
                       <input value={lemak} onChange={(e) => setLemak(e.target.value)} placeholder="12g" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" />
                     </div>
                     <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Karbohidrat</label>
                       <input value={karbohidrat} onChange={(e) => setKarbohidrat(e.target.value)} placeholder="35g" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" />
                     </div>
                     <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Serat</label>
                       <input value={serat} onChange={(e) => setSerat(e.target.value)} placeholder="4g" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" />
                     </div>
                   </div>

                   <div className="space-y-6">
                     <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Kitchen Recipe / Menu</label>
                       <button type="button" onClick={() => setMenuItems([...menuItems, ""])} className="text-blue-600 font-black text-[10px] tracking-widest uppercase hover:underline">+ Add Row</button>
                     </div>
                     <div className="grid grid-cols-1 gap-3">
                       {menuItems.map((item, idx) => (
                         <div key={idx} className="flex gap-3 group">
                           <input value={item} onChange={(e) => { const n = [...menuItems]; n[idx] = e.target.value; setMenuItems(n); }} className="flex-1 px-8 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm transition-all group-hover:bg-slate-100" placeholder="Recipe item detail..." />
                           {menuItems.length > 1 && <button type="button" onClick={() => { const n = [...menuItems]; n.splice(idx,1); setMenuItems(n); }} className="text-red-400 hover:text-red-600 font-black text-2xl px-2">×</button>}
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4 pt-6">
                     <button type="submit" className="flex-1 bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-all">Publish Content</button>
                     <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Cancel</button>
                   </div>
                 </form>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
