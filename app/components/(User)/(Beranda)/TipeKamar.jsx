import React from "react";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import Image from "next/image";
import Standart from "@/public/Standart.JPG";
import Family from "@/public/Family.JPG";
import Deluxe from "@/public/Deluxe.JPG";

const TipeKamarComponent = () => {
  const rooms = [
    {
      type: "Standar",
      target: "/TipeKamar/#standar",
      description:
        "Kamar dengan satu 1 double bed dan 1 sliding bed, ideal untuk pasangan serta kerabat.",
      img: Standart,
    },
    {
      type: "Family",
      target: "/TipeKamar/#family",
      description:
        "Kamar dengan fasilitas 1 double bad dan 1 single bed secara terpisah, ideal untuk keluarga kecil.",
      img: Family,
    },
    {
      type: "Deluxe",
      target: "/TipeKamar/#deluxe",
      description:
        "Kamar dengan 2 double bed, menawarkan kenyamanan extra untuk grup rombongan, kerabat, keluarga.",
      img: Deluxe,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 py-16">
      <div className="container mx-auto px-6 md:px-12">
        {/* Title Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Tipe <span className="text-red-600">Kamar</span>
          </h1>
          <p className="text-md text-gray-600 mt-4 max-w-3xl mx-auto">
            Nikmati berbagai pilihan kamar dengan desain modern dan fasilitas
            unggulan yang akan membuat pengalaman menginap Anda di Villa Tiara
            Sarangan tak terlupakan.
          </p>
        </section>

        {/* Rooms Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 mx-4 md:mx-0 lg:mx-16">
          {rooms.map((room) => (
            <div
              key={room.type}
              className="relative group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={room.img}
                  alt={room.type}
                  loading="lazy"
                  className="object-cover w-full h-40 transform group-hover:scale-110 transition-transform duration-300"
                  layout="fill"
                />
              </div>

              {/* Text Section */}
              <div className="p-6 relative">
                <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {room.type}
                </h2>

                <p className="text-gray-600 text-md mb-6">{room.description}</p>

                <Link
                  href={room.target}
                  className="inline-flex items-center px-6 py-3 mb-3 bg-red-600 text-white text-sm font-semibold rounded-full shadow-md hover:bg-yellow-500 transition-transform duration-300 transform hover:scale-105"
                >
                  Selengkapnya <FaAngleRight className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default TipeKamarComponent;
