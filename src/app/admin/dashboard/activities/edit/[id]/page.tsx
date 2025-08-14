"use client";

import { useState, FormEvent, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import styles from "../../../dashboard.module.css"; // Adjust path for shared CSS
import formStyles from "@/app/volunteers/volunteers.module.css"; // Reuse form styles

// This component receives 'params' which contains the dynamic [id] from the URL
export default function EditActivityPage({
  params,
}: {
  params: { id: string };
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const activityId = params.id;

  // 1. Fetch the existing activity data when the page loads
  useEffect(() => {
    const fetchActivityData = async () => {
      if (!activityId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("id", activityId)
        .single(); // .single() gets one record, or returns an error if not found

      if (error) {
        setMessage(`Error fetching activity: ${error.message}`);
      } else if (data) {
        // Populate the form fields with the fetched data
        setTitle(data.title);
        setDescription(data.description || "");
        setImageUrl(data.image_url || "");
        setRegistrationLink(data.registration_link || "");

        // Format dates for the datetime-local input
        const formatForInput = (dateStr: string | null) => {
          if (!dateStr) return "";
          const d = new Date(dateStr);
          // Format to "YYYY-MM-DDTHH:mm"
          return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        };
        setActivityDate(formatForInput(data.activity_date));
        setEndDate(formatForInput(data.end_date));
      }
      setLoading(false);
    };

    fetchActivityData();
  }, [activityId]);

  // 2. Handle the form submission to UPDATE the data
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Updating activity...");

    const { error } = await supabase
      .from("activities")
      .update({
        title,
        description,
        activity_date: activityDate || null,
        end_date: endDate || null,
        image_url: imageUrl || null,
        registration_link: registrationLink || null,
      })
      .eq("id", activityId); // IMPORTANT: Update only where the id matches

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Activity updated successfully!");
      setTimeout(() => {
        router.push("/admin/dashboard/activities");
      }, 1500);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading activity data...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Activity</h1>
      </div>

      <form onSubmit={handleSubmit} className={formStyles.form}>
        {/* The form is identical to the 'new' form, but pre-filled with data */}
        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
          <label htmlFor="title" className={formStyles.label}>
            Title
          </label>
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
          <label htmlFor="description" className={formStyles.label}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={formStyles.textarea}
          ></textarea>
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="activityDate" className={formStyles.label}>
            Activity Date
          </label>
          <input
            type="datetime-local"
            id="activityDate"
            value={activityDate}
            onChange={(e) => setActivityDate(e.target.value)}
            className={formStyles.input}
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="endDate" className={formStyles.label}>
            End Date (for display)
          </label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={formStyles.input}
          />
        </div>

        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
          <label htmlFor="imageUrl" className={formStyles.label}>
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={formStyles.input}
          />
        </div>

        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
          <label htmlFor="registrationLink" className={formStyles.label}>
            Registration Link (Google Form)
          </label>
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
          <p
            className={formStyles.fullWidth}
            style={{ textAlign: "center", marginTop: "1rem" }}
          >
            {message}
          </p>
        )}
      </form>
    </AdminLayout>
  );
}
