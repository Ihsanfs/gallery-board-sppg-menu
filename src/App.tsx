import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Autoplay, Pagination, FreeMode, Thumbs } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const foodItems = [
  { name: " Senin 19 April 2026", src: "WhatsApp Image 2026-04-02 at 06.36.48.jpeg", energi: "320 kcal", protein: "24g", lemak: "12g", karbohidrat: "35g", serat: "4g", menu: ["Nasi Putih", "Ayam Suwir", "Tumis Buncis Wortel", "Telur Balado"] },
  { name: " Selasa 20 April 2026", src: "WhatsApp Image 2026-04-07 at 06.16.10.jpeg", energi: "450 kcal", protein: "30g", lemak: "18g", karbohidrat: "42g", serat: "6g", menu: ["Nasi Kuning", "Ayam Goreng", "Perkedel", "Sambal Goreng Ati"] },
  { name: " Rabu 21 April 2026", src: "WhatsApp Image 2026-04-10 at 06.53.40.jpeg", energi: "280 kcal", protein: "15g", lemak: "8g", karbohidrat: "40g", serat: "10g", menu: ["Nasi Uduk", "Telur Dadar", "Tempe Orek", "Bihun Goreng"] },
  { name: " Kamis 22 April 2026", src: "WhatsApp Image 2026-04-11 at 07.20.22.jpeg", energi: "510 kcal", protein: "35g", lemak: "22g", karbohidrat: "45g", serat: "3g", menu: ["Nasi Goreng", "Telur Mata Sapi", "Acar", "Kerupuk Udang"] },
  { name: " Jumat 23 April 2026", src: "WhatsApp Image 2026-04-14 at 06.52.16.jpeg", energi: "390 kcal", protein: "28g", lemak: "15g", karbohidrat: "38g", serat: "5g", menu: ["Nasi Liwet", "Ikan Teri", "Tahu Goreng", "Sayur Asem"] },
  { name: " Sabtu 24 April 2026", src: "WhatsApp Image 2026-04-15 at 06.38.04.jpeg", energi: "420 kcal", protein: "20g", lemak: "16g", karbohidrat: "50g", serat: "8g", menu: ["Nasi Merah", "Ayam Bakar", "Lalapan", "Sambal Terasi"] },
  { name: " Minggu 25 April 2026", src: "WhatsApp Image 2026-01-19 at 06.18.44.jpeg", energi: "340 kcal", protein: "18g", lemak: "14g", karbohidrat: "30g", serat: "7g", menu: ["Nasi Kebuli", "Daging Kambing", "Acar Nanas", "Emping"] },
  { name: " Senin 26 April 2026", src: "WhatsApp Image 2026-01-22 at 06.25.13.jpeg", energi: "480 kcal", protein: "32g", lemak: "20g", karbohidrat: "40g", serat: "2g", menu: ["Nasi Rames", "Rendang Daging", "Daun Singkong", "Gulai Nangka"] },
  { name: " Selasa 27 April 2026", src: "WhatsApp Image 2026-01-28 at 06.49.52.jpeg", energi: "310 kcal", protein: "22g", lemak: "10g", karbohidrat: "28g", serat: "6g", menu: ["Nasi Pecel", "Sayuran Rebus", "Peyek Kacang", "Bumbu Kacang"] },
  { name: " Rabu 28 April 2026", src: "WhatsApp Image 2026-01-30 at 06.30.41.jpeg", energi: "400 kcal", protein: "25g", lemak: "18g", karbohidrat: "32g", serat: "5g", menu: ["Nasi Campur", "Sate Lilit", "Lawar", "Sambal Matah"] },
  { name: " Kamis 29 April 2026", src: "WhatsApp Image 2026-01-29 at 08.22.28 (1).jpeg", energi: "350 kcal", protein: "20g", lemak: "12g", karbohidrat: "38g", serat: "4g", menu: ["Nasi Putih", "Ayam Kecap", "Tumis Sawi", "Bakwan Jagung"] },
  { name: " Jumat 30 April 2026", src: "WhatsApp Image 2026-01-29 at 08.22.28.jpeg", energi: "420 kcal", protein: "28g", lemak: "15g", karbohidrat: "45g", serat: "5g", menu: ["Nasi Kebuli", "Daging Sapi", "Acar Kuning", "Kerupuk"] },
  { name: " Sabtu 01 Mei 2026", src: "WhatsApp Image 2026-02-02 at 07.36.26.jpeg", energi: "380 kcal", protein: "22g", lemak: "14g", karbohidrat: "40g", serat: "6g", menu: ["Nasi Liwet", "Ayam Goreng", "Lalapan", "Sambal Dadak"] },
  { name: " Minggu 02 Mei 2026", src: "WhatsApp Image 2026-02-03 at 06.13.06.jpeg", energi: "410 kcal", protein: "24g", lemak: "16g", karbohidrat: "35g", serat: "7g", menu: ["Nasi Kuning", "Empal Gentong", "Perkedel", "Sambal"] },
  { name: " Senin 03 Mei 2026", src: "WhatsApp Image 2026-02-04 at 08.14.47.jpeg", energi: "390 kcal", protein: "26g", lemak: "12g", karbohidrat: "42g", serat: "4g", menu: ["Nasi Putih", "Ikan Goreng", "Sayur Sop", "Tempe Goreng"] },
  { name: " Selasa 04 Mei 2026", src: "WhatsApp Image 2026-02-05 at 08.04.22.jpeg", energi: "440 kcal", protein: "30g", lemak: "18g", karbohidrat: "30g", serat: "5g", menu: ["Nasi Rames", "Opor Ayam", "Sambal Goreng Kentang", "Telur Rebus"] },
  { name: " Rabu 05 Mei 2026", src: "WhatsApp Image 2026-02-06 at 11.08.37.jpeg", energi: "320 kcal", protein: "18g", lemak: "10g", karbohidrat: "40g", serat: "8g", menu: ["Nasi Merah", "Pepes Ikan", "Urap Sayur", "Tahu Bacem"] },
  { name: " Kamis 06 Mei 2026", src: "WhatsApp Image 2026-02-09 at 06.31.15.jpeg", energi: "460 kcal", protein: "32g", lemak: "20g", karbohidrat: "38g", serat: "3g", menu: ["Nasi Goreng Spesial", "Sosis", "Nugget", "Telur Ceplok"] },
  { name: " Jumat 07 Mei 2026", src: "WhatsApp Image 2026-02-11 at 07.05.24.jpeg", energi: "370 kcal", protein: "20g", lemak: "14g", karbohidrat: "42g", serat: "6g", menu: ["Nasi Uduk", "Semur Jengkol", "Teri Kacang", "Emping"] },
  { name: " Sabtu 08 Mei 2026", src: "WhatsApp Image 2026-02-12 at 06.52.30.jpeg", energi: "400 kcal", protein: "25g", lemak: "15g", karbohidrat: "36g", serat: "5g", menu: ["Nasi Campur", "Sate Ayam", "Sayur Lodeh", "Sambal"] },
  { name: " Minggu 09 Mei 2026", src: "WhatsApp Image 2026-02-13 at 05.46.34.jpeg", energi: "430 kcal", protein: "28g", lemak: "18g", karbohidrat: "40g", serat: "4g", menu: ["Nasi Putih", "Rendang Daging", "Sayur Kapau", "Sambal Hijau"] },
];

export default function App() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null as any);
  const [activeIndex, setActiveIndex] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('id-ID', { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/\./g, ":");
  const dateString = time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const activeFood = foodItems[activeIndex] || foodItems[0];

  return (
    <div className="app-container">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="header"
      >
        <div className="header-brand">
          <div className="brand-icon">
            <img src="/favicon/favicon.svg" alt="SPPG Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="brand-name">SPPG GARUT SAMARANG SAMARANG</div>
        </div>

        {/* <div className="header-nav">
          <button className="nav-btn">
            <img src="/favicon/favicon.svg" alt="Home" className="nav-icon" />
            <span>Home</span>
          </button>
          <button className="nav-btn">
            <img src="/favicon/favicon.svg" alt="Menu" className="nav-icon" />
            <span>Menu</span>
          </button>
          <button className="nav-btn">
            <img src="/favicon/favicon.svg" alt="Contact" className="nav-icon" />
            <span>Info</span>
          </button>
        </div> */}


      </motion.header>

      {/* Main Layout */}
      <div className="main-content">

        {/* Left Panel */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="panel-left"
        >
          {/* <div className="panel-header">
            <div className="panel-label">MENU</div>
            <h1 className="panel-title">{activeFood.name}</h1>
          </div> */}
          <div className="detail-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="detail-animated-wrapper"
              >
                <h2 style={{
                  fontFamily: 'Impact, sans-serif',
                  fontSize: '28px', // Slightly smaller for better balance
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid rgba(0,0,0,0.05)',
                  paddingBottom: '10px',
                  letterSpacing: '1px',
                  lineHeight: '1.2'
                }}>
                  {activeFood.name}
                </h2>
                <div className="detail-section">
                  <h3>Nutrition Facts</h3>
                  <div className="nutrition-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Energi:</span> <strong style={{ color: 'var(--primary)' }}>{activeFood.energi}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Protein:</span> <strong style={{ color: 'var(--primary)' }}>{activeFood.protein}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Lemak:</span> <strong style={{ color: 'var(--primary)' }}>{activeFood.lemak}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Karbohidrat:</span> <strong style={{ color: 'var(--primary)' }}>{activeFood.karbohidrat}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Serat:</span> <strong style={{ color: 'var(--primary)' }}>{activeFood.serat}</strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section" style={{ marginTop: '20px' }}>
                  <h3 className="text-black font-bold mb-3 uppercase tracking-wider text-xs">Detail Menu</h3>
                  <div className="detail-tags" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
                    {activeFood.menu.map((menuItem, idx) => (
                      <span key={idx} className="tag neon-tag !text-black !font-bold">
                        {idx + 1}. {menuItem}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.aside>

        {/* Center Panel (3D Bounce/Creative) */}
        <motion.section
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="panel-center"
        >
          <div className="coverflow-container">
            <Swiper
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              effect="creative"
              grabCursor={true}
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              speed={1000}
              creativeEffect={{
                prev: {
                  translate: ["-100%", 0, -400],
                  rotate: [0, 45, 0],
                  scale: 0.8,
                  opacity: 0,
                },
                next: {
                  translate: ["100%", 0, -400],
                  rotate: [0, -45, 0],
                  scale: 0.8,
                  opacity: 0,
                },
              }}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[EffectCreative, Autoplay, FreeMode, Thumbs]}
              className="mySwiper"
            >
              {foodItems.map((item, idx) => (
                <SwiperSlide key={idx} className="swiper-slide">
                  <img src={`/${item.src}`} alt={item.name} className="slide-image-contain" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.section>

        {/* Video Kitchen Panel (New 4th Container) */}
        <motion.section
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="panel-video"
        >
          <div className="video-card">
            <div className="video-card-header">
              <div className="live-badge">
                <span className="dot"></span>
                LIVE KITCHEN
              </div>
              <h4>Cooking Process</h4>
            </div>
            <div className="video-wrapper">
              <video
                src="/masak.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="aesthetic-video-panel"
              ></video>
            </div>
            {/* <div className="video-info">
              <p>Proses memasak di dapur SPPG</p>
            </div> */}
          </div>
        </motion.section>

        {/* Right Panel */}
        <motion.aside
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="panel-right"
        >
          <div className="time-section">
            <div className="current-time-wrapper">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={timeString}
                  initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="current-time"
                  style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}
                >
                  {timeString} <span style={{ marginLeft: '10px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '18px' }}>WIB</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="current-date">{dateString}</div>
            {/* <div className="promo-badge">Live Promo</div> */}
          </div>

          <div className="right-gallery">
            <div className="right-gallery-title">GALERI MENU SPPG</div>
            <div className="right-gallery-slider">
              <Swiper
                direction="vertical"
                slidesPerView="auto"
                spaceBetween={12}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                speed={800}
                modules={[Autoplay]}
                className="vertical-swiper"
              >
                {foodItems.map((item, idx) => (
                  <SwiperSlide key={idx} className="vertical-slide">
                    <div className="mini-card">
                      <img src={`/${item.src}`} alt={item.name} />
                      <div className="mini-card-overlay">
                        <span>{item.name}</span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Bottom Slider (Continuous Infinity) */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="bottom-slider"
      >
        <div className="slider-label">Gallery</div>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={16}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={5000}
          grabCursor={true}
          modules={[Thumbs, Autoplay]}
          className="bottom-swiper continuous-slider"
        >
          {foodItems.map((item, idx) => (
            <SwiperSlide key={idx} className="swiper-slide">
              <img src={`/${item.src}`} alt={item.name} />
              <div className="slide-number">0{idx + 1}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
}
