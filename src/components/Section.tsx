import { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isLightBg?: boolean;
};

export default function Section({
  title,
  subtitle,
  children,
  isLightBg,
}: SectionProps) {
  return (
    <section className={`${styles.section} ${isLightBg ? styles.lightBg : ""}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
