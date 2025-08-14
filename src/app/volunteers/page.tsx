"use client"; // This must be a client component to handle user interaction

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./volunteers.module.css";

export default function VolunteersPage() {
  const [statusMessage, setStatusMessage] = useState("");

  // This function will run when the form is submitted
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent the default form submission
    setStatusMessage("Submitting...");

    const formData = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(formData.entries());

    // Insert the data into the 'volunteers' table
    const { error } = await supabase.from("volunteers").insert([
      {
        full_name: formObject.full_name,
        age: formObject.age,
        gender: formObject.gender,
        address: formObject.address,
        email: formObject.email,
        phone_number: formObject.phone_number,
        skills: formObject.skills,
        commitment_duration: formObject.commitment_duration,
        availability: formObject.availability,
        volunteering_style: formObject.volunteering_style,
      },
    ]);

    if (error) {
      setStatusMessage(`Error: ${error.message}`);
      console.error("Error inserting data:", error);
    } else {
      setStatusMessage("Thank you! Your application has been received.");
      (event.target as HTMLFormElement).reset(); // Reset the form fields
    }
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Become a Volunteer</h1>
        <p className={styles.subtitle}>
          Join our team and make a difference in the community. Fill out the
          form below to get started.
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Form Fields */}
        <div className={styles.formGroup}>
          <label htmlFor="full_name" className={styles.label}>
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="age" className={styles.label}>
            Age
          </label>
          <input type="text" id="age" name="age" className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone_number" className={styles.label}>
            Phone Number
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            className={styles.input}
          />
        </div>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="address" className={styles.label}>
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="gender" className={styles.label}>
            Gender
          </label>
          <select id="gender" name="gender" className={styles.select}>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="volunteering_style" className={styles.label}>
            Volunteering Style
          </label>
          <select
            id="volunteering_style"
            name="volunteering_style"
            className={styles.select}
          >
            <option value="">Select...</option>
            <option value="Online">Online</option>
            <option value="In-person">In-person</option>
            <option value="Both">Both</option>
          </select>
        </div>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="skills" className={styles.label}>
            Skills & Interests
          </label>
          <textarea
            id="skills"
            name="skills"
            className={styles.textarea}
            placeholder="e.g., event planning, graphic design, social media..."
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="availability" className={styles.label}>
            Availability
          </label>
          <input
            type="text"
            id="availability"
            name="availability"
            className={styles.input}
            placeholder="e.g., Weekends, Evenings..."
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="commitment_duration" className={styles.label}>
            Commitment Duration
          </label>
          <input
            type="text"
            id="commitment_duration"
            name="commitment_duration"
            className={styles.input}
            placeholder="e.g., 3 months, long-term..."
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit Application
        </button>

        {/* Status Message */}
        {statusMessage && (
          <p
            className={styles.fullWidth}
            style={{ textAlign: "center", marginTop: "1rem" }}
          >
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}
