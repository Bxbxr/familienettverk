"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const HamburgerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6H20M4 12H20M4 18H20"
      stroke="#111827"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/activities", label: "Activities" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About Us" },
    { href: "/volunteers", label: "Volunteers" },
    { href: "/contact", label: "Contact Us" },
  ];

  // --- THE NEW, SIMPLE LOGIC ---
  // The navbar should be transparent if we are on the homepage AND not scrolled.
  const isTransparent = pathname === "/" && !isScrolled;

  // Find the return statement in your Navbar.tsx and replace it with this
  return (
    <nav
      className={`${styles.navbar} ${
        isTransparent ? styles.transparentNav : ""
      }`}
    >
      {/* This is the new centered container */}
      <div className={styles.container}>
        <Link href="/" onClick={closeMobileMenu} className={styles.logo}>
          Familienettverk
        </Link>

        {/* Desktop Links are now inside the container */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.activeLink : ""}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* The mobile button is also inside the container */}
        <button
          className={styles.menuButton}
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <HamburgerIcon />
        </button>
      </div>

      {/* The mobile dropdown menu stays outside the container */}
      <div
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.open : ""
        }`}
      >
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={closeMobileMenu}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
