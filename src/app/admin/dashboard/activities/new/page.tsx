"use client";

import { useState, FormEvent, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import styles from "../../dashboard.module.css";
import formStyles from "@/app/volunteers/volunteers.module.css";
import { User } from "@supabase/supabase-js"; // <-- Make sure this import is present

export default function NewActivityPage() {
  const [user, setUser] = useState<User | null>(null); // <-- Add user state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUser(session.user); // <-- Set the user state here
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Creating activity...");

    const { error } = await supabase.from("activities").insert([
      {
        title,
        description,
        activity_date: activityDate || null,
        end_date: endDate || null,
        image_url: imageUrl || null,
        registration_link: registrationLink || null,
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Activity created successfully!");
      setTimeout(() => {
        router.push("/admin/dashboard/activities");
      }, 1500);
    }
  };

  return (
    <AdminLayout user={user}>
      {" "}
      {/* <-- Pass the user prop here */}
      <div className={styles.header}>
        <h1 className={styles.title}>Add New Activity</h1>
      </div>
      <form onSubmit={handleSubmit} className={formStyles.form}>
        {/* The rest of your form JSX is perfect and does not need to change */}
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
            placeholder="https://images.unsplash.com/..."
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
            placeholder="https://forms.google.com/..."
          />
        </div>
        <button type="submit" className={formStyles.submitButton}>
          Create Activity
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
