"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect } from "react";
export default function PhotoGallery({ photos, title }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const total = photos.length;
  useEffect(() => {
    if (!playing || total < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % total), 4000);
    return () => clearInterval(timer);
  }, [playing, total]);
  const photo = photos[index];
  if (!photo) return null;
  return (
    <div className="photo-gallery">
      <div className="gallery-stage">
        <img
          src={
            typeof photo === "string"
              ? photo
              : photo.url || photo.src || photo.image
          }
          alt={photo.caption || title}
        />
        <div className="gallery-controls">
          <span aria-live="polite">
            {(index + 1).toLocaleString("bn-BD")} /{" "}
            {total.toLocaleString("bn-BD")}
          </span>
          <div>
            <button
              aria-label="আগের ছবি"
              onClick={() => setIndex((index - 1 + total) % total)}
            >
              <ChevronLeft />
            </button>
            <button
              aria-label={playing ? "স্লাইডশো থামান" : "স্লাইডশো চালান"}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={19} /> : <Play size={19} />}
            </button>
            <button
              aria-label="পরের ছবি"
              onClick={() => setIndex((index + 1) % total)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
      <p className="gallery-caption">{photo.caption || title}</p>
      <div className="gallery-thumbnails">
        {photos.map((p, i) => (
          <button
            key={i}
            aria-label={`${i + 1} নম্বর ছবি`}
            aria-pressed={index === i}
            onClick={() => setIndex(i)}
          >
            <img
              src={typeof p === "string" ? p : p.url || p.src || p.image}
              alt=""
            />
          </button>
        ))}
      </div>
    </div>
  );
}
