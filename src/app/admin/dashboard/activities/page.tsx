"use client"; // This is a Client Component

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Use the simple CLIENT-side helper
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import styles from "../dashboard.module.css";
import { User } from "@supabase/supabase-js";

// Define the type for our activity data
type Activity = {
  id: number;
  title: string;
  activity_date: string | null;
  created_at: string;
};

export default function ManageActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // This single useEffect handles both authentication and data fetching
  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setUser(session.user);

      const { data, error: fetchError } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setActivities(data);
      }

      setLoading(false);
    };

    checkUserAndFetchData();
  }, [router]);

  const handleDelete = async (activityId: number) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      const { error } = await supabase
        .from("activities")
        .delete()
        .match({ id: activityId });
      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setActivities(
          activities.filter((activity) => activity.id !== activityId)
        );
        alert("Activity deleted successfully!");
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Activities</h1>
        <Link
          href="/admin/dashboard/activities/new"
          className={styles.primaryButton}
        >
          + Add New Activity
        </Link>
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Activity Date</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.title}</td>
                <td>
                  {new Date(activity.activity_date || "").toLocaleDateString()}
                </td>
                <td>{new Date(activity.created_at).toLocaleDateString()}</td>
                <td className={styles.actions}>
                  <Link
                    href={`/admin/dashboard/activities/edit/${activity.id}`}
                    className={styles.editButton}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
