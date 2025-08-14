import Image from "next/image";
import Link from "next/link";
import styles from "./ActivityCard.module.css"; // Uses its own dedicated CSS

// Define the type for a single activity object that this component expects
type Activity = {
  id: number;
  title: string;
  description: string | null;
  activity_date: string | null;
  image_url: string | null;
  registration_link: string | null;
};

// The component receives a single prop: 'activity'
export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className={styles.activityCard}>
      <div className={styles.imageWrapper}>
        <Image
          src={activity.image_url || "/images/default-activity.png"} // Use default if no image
          alt={activity.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{activity.title}</h3>
        <p className={styles.cardDate}>
          {activity.activity_date
            ? new Date(activity.activity_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Date TBD"}
        </p>
        {/* Truncate the description to 100 characters to keep cards uniform */}
        <p className={styles.cardDescription}>
          {activity.description?.substring(0, 100)}...
        </p>
        <Link
          href={activity.registration_link || "#"}
          target="_blank"
          className={styles.registerButton}
        >
          Register Now
        </Link>
      </div>
    </div>
  );
}
