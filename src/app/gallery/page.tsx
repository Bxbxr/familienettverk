"use client"; // This page is now interactive, so it must be a Client Component

import { useState } from "react";
import Image from "next/image";
import styles from "./gallery.module.css";

// Import the lightbox components and styles
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Your list of image filenames in the public/images/gallery folder
const images = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
];

// Create the array of slide objects that the lightbox needs
const slides = images.map((imageName) => ({
  src: `/images/gallery/${imageName}`,
}));

// An "Expand" icon component to show on hover
const ExpandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

export default function GalleryPage() {
  // -1 means the lightbox is closed. 0 or higher means it's open at that image index.
  const [index, setIndex] = useState(-1);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Our Gallery</h1>
        <p className={styles.subtitle}>
          A collection of moments from our events and activities.
        </p>
      </header>

      <main className={styles.galleryGrid}>
        {slides.map((slide, i) => {
          // Determine if this image should be wide or tall for the dynamic grid
          const isWide = i === 0 || i === 7; // Example: make the 1st and 8th images wide
          const isTall = i === 4; // Example: make the 5th image tall

          return (
            <div
              key={i}
              className={`
                ${styles.imageWrapper} 
                ${isWide ? styles.wide : ""} 
                ${isTall ? styles.tall : ""}
              `}
              onClick={() => setIndex(i)} // Open the lightbox at this image's index
            >
              <Image
                src={slide.src}
                alt={`Gallery image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
              <div className={styles.overlay}>
                <ExpandIcon />
              </div>
            </div>
          );
        })}
      </main>

      {/* The Lightbox component that opens when index is >= 0 */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </div>
  );
}
