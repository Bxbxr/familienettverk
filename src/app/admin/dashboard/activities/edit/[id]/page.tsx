"use client";

import { useState, FormEvent, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation"; // <-- Make sure useParams is imported
import AdminLayout from "@/components/AdminLayout";
import styles from "../../../dashboard.module.css";
import formStyles from "@/app/volunteers/volunteers.module.css";
import { User } from "@supabase/supabase-js";

// The component takes NO props from the server
export default function EditActivityPage() {
  const router = useRouter();
  const params = useParams(); // <-- Use the hook to get URL params
  const activityId = params.id as string; // <-- Get the ID safely

  // State for the page and form
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");

  useEffect(() => {
    // This effect runs only in the browser
    const checkUserAndFetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setUser(session.user);

      if (activityId) {
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .eq("id", activityId)
          .single();

        if (error) {
          setMessage(`Error: ${error.message}`);
        } else if (data) {
          setTitle(data.title || "");
          setDescription(data.description || "");
          setImageUrl(data.image_url || "");
          setRegistrationLink(data.registration_link || "");
          const formatForInput = (dateStr: string | null) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16);
          };
          setActivityDate(formatForInput(data.activity_date));
          setEndDate(formatForInput(data.end_date));
        }
      }
      setLoading(false);
    };

    checkUserAndFetchData();
  }, [activityId, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Updating activity...");
    const { error } = await supabase
      .from("activities")
      .update({
        title,
        description,
        activity_date: activityDate,
        end_date: endDate,
        image_url: imageUrl,
        registration_link: registrationLink,
      })
      .eq("id", activityId);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Activity updated successfully!");
      setTimeout(() => router.push("/admin/dashboard/activities"), 1500);
    }
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <p>Loading activity...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Activity</h1>
      </div>
      <form onSubmit={handleSubmit} className={formStyles.form}>
        {/* Your form JSX goes here, it does not need to change */}
        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={formStyles.input}
          />
        </div>
        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={formStyles.textarea}
          ></textarea>
        </div>
        <div className={formStyles.formGroup}>
          <label htmlFor="activityDate">Activity Date</label>
          <input
            type="datetime-local"
            id="activityDate"
            value={activityDate}
            onChange={(e) => setActivityDate(e.target.value)}
            className={formStyles.input}
          />
        </div>
        <div className={formStyles.formGroup}>
          <label htmlFor="endDate">End Date</label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={formStyles.input}
          />
        </div>
        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={formStyles.input}
          />
        </div>
        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
          <label htmlFor="registrationLink">Registration Link</label>
          <input
            type="url"
            id="registrationLink"
            value={registrationLink}
            onChange={(e) => setRegistrationLink(e.target.value)}
            className={formStyles.input}
          />
        </div>
        <button type="submit" className={formStyles.submitButton}>
          Update Activity
        </button>
        {message && (
          <p className={formStyles.fullWidth} style={{ textAlign: "center" }}>
            {message}
          </p>
        )}
      </form>
    </AdminLayout>
  );
}
