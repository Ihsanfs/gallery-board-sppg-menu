import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Autoplay, FreeMode, Thumbs } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";

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

function SliderDisplay() {
  const [foodItems, setFoodItems] = useState<SliderData[]>([]);
  const [activeVideo, setActiveVideo] = useState<string>("");
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null as any);
  const [activeIndex, setActiveIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}` : url;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sliderRes, videoRes] = await Promise.all([
          axios.get("http://localhost:8000/api/sliders?all=true"),
          axios.get("http://localhost:8000/api/videos/active")
        ]);
        setFoodItems(sliderRes.data);
        const videoUrl = videoRes.data.video_url;
        setActiveVideo(videoUrl);
        setIsYouTubeVideo(videoUrl && videoUrl.includes('youtube.com'));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('id-ID', { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/\./g, ":");
  const dateString = time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontSize: '24px' }}>Mempersiapkan Menu...</div>;
  if (foodItems.length === 0) return <div className="no-data">Data slider tidak ditemukan.</div>;

  const activeFood = foodItems[activeIndex] || foodItems[0];

  return (
    <div className="app-container">
      <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="header">
        <div className="header-brand">
          <div className="brand-icon">
            <img src="/favicon/favicon.svg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="brand-name">SPPG GARUT SAMARANG SAMARANG</div>
        </div>
      </motion.header>

      <div className="main-content">
        <motion.aside initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="panel-left">
          <div className="detail-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="detail-animated-wrapper"
              >
                <h2 style={{ fontFamily: 'Impact, sans-serif', fontSize: '28px', textTransform: 'uppercase' }}>{activeFood.formatted_date || activeFood.name}</h2>
                <div className="detail-section">
                  <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Nutrition Facts</h3>
                  <div className="nutrition-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Energi:</span> <strong style={{ color: 'var(--primary)' }}>{activeFood.energi}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Protein:</span> <strong style={{ color: 'var(--primary)' }}>{activeFood.protein}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Lemak:</span> <strong style={{ color: 'var(--primary)' }}>{activeFood.lemak}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Karbohidrat:</span> <strong style={{ color: 'var(--primary)' }}>{activeFood.karbohidrat}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Serat:</span> <strong style={{ color: 'var(--primary)' }}>{activeFood.serat}</strong></div>
                  </div>
                </div>
                <div className="detail-section" style={{ marginTop: '20px' }}>
                  <h3 style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}>Detail Menu</h3>
                  <div className="detail-tags" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    {activeFood.menu && activeFood.menu.map((menuItem, idx) => (
                      <span key={idx} className="tag neon-tag" style={{ background: 'rgba(0,0,0,0.05)', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', border: '1px solid #ddd' }}>
                        {idx + 1}. {menuItem}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.aside>

        <motion.section className="panel-center">
          <div className="coverflow-container">
            <Swiper
              onSlideChange={(s) => setActiveIndex(s.realIndex)}
              effect="creative"
              grabCursor={true}
              loop={foodItems.length > 1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[EffectCreative, Autoplay, FreeMode, Thumbs]}
              className="mySwiper"
              speed={1000}
              creativeEffect={{
                prev: { translate: ["-120%", 0, -500], rotate: [0, 0, -20], opacity: 0 },
                next: { translate: ["120%", 0, -500], rotate: [0, 0, 20], opacity: 0 },
              }}
            >
              {foodItems.map((item, idx) => (
                <SwiperSlide key={idx} className="swiper-slide">
                  <img src={item.image_url} alt={item.name} className="slide-image-contain" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.section>

        <motion.section className="panel-video">
          <div className="video-card">
            <div className="video-card-header">
              <div className="live-badge"><span className="dot"></span>LIVE KITCHEN</div>
              <h4>Cooking Process</h4>
            </div>
            <div className="video-wrapper">
              {isYouTubeVideo ? (
                <iframe
                  key={activeVideo}
                  src={getYouTubeEmbedUrl(activeVideo)}
                  className="aesthetic-video-panel"
                  style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  key={activeVideo}
                  src={activeVideo || "/masak.mp4"}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="aesthetic-video-panel"
                  style={{ pointerEvents: 'none' }}
                ></video>
              )}
            </div>
          </div>
        </motion.section>

        <motion.aside className="panel-right" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="time-section" style={{ textAlign: 'center', background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div className="current-time" style={{ fontSize: '48px', fontWeight: '900', color: '#2b3674' }}>{timeString}</div>
            <div className="current-date" style={{ fontSize: '14px', fontWeight: 'bold', color: '#a3aed0', textTransform: 'uppercase', letterSpacing: '1px' }}>{dateString}</div>
          </div>

          <div className="right-gallery" style={{ marginTop: '20px' }}>
            <div className="right-gallery-title" style={{ fontSize: '14px', fontWeight: '900', marginBottom: '15px' }}>GALERI MENU SPPG</div>
            <div className="right-gallery-slider">
              <Swiper
                direction="vertical"
                slidesPerView={3}
                spaceBetween={12}
                loop={foodItems.length > 3}
                autoplay={{ delay: 3000 }}
                modules={[Autoplay]}
                className="vertical-swiper"
                style={{ height: '350px' }}
              >
                {foodItems.map((item, idx) => (
                  <SwiperSlide key={idx} className="vertical-slide">
                    <div className="mini-card" style={{ cursor: 'pointer' }} onClick={() => setActiveIndex(idx)}>
                      <img src={item.image_url} alt={item.name} />
                      <div className="mini-card-overlay"><span>{item.name}</span></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </motion.aside>
      </div>

      <motion.div className="bottom-slider" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Swiper
          // onSwiper={setThumbsSwiper}
          spaceBetween={16}
          slidesPerView="auto"
          loop={foodItems.length > 5}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={5000}
          modules={[Autoplay, Thumbs, FreeMode]}
          className="bottom-swiper continuous-slider"
        >
          {foodItems.map((item, idx) => (
            <SwiperSlide key={idx} className="swiper-slide" style={{ width: '150px' }}>
              <img src={item.image_url} alt={item.name} style={{ borderRadius: '12px' }} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SliderDisplay />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
