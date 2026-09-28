"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

const ArtikelAllComponent = ({ initialArticles = [] }) => {
  const [articles] = useState(initialArticles);
  const [visibleArticles, setVisibleArticles] = useState(20);

  const truncateText = (text, limit) => {
    const words = (text || "").split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  const handleShowMore = () => {
    setVisibleArticles((prevVisibleArticles) => prevVisibleArticles + 20);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-6 md:px-20 mt-16 md:mt-24">
        {/* Title Section */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Semua <span className="text-red-600">Artikel</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Dapatkan informasi dan tips menarik seputar wisata, pengalaman, dan panduan liburan di Telaga Sarangan.
          </p>
        </section>

        {/* Articles Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {articles.slice(0, visibleArticles).map((article) => (
            <motion.div
              key={article.slug}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden group flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-44 overflow-hidden relative">
                  <Image
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    src={article.coverImage}
                    alt={article.title}
                    width={500}
                    height={300}
                    layout="responsive"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(article.tags && article.tags.length > 0
                      ? article.tags.slice(0, 2)
                      : ["Wisata"]
                    ).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-red-600 transition duration-300 line-clamp-2">
                    {truncateText(article.title, 8)}
                  </h3>
                  <p className="text-gray-500 text-xs mt-2 mb-4">
                    {article.displayDate || article.date}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <Link
                  href={`/artikel/${article.slug}`}
                  className="inline-flex items-center py-2 px-4 border border-gray-300 text-xs font-semibold rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-300"
                >
                  Baca Selengkapnya <FaAngleRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Show More Button */}
        {visibleArticles < articles.length && (
          <div className="flex items-center text-lg justify-center mt-10">
            <button
              onClick={handleShowMore}
              className="text-gray-800 hover:text-red-600 flex items-center font-bold py-2 px-4 transition duration-300 transform hover:-translate-y-1 animate-bounce text-sm"
            >
              Show More <FaAngleDown className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtikelAllComponent;
