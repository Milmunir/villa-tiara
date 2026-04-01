"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

const ArtikelAllComponent = () => {
  const [articles, setArticles] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState(20);

  useEffect(() => {
    // Ambil data dari localStorage
    const storedArticles = localStorage.getItem("artikelList");
    if (storedArticles) {
      setArticles(JSON.parse(storedArticles));
    }
  }, []);

  const truncateText = (text, limit) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  const handleShowMore = () => {
    setVisibleArticles((prevVisibleArticles) => prevVisibleArticles + 20);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-12 md:px-20 mt-16 md:mt-24">
        {/* Title Section */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Semua <span className="text-red-600">Artikel</span>
          </h1>
        </section>

        {/* Articles Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {articles
            .slice(0, visibleArticles)
            .reverse()
            .map((article) => (
              <motion.div
                key={article.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group"
              >
                <div className="w-full h-40 overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    src={article.src}
                    alt={`Blog ${article.id}`}
                    width={500}
                    height={300}
                    layout="responsive"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex space-x-2 mb-4">
                    <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      Tips
                    </span>
                    <span className="bg-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      Populer
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition duration-300">
                    {truncateText(article.title, 8)}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 mb-4">
                    {article.date}
                  </p>
                  <Link href={`/Artikel/${article.id}`} legacyBehavior>
                    <a className="inline-flex items-center py-2 px-4 border-2 border-gray-300 text-xs font-semibold rounded-lg hover:bg-red-500 hover:text-white transition duration-300">
                      Baca Selengkapnya <FaAngleRight className="ml-2" />
                    </a>
                  </Link>
                </div>
              </motion.div>
            ))}
        </motion.section>

        {/* Show More Button */}
        {visibleArticles < articles.length && (
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

export default ArtikelAllComponent;
