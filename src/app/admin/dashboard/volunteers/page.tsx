"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import styles from "../dashboard.module.css"; // Reuse the same dashboard styles

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
  const [error, setError] = useState("");
  const router = useRouter();

  // Check for authenticated user
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      }
    };
    checkUser();
  }, [router]);

  // Fetch volunteers data
  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("volunteers")
        .select("id, created_at, full_name, email, phone_number, skills") // Select specific columns
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else if (data) {
        setVolunteers(data);
      }
      setLoading(false);
    };

    fetchVolunteers();
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <p>Loading volunteers...</p>
      </AdminLayout>
    );
  // We need to create a read policy for this to work! We'll do that next.
  if (error) {
    return (
      <AdminLayout>
        <p>Error fetching volunteers.</p>
        <p>
          Please ensure you have created a SELECT policy for authenticated users
          on the 'volunteers' table.
        </p>
        <p>
          <strong>Error details:</strong> {error.message}
        </p>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
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
