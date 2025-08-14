import HeroSlider from "@/components/HeroSlider";
import Section from "@/components/Section";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ActivityCard from "@/components/ActivityCard"; // We'll create this next
import styles from "./page.module.css";

// This page will now fetch data, so it must be async
export default async function Home() {
  // Fetch the 3 most recent, upcoming activities
  const { data: activities, error } = await supabase
    .from("activities")
    .select("*")
    .order("activity_date", { ascending: true }) // Order by upcoming date
    .limit(3); // Get only 3

  return (
    <main>
      <div className={styles.sliderWrapper}>
        <HeroSlider />
      </div>

      {/* "Who We Are" Section */}
      <Section
        title="Who We Are"
        subtitle="Connecting families, building community, one activity at a time."
        isLightBg={true}
      >
        <p className={styles.introText}>
          Familienettverk is a vibrant, youth-led organization dedicated to
          creating a strong and supportive network for families. We believe in
          the power of connection to build a resilient and thriving community.
        </p>
        <Link href="/about" className={styles.ctaButton}>
          Learn More About Us
        </Link>
      </Section>

      {/* "Latest Activities" Section */}
      {activities && activities.length > 0 && (
        <Section
          title="Our Latest Activities"
          subtitle="Join us for our next event. We can't wait to see you there!"
        >
          <div className={styles.activitiesGrid}>
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </Section>
      )}
    </main>
  );
}
