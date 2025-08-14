import styles from "./about.module.css";
import Image from "next/image";

export const metadata = { title: "About Us | Familienettverk" };

export default function AboutUsPage() {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>About Familienettverk</h1>
        <p className={styles.subtitle}>
          We believe in the power of connection to build a resilient and
          thriving community.
        </p>
      </header>

      <main>
        <div className={styles.section}>
          <div className={styles.content}>
            <h2>Our Mission</h2>
            <p>
              To empower families by providing accessible resources, engaging
              activities, and a safe environment for connection and personal
              development. We aim to bridge gaps, foster friendships, and
              celebrate the diversity that makes our community unique.
            </p>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca"
              alt="Community hands together"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.imageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
              alt="Team working together"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.content}>
            <h2>Our Vision</h2>
            <p>
              We envision a future where every family feels connected,
              supported, and valued. A community where children grow up with a
              strong sense of belonging and parents have the network they need
              to navigate the joys and challenges of family life.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
