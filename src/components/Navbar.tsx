"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

// Hamburger Icon Component
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
  const [isHidden, setIsHidden] = useState(false); // <-- ADDED: State for hiding
  const pathname = usePathname();

  // UPDATED: This effect now handles both scroll states
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Handles the solid/transparent background state
      setIsScrolled(currentScrollY > 10);

      // Handles the hide/show on mobile state
      if (window.innerWidth < 768) {
        // Only run this on mobile
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Scrolling DOWN
          setIsHidden(true);
          setMobileMenuOpen(false); // Also close the menu automatically
        } else {
          // Scrolling UP
          setIsHidden(false);
        }
      } else {
        // On desktop, the navbar is never hidden
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/activities", label: "Activities" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About Us" },
    { href: "/volunteers", label: "Volunteers" },
    { href: "/contact", label: "Contact Us" },
  ];

  // Logic to determine all necessary CSS classes
  const isTransparent = pathname === "/" && !isScrolled;
  const navClasses = [
    styles.navbar,
    isTransparent ? styles.transparentNav : styles.scrolled,
    isHidden ? styles.navbarHidden : "",
  ].join(" ");

  return (
    <nav className={navClasses}>
      <div className={styles.container}>
        <Link href="/" onClick={closeMobileMenu} className={styles.logo}>
          Familienettverk
        </Link>

        {/* Desktop Links */}
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

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <HamburgerIcon />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
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
