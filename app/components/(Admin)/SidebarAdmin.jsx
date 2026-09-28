"use client";

import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaBook,
  FaBed,
  FaFileAlt,
  FaUsers,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import React, { useState, useEffect, useContext, forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { DarkModeContext } from "@/app/(contexts)/DarkModeContext";

const SidebarAdmin = forwardRef(({ isOpen, onClose, currentUser }, ref) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [currentDate, setCurrentDate] = useState("");
  const [dropdowns, setDropdowns] = useState({
    reservasi: false,
    kamar: false,
    bukutamu: false,
    laporan: false,
  });

  const toggleDropdown = (menu) => {
    setDropdowns((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const handleSignOut = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.assign("/admin/login");
  };

  useEffect(() => {
    const date = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("id-ID", options);
    setCurrentDate(formattedDate);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        id="sidebar"
        ref={ref}
        className={`text-white fixed overflow-auto scrollbar-hide inset-y-0 left-0 w-64 h-screen transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-30 duration-300 ease-in-out ${
          isDarkMode ? "bg-gray-800" : "bg-red-700"
        }`}
      >
        <h1 className="logo text-4xl font-bold py-6 text-center">
          Villa Tiara
        </h1>
        <div
          className={`flex items-center justify-center mx-6 p-4 shadow-lg rounded-lg ${
            isDarkMode
              ? "bg-gray-700 text-white"
              : "bg-gradient-to-r from-orange-500 to-red-500"
          }`}
        >
          <div className="flex-shrink-0">
            <Image
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              className="w-10 h-10 rounded-full border-2 border-white"
              alt="Admin"
              width={40}
              height={40}
            />
          </div>
          <div className="ml-3">
            <p className="text-md font-bold">ADMIN</p>
            <p className="text-xs opacity-85">{currentDate}</p>
          </div>
        </div>

        <nav>
          <ul className="py-5">
            <li
              className={`px-6 py-4 hover:bg-gradient-to-r rounded-md ${
                isDarkMode
                  ? "hover:from-gray-700 hover:to-gray-900"
                  : "hover:from-orange-500 hover:to-red-500"
              }`}
            >
              <Link href="/admin/dashboard" passHref legacyBehavior>
                <a onClick={onClose} className="flex items-center px-2 font-medium">
                  <FaTachometerAlt className="w-6 h-6" />
                  <span
                    className={`ml-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-300"
                    } hover:text-white`}
                  >
                    Dashboard
                  </span>
                </a>
              </Link>
            </li>

            {currentUser?.role === "SUPERUSER" && (
              <li className="px-6 py-4 hover:bg-gradient-to-r rounded-md">
                <Link href="/admin/users" onClick={onClose} className="flex items-center px-2 font-medium">
                  <FaUsers className="w-6 h-6" />
                  <span className="ml-3 text-gray-300 hover:text-white">Users</span>
                </Link>
              </li>
            )}

            <li
              className={`px-6 py-4 hover:bg-gradient-to-r rounded-md ${
                isDarkMode
                  ? "hover:from-gray-700 hover:to-gray-900"
                  : "hover:from-orange-500 hover:to-red-500"
              }`}
            >
              <button
                className="w-full flex items-center px-2 font-medium focus:outline-none"
                onClick={() => toggleDropdown("reservasi")}
              >
                <FaCalendarAlt className="w-6 h-6" />
                <span
                  className={`ml-3 ${
                    isDarkMode ? "text-gray-400" : "text-gray-300"
                  } hover:text-white`}
                >
                  Reservasi
                </span>
                <FaChevronDown
                  className={`ml-auto w-4 h-4 transform transition-transform duration-300 ${
                    dropdowns.reservasi ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <ul
                id="reservasi-menu"
                className={`list-disc ml-14 mt-4 space-y-2 pb-2 transition-all duration-300 ease-in-out transform ${
                  dropdowns.reservasi ? "" : "hidden"
                }`}
              >
                <li>
                  <Link href="/admin/tambahbooking" passHref legacyBehavior>
                    <a
                      onClick={onClose}
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-300"
                      } hover:text-white`}
                    >
                      Tambah Booking
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/daftarbooking" passHref legacyBehavior>
                    <a
                      onClick={onClose}
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-300"
                      } hover:text-white`}
                    >
                      Daftar Booking
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/daftarcheckin" passHref legacyBehavior>
                    <a
                      onClick={onClose}
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-300"
                      } hover:text-white`}
                    >
                      Daftar CheckIn
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/daftarriwayat" passHref legacyBehavior>
                    <a
                      onClick={onClose}
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-300"
                      } hover:text-white`}
                    >
                      Daftar Riwayat
                    </a>
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`px-6 py-4 hover:bg-gradient-to-r rounded-md ${
                isDarkMode
                  ? "hover:from-gray-700 hover:to-gray-900"
                  : "hover:from-orange-500 hover:to-red-500"
              }`}
            >
              <button
                className="w-full flex items-center px-2 font-medium focus:outline-none"
                onClick={() => toggleDropdown("kamar")}
              >
                <FaBed className="w-6 h-6" />
                <span
                  className={`ml-3 ${
                    isDarkMode ? "text-gray-400" : "text-gray-300"
                  } hover:text-white`}
                >
                  Kamar
                </span>
                <FaChevronDown
                  className={`ml-auto w-4 h-4 transform transition-transform duration-300 ${
                    dropdowns.kamar ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <ul
                id="kamar-menu"
                className={`list-disc ml-14 mt-4 space-y-2 pb-2 transition-all duration-300 ease-in-out transform ${
                  dropdowns.kamar ? "" : "hidden"
                }`}
              >
                <li>
                  <Link href="/admin/daftarkamar" passHref legacyBehavior>
                    <a
                      onClick={onClose}
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-300"
                      } hover:text-white`}
                    >
                      Daftar Kamar
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/statuskamar" passHref legacyBehavior>
                    <a
                      onClick={onClose}
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-300"
                      } hover:text-white`}
                    >
                      Status Kamar
                    </a>
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`px-6 py-4 hover:bg-gradient-to-r rounded-md ${
                isDarkMode
                  ? "hover:from-gray-700 hover:to-gray-900"
                  : "hover:from-orange-500 hover:to-red-500"
              }`}
            >
              <button
                className="w-full flex items-center px-2 font-medium focus:outline-none"
                onClick={() => toggleDropdown("bukutamu")}
              >
                <FaBook className="w-6 h-6" />
                <span
                  className={`ml-3 ${
                    isDarkMode ? "text-gray-400" : "text-gray-300"
                  } hover:text-white`}
                >
                  Buku Tamu
                </span>
                <FaChevronDown
                  className={`ml-auto w-4 h-4 transform transition-transform duration-300 ${
                    dropdowns.bukutamu ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <ul
                id="bukutamu-menu"
                className={`list-disc ml-14 mt-4 space-y-2 pb-2 transition-all duration-300 ease-in-out transform ${
                  dropdowns.bukutamu ? "" : "hidden"
                }`}
              >
                <li>
                  <Link href="/admin/tambahtamu" passHref legacyBehavior>
                    <a
                      onClick={onClose}
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-300"
                      } hover:text-white`}
                    >
                      Tambah Tamu
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/daftartamu" passHref legacyBehavior>
                    <a
                      onClick={onClose}
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-300"
                      } hover:text-white`}
                    >
                      Daftar Tamu
                    </a>
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`px-6 py-4 hover:bg-gradient-to-r rounded-md ${
                isDarkMode
                  ? "hover:from-gray-700 hover:to-gray-900"
                  : "hover:from-orange-500 hover:to-red-500"
              }`}
            >
              <button
                className="w-full flex items-center px-2 font-medium focus:outline-none"
                onClick={() => toggleDropdown("laporan")}
              >
                <FaFileAlt className="w-6 h-6" />
                <span
                  className={`ml-3 ${
                    isDarkMode ? "text-gray-400" : "text-gray-300"
                  } hover:text-white`}
                >
                  Laporan
                </span>
                <FaChevronDown
                  className={`ml-auto w-4 h-4 transform transition-transform duration-300 ${
                    dropdowns.laporan ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <ul
                id="laporan-menu"
                className={`list-disc ml-14 mt-4 space-y-2 pb-2 transition-all duration-300 ease-in-out transform ${
                  dropdowns.laporan ? "" : "hidden"
                }`}
              >
                <li>?</li>
                <li>?</li>
              </ul>
            </li>

            <li
              className={`px-6 py-4 hover:bg-gradient-to-r rounded-md ${
                isDarkMode
                  ? "hover:from-gray-700 hover:to-gray-900"
                  : "hover:from-orange-500 hover:to-red-500"
              }`}
            >
              <button onClick={handleSignOut} className="w-full flex items-center px-2 font-medium">
                  <FaSignOutAlt className="w-6 h-6" />
                  <span
                    className={`ml-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-300"
                    } hover:text-white`}
                  >
                    Keluar
                  </span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
});

SidebarAdmin.displayName = "SidebarAdmin";

export default SidebarAdmin;
