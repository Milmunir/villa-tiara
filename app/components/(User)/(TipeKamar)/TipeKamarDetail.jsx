"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  FaConciergeBell,
  FaParking,
  FaUtensils,
  FaWifi,
  FaBed,
  FaTv,
  FaHotTub,
  FaMugHot,
  FaCouch,
  FaShower,
  FaDoorOpen,
  FaAngleRight,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Standart from "@/public/Standart.JPG";
import Family from "@/public/Family.JPG";
import Deluxe from "@/public/Deluxe.JPG";

const TipeKamarDetailComponent = () => {
  const rooms = [
    {
      type: "standar",
      title: "Kamar Standar",
      image: Standart,
      facilities: [
        { icon: <FaBed />, text: "1 Double & Sliding Bed" },
        { icon: <FaWifi />, text: "Wi-Fi Gratis" },
        { icon: <FaConciergeBell />, text: "Layanan Kamar 24 Jam" },
        { icon: <FaParking />, text: "Parkir Gratis" },
        { icon: <FaShower />, text: "Shower" },
        { icon: <FaHotTub />, text: "Air Panas (mandi)" },
        { icon: <FaMugHot />, text: "Air Panas (termos)" },
        { icon: <FaCouch />, text: "Sofa" },
        { icon: <FaTv />, text: "TV" },
      ],
    },
    {
      type: "family",
      title: "Kamar Family",
      image: Family,
      facilities: [
        { icon: <FaBed />, text: "1 Double & Single Bed" },
        { icon: <FaWifi />, text: "Wi-Fi Gratis" },
        { icon: <FaConciergeBell />, text: "Layanan Kamar 24 Jam" },
        { icon: <FaParking />, text: "Parkir Gratis" },
        { icon: <FaShower />, text: "Shower" },
        { icon: <FaDoorOpen />, text: "Teras" },
        { icon: <FaHotTub />, text: "Air Panas (mandi)" },
        { icon: <FaMugHot />, text: "Air Panas (termos)" },
        { icon: <FaCouch />, text: "Sofa" },
        { icon: <FaTv />, text: "TV" },
      ],
    },
    {
      type: "deluxe",
      title: "Kamar Deluxe",
      image: Deluxe,
      facilities: [
        { icon: <FaBed />, text: "2 Double Beds" },
        { icon: <FaWifi />, text: "Wi-Fi Gratis" },
        { icon: <FaConciergeBell />, text: "Layanan Kamar 24 Jam" },
        { icon: <FaParking />, text: "Parkir Gratis" },
        { icon: <FaDoorOpen />, text: "Teras" },
        { icon: <FaUtensils />, text: "Dapur" },
        { icon: <FaShower />, text: "Shower" },
        { icon: <FaHotTub />, text: "Air Panas (mandi)" },
        { icon: <FaMugHot />, text: "Air Panas (termos)" },
        { icon: <FaCouch />, text: "Sofa" },
        { icon: <FaTv />, text: "TV" },
      ],
    },
  ];

  const [visibleSections, setVisibleSections] = useState({});
  const observer = useRef();

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => observer.current.observe(el));

    return () => observer.current.disconnect();
  }, []);

  return (
    <div className="space-y-10">
      {rooms.map((room, index) => (
        <section
          key={index}
          id={room.type}
          className={`fade-in ${
            visibleSections[room.type] ? "fade-in-visible" : ""
          } bg-white rounded-2xl shadow-xl p-8 md:p-14 transition-all duration-700 transform ${
            visibleSections[room.type]
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl text-center md:text-justify font-extrabold mb-8 text-red-600">
            {room.title}
          </h2>
          <div className="flex flex-col lg:flex-row lg:space-x-14">
            <Image
              src={room.image}
              alt={room.title}
              loading="lazy"
              className="w-full lg:w-3/6 rounded-xl md:rounded-3xl"
            />
            <div className="flex-1 mt-6 md:mt-10 lg:mt-0">
              <h3 className="text-2xl font-bold mb-4 md:mb-6 text-gray-800">
                Fasilitas
              </h3>
              <ul className="grid md:grid-cols-3 lg:grid-cols-2 text-gray-600">
                {room.facilities.map((facility, i) => (
                  <li
                    key={i}
                    className="flex items-center hover:text-red-600 transition-colors duration-300 mb-2 md:mb-4"
                  >
                    <div className="text-2xl text-red-500 mr-3">
                      {facility.icon}
                    </div>
                    {facility.text}
                  </li>
                ))}
                <Link
                  href={`https://wa.me/6281335623403?text=Halo%2C%20Saya%20ingin%20bertanya.%0AApakah%20kamar%20${encodeURIComponent(
                    room.type
                  )}%20masih%20tersedia%20dan%20harga%20kamar%20per-malam%20berapa%3F%0ASaya%20dapat%20informasi%20tentang%20Villa%20Tiara%20dari%20Website.%20Terima%20kasih`}
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-1 md:col-span-3 lg:col-span-1 inline-flex items-center justify-center px-8 py-4 mt-4 bg-red-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-red-700 transition duration-300"
                >
                  <span>
                    Pesan{" "}
                    <span className="hidden md:inline-block">Sekarang</span>
                  </span>
                  <FaAngleRight className="ml-2" />
                </Link>
              </ul>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default TipeKamarDetailComponent;
