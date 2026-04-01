"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaAngleDown } from "react-icons/fa";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { motion } from "framer-motion";

const GaleriAllComponent = () => {
  const [gallery, setGallery] = useState([]);
  const [visibleItems, setVisibleItems] = useState(20);

  useEffect(() => {
    // Ambil data gambar dari localStorage
    const storedGallery = localStorage.getItem("galeriList");
    if (storedGallery) {
      try {
        const parsedGallery = JSON.parse(storedGallery);
        if (Array.isArray(parsedGallery)) {
          setGallery(parsedGallery);
        } else {
          setGallery([]);
        }
      } catch (error) {
        console.error("Error parsing gallery data:", error);
        setGallery([]);
      }
    }
  }, []);

  const handleShowMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 20);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-12 md:px-20 mt-16 md:mt-24">
        {/* Title Section */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Semua <span className="text-red-600">Galeri</span>
          </h1>
        </section>

        {/* Gallery Section */}
        <PhotoProvider>
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:mx-10 md:mx-2 lg:mx-10"
          >
            {gallery.slice(0, visibleItems).map((item, index) =>
              item.type === "image" ? (
                <PhotoView key={index} src={item.src}>
                  <motion.div className="relative group overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Image
                      className="w-full h-full object-cover"
                      src={item.src}
                      alt={`Gallery Image ${index + 1}`}
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
                  </motion.div>
                </PhotoView>
              ) : (
                <motion.div
                  key={index}
                  className="relative group overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  <iframe
                    src={item.src}
                    width="560"
                    height="315"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-cover"
                    title={`Video ${index + 1}`}
                  ></iframe>
                </motion.div>
              )
            )}
          </motion.section>
        </PhotoProvider>

        {/* Show More Button */}
        {visibleItems < gallery.length && (
          <div className="flex items-center text-lg justify-center mt-8">
            <button
              onClick={handleShowMore}
              className="text-gray-800 hover:text-red-600 flex items-center font-bold py-2 px-4 transition duration-300 transform hover:-translate-y-1 animate-bounce"
            >
              Show More <FaAngleDown className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GaleriAllComponent;
