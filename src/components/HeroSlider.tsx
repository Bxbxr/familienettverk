"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSlider.module.css";

// Import the required Swiper CSS files
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// The list of your slider images
const sliderImages = [
  "/images/slider1.jpg",
  "/images/slider2.jpg",
  "/images/slider3.jpg",
];

const HeroSlider = () => {
  return (
    <div className={styles.sliderContainer}>
      {/* Swiper component for the background images */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        loop={true}
        style={{ width: "100%", height: "100%" }}
        allowTouchMove={false} // Prevents manual swiping
      >
        {sliderImages.map((src, index) => (
          <SwiperSlide key={index}>
            <Image
              src={src}
              alt={`Slider background ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              priority={index === 0} // Loads the first image faster
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* The overlay with text and button */}
      <div className={styles.overlay}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to Familienettverk</h1>
          <p className={styles.heroSubtitle}>
            Building community, one activity at a time. Join us to connect,
            learn, and grow together.
          </p>
          <Link href="/activities" className={styles.heroButton}>
            See Our Activities
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
