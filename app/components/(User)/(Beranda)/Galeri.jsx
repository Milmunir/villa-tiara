"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Image from "next/image";
import "react-photo-view/dist/react-photo-view.css";
import { FaAngleRight } from "react-icons/fa";
import mediaItems from "../(Galeri)/GaleriDummy";

const GaleriComponent = () => {
  const [gallery, setGallery] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Deteksi mobile jika lebar layar kurang dari 768px
    };
    // Tambahkan event listener untuk menangani perubahan ukuran layar
    window.addEventListener("resize", handleResize);
    // Panggil handleResize untuk menetapkan nilai awal
    handleResize();
    // Hapus event listener saat komponen di-unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Simpan data gambar ke localStorage
    localStorage.setItem("galeriList", JSON.stringify(mediaItems));
    // Ambil data gambar dari localStorage
    const storedGallery = localStorage.getItem("galeriList");
    if (storedGallery) {
      const parsedGallery = JSON.parse(storedGallery);
      setGallery(
        isMobile ? parsedGallery.slice(0, 4) : parsedGallery.slice(0, 8)
      );
    }
  }, [isMobile]);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6 md:px-12">
        {/* Title Section */}
        <section className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Galeri <span className="text-red-600">Villa</span>
          </h1>
          <p className="text-md text-gray-600 mt-4 max-w-3xl mx-auto">
            Jelajahi setiap sudut Villa Tiara Sarangan dengan koleksi foto
            terbaik yang kami tawarkan.
          </p>
        </section>

        {/* Gallery Section */}
        <PhotoProvider>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-4 md:mx-10">
            {gallery.map((item, index) => {
              if (index < gallery.length - 1) {
                if (item.type === "image") {
                  return (
                    <PhotoView key={index} src={item.src}>
                      <div className="relative group overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <Image
                          className="w-full h-full object-cover"
                          src={item.src}
                          alt={`Media ${index + 1}`}
                          width={800}
                          height={533}
                          loading="lazy"
                          layout="responsive"
                        />
                        <div className="absolute inset-0 bg-black via-transparent opacity-0 group-hover:opacity-70 flex items-center justify-center transition-opacity duration-300 pointer">
                          <span className="text-white text-md font-semibold">
                            Klik untuk memperbesar
                          </span>
                        </div>
                      </div>
                    </PhotoView>
                  );
                } else if (item.type === "video") {
                  return (
                    <div
                      key={index}
                      className="relative group overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                    >
                      <iframe
                        src={item.src}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full object-cover"
                        title={`Video ${index + 1}`}
                      ></iframe>
                    </div>
                  );
                }
              } else {
                return (
                  <Link key={index} href="/Galeri">
                    <div className="relative group overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <Image
                        className="w-full h-full object-cover"
                        src={item.src}
                        alt="View More"
                        width={800}
                        height={533}
                        loading="lazy"
                        layout="responsive"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
                        <span className="text-white flex text-md font-semibold mb-2">
                          Lebih Banyak
                        </span>
                        <FaAngleRight className="text-white text-2xl ml-2 animate-bounce" />
                      </div>
                    </div>
                  </Link>
                );
              }
            })}
          </section>
        </PhotoProvider>
      </div>
    </div>
  );
};

export default GaleriComponent;
