import React, { useState } from 'react';
import './GalleryPage.css';

const imagesAndVideos = [
  '/assets/Gallery/1.jpg',
  '/assets/Gallery/2.jpg',
  '/assets/Gallery/3.jpg',
  '/assets/Gallery/4.jpg',
  '/assets/Gallery/5.jpg',
  '/assets/Gallery/6.jpg',
  '/assets/Gallery/7.jpg',
  '/assets/Gallery/8.jpg',
  '/assets/Gallery/9.jpg',
  '/assets/Gallery/10.jpg',
  '/assets/Gallery/11.jpg',
  '/assets/Gallery/IMG-20250718-WA0001.jpg',
  '/assets/Gallery/IMG-20250718-WA0002.jpg',
  '/assets/Gallery/IMG-20250718-WA0003.jpg',
  '/assets/Gallery/IMG-20250718-WA0004.jpg',
  '/assets/Gallery/IMG-20250718-WA0005.jpg',
  '/assets/Gallery/IMG-20250718-WA0006.jpg',
  '/assets/Gallery/IMG-20250718-WA0007.jpg',
  '/assets/Gallery/IMG-20250718-WA0008.jpg',
  '/assets/Gallery/IMG-20250718-WA0009.jpg',
  '/assets/Gallery/IMG-20250718-WA0010.jpg',
  '/assets/Gallery/IMG-20250718-WA0011.jpg',
  '/assets/Gallery/IMG-20250718-WA0012.jpg',
  '/assets/Gallery/IMG-20250718-WA0013.jpg',
  '/assets/Gallery/IMG-20250718-WA0014.jpg',
  '/assets/Gallery/IMG-20250718-WA0015.jpg',
  '/assets/Gallery/IMG-20250718-WA0016.jpg',
  '/assets/Gallery/IMG-20250718-WA0017.jpg',
  '/assets/Gallery/IMG-20250718-WA0018.jpg',
  '/assets/Gallery/IMG-20250718-WA0019.jpg',
  '/assets/Gallery/IMG-20250718-WA0020.jpg',
  '/assets/Gallery/IMG-20250718-WA0021.jpg',
  '/assets/Gallery/IMG-20250718-WA0022.jpg',
  '/assets/Gallery/IMG-20250718-WA0023.jpg',
  '/assets/Gallery/IMG-20250718-WA0024.jpg',
  '/assets/Gallery/IMG-20250718-WA0025.jpg',
  '/assets/Gallery/IMG-20250718-WA0026.jpg',
  '/assets/Gallery/IMG-20250718-WA0027.jpg',
  '/assets/Gallery/IMG-20250718-WA0028.jpg',
  '/assets/Gallery/VID-20250718-WA0001.mp4',
  '/assets/Gallery/VID-20250718-WA0002.mp4',
];

const GalleryPage = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const prevImg = () => setCurrentIdx((currentIdx - 1 + imagesAndVideos.length) % imagesAndVideos.length);
  const nextImg = () => setCurrentIdx((currentIdx + 1) % imagesAndVideos.length);

  const handleImageClick = (idx) => {
    setCurrentIdx(idx);
    setFullscreen(true);
  };

  const closeFullscreen = () => setFullscreen(false);

  return (
    <div className="gallery-page">
      <h2>Hotel Gallery</h2>
      <div className="gallery-grid">
        {imagesAndVideos.map((src, idx) => (
          <div key={idx} className="gallery-thumb" onClick={() => handleImageClick(idx)}>
            {src.endsWith('.mp4') ? (
              <video src={src} className="gallery-img" controls />
            ) : (
              <img src={src} alt={`Gallery ${idx + 1}`} className="gallery-img" />
            )}
          </div>
        ))}
      </div>
      {fullscreen && (
        <div className="gallery-fullscreen" onClick={closeFullscreen}>
          <button className="gallery-nav prev" onClick={e => { e.stopPropagation(); prevImg(); }}>&lt;</button>
          {imagesAndVideos[currentIdx].endsWith('.mp4') ? (
            <video src={imagesAndVideos[currentIdx]} className="gallery-fullscreen-img" controls autoPlay />
          ) : (
            <img src={imagesAndVideos[currentIdx]} alt={`Gallery Fullscreen`} className="gallery-fullscreen-img" />
          )}
          <button className="gallery-nav next" onClick={e => { e.stopPropagation(); nextImg(); }}>&gt;</button>
          <button className="gallery-close" onClick={e => { e.stopPropagation(); closeFullscreen(); }}>×</button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
