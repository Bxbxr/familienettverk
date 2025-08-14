"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import styles from "./AdminLayout.module.css";
import { User } from "@supabase/supabase-js";

type AdminLayoutProps = {
  children: ReactNode;
  user: User | null;
};

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <h1 className={styles.sidebarTitle}>Admin Panel</h1>

        {/* The navList is now a direct child */}
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/admin/dashboard">Dashboard</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/admin/dashboard/activities">Manage Activities</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/admin/dashboard/volunteers">View Volunteers</Link>
          </li>
        </ul>

        {/* The userProfile is also a direct child */}
        <div className={styles.userProfile}>
          {user && <p className={styles.userEmail}>{user.email}</p>}
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
