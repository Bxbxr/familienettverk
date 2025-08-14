import { supabase } from "@/lib/supabaseClient";
import styles from "./activities.module.css";
import ActivityCard from "@/components/ActivityCard"; // Import the reusable component

// Define a type for our activity data
type Activity = {
  id: number;
  title: string;
  description: string | null;
  activity_date: string | null;
  image_url: string | null;
  registration_link: string | null;
};

export default async function ActivitiesPage() {
  // Fetch data from the 'activities' table
  const { data: activities, error } = await supabase
    .from("activities")
    .select("*")
    .order("activity_date", { ascending: true });

  if (error) {
    return <p>Error loading activities: {error.message}</p>;
  }

  if (!activities || activities.length === 0) {
    return (
      <p>No activities scheduled at the moment. Please check back later!</p>
    );
  }

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Our Activities</h1>
        <p className={styles.subtitle}>
          Discover upcoming events, workshops, and gatherings. We look forward
          to seeing you!
        </p>
      </header>

      <main className={styles.gridContainer}>
        {/* Map over the fetched activities and render our reusable card for each one */}
        {activities.map((activity: Activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </main>
    </div>
  );
}
