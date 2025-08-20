"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import styles from "../dashboard.module.css";
import { User } from "@supabase/supabase-js";

// Define the type for a volunteer
type Volunteer = {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  skills: string | null;
};

export default function ViewVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // error is a string
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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
        .from("volunteers")
        .select("id, created_at, full_name, email, phone_number, skills")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message); // We store the error message string here
      } else if (data) {
        setVolunteers(data);
      }
      setLoading(false);
    };

    checkUserAndFetchData();
  }, [router]);

  if (loading) {
    return (
      <AdminLayout user={user}>
        <p>Loading volunteers...</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout user={user}>
        <p>Error fetching volunteers.</p>
        <p>
          Please ensure you have created a SELECT policy for authenticated users
          on the &apos;volunteers&apos; table.
        </p>
        <p>
          {/* --- THE FIX IS HERE --- */}
          {/* Render the 'error' string directly, not 'error.message' */}
          <strong>Error details:</strong> {error}
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className={styles.header}>
        <h1 className={styles.title}>Volunteer Submissions</h1>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Skills</th>
              <th>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer) => (
              <tr key={volunteer.id}>
                <td>{volunteer.full_name}</td>
                <td>{volunteer.email}</td>
                <td>{volunteer.phone_number || "N/A"}</td>
                <td>{volunteer.skills || "N/A"}</td>
                <td>
                  {new Date(volunteer.created_at).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
