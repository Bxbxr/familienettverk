"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; // Or a spinner component
  }

  if (!user) {
    return null; // or redirect, though the effect should handle it
  }

  return (
    <AdminLayout user={user}>
      <h1>Welcome to your. Dashboard, {user.email}!</h1>
      <p>This is the central place to manage your website s content.</p>
      <p>Select an option from the sidebar to get started.</p>
    </AdminLayout>
  );
}
