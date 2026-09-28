"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

const menuItems = [
  { name: "Beranda", target: "/beranda", hash: "#jumbotron" },
  { name: "Tentang", target: "/tentang", hash: "#tentang" },
  { name: "Tipe Kamar", target: "/tipekamar", hash: "#tipe-kamar" },
  { name: "Fasilitas", target: "/beranda#fasilitas", hash: "#fasilitas" },
  { name: "Testimoni", target: "/beranda#testimoni", hash: "#testimoni" },
  { name: "Galeri", target: "/galeri", hash: "#galeri" },
  { name: "Artikel", target: "/artikel", hash: "#artikel" },
  { name: "FAQ", target: "/faq", hash: "#faq" },
];

const NavbarComponent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "/beranda";

  const handleMenuToggle = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBgClass = isHome
    ? scrolled
      ? "bg-white bg-opacity-100 text-black shadow-lg"
      : "bg-opacity-0 text-white"
    : "bg-white bg-opacity-100 text-black shadow-lg";

  const topBarBgClass = isHome ? "bg-black bg-opacity-40" : "bg-black bg-opacity-70";
  const logoTextClass = isHome && !scrolled ? "text-white" : "text-red-700";
  const menuTextClass = isHome && !scrolled ? "text-white" : "text-gray-800";
  const menuToggleClass = isHome && !scrolled ? "text-white" : "text-gray-800";

  return (
    <header
      id="navbar"
      className={`fixed left-0 right-0 top-0 z-30 transition-all duration-300 ${headerBgClass}`}
    >
      <div
        className={`space-x-4 ${topBarBgClass} text-white text-xs md:text-sm transition-all duration-300 py-3 md:py-4 ${
          scrolled ? "hidden" : "flex"
        }`}
      >
        <div className="container mx-auto md:px-4 flex md:justify-between justify-center">
          <div className="flex space-x-5 items-center">
            <a
              href="https://maps.app.goo.gl/jC6gnaMxtjUnpU8q9"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center hover:text-yellow-300"
              title="Location"
            >
              <FaMapMarkerAlt className="mr-2 text-red-500" />
              <span>No. 193, Jl, Raya Telaga Sarangan 63361 Magetan</span>
            </a>
            <a
              href="https://wa.me/6281335623403"
              target="_blank"
              rel="noreferrer"
              className="flex items-center hover:text-yellow-300"
              title="WhatsApp"
            >
              <FaPhoneAlt className="mr-2 text-red-500" />
              <span>0813-3562-3403</span>
            </a>
            <a
              href="mailto:tiarasarangan2@gmail.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center hover:text-yellow-300"
              title="Email"
            >
              <FaEnvelope className="mr-2 text-red-500" />
              <span>tiarasarangan2@gmail.com</span>
            </a>
          </div>
          <div className="hidden lg:flex space-x-4 items-center">
            <a
              href="https://instagram.com/villatiara.sarangan"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-300"
              title="Instagram"
            >
              <FaInstagram className="mr-2" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-300"
              title="X"
            >
              <FaTwitter className="mr-2" />
            </a>
            <a
              href="https://tiktok.com/@tiarasarangan"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-300"
              title="TikTok"
            >
              <FaTiktok className="mr-2" />
            </a>
            <a
              href="https://youtube.com/@villatiarasarangan9576"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-300"
              title="YouTube"
            >
              <FaYoutube className="mr-2" />
            </a>
          </div>
        </div>
      </div>
      <div
        className={`container mx-auto flex justify-between items-center px-6 ${
          scrolled ? "py-3 md:py-3" : "py-3 md:py-4"
        }`}
      >
        <Link href="/beranda">
          <h1
            id="logo"
            className={`logo text-3xl md:text-4xl ${logoTextClass}`}
          >
            Villa Tiara
          </h1>
        </Link>

        <nav>
          <button
            id="menu-toggle"
            className={`lg:hidden text-2xl focus:outline-none font-semibold ${menuToggleClass}`}
            onClick={handleMenuToggle}
          >
            &#9776;
          </button>
          {/* Menu Desktop */}
          <ul
            className={`hidden overflow-y-auto lg:flex space-x-8 text-md py-2 font-bold ${menuTextClass}`}
          >
            {menuItems.map((item) => {
              const href = isHome ? item.hash : item.target;
              return (
                <li key={item.name}>
                  <Link
                    href={href}
                    className={`cursor-pointer ${
                      scrolled || !isHome ? "hover:text-red-500" : "hover:text-yellow-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      {/* Menu Mobile */}
      <div
        id="mobile-menu"
        className={`fixed top-0 left-0 h-full w-60 bg-gray-900 bg-opacity-95 text-white transform transition-transform duration-300 ease-in-out flex flex-col items-start p-5 space-y-6 z-40 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          id="close-menu"
          className="text-xl font-bold self-end focus:outline-none"
          onClick={handleCloseMenu}
          aria-label="Close Menu"
        >
          ✖
        </button>
        <ul className="text-lg w-full pl-2">
          {menuItems.map((item) => {
            const href = isHome ? item.hash : item.target;
            return (
              <li key={item.name} className="w-full">
                <Link
                  href={href}
                  className="block py-2 px-4 w-full hover:bg-yellow-300 hover:text-gray-900 hover:font-semibold rounded transition duration-300 ease-in-out"
                  onClick={handleCloseMenu}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default NavbarComponent;
