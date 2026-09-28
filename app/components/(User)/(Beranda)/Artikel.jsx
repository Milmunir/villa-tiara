"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import Image from "next/image";

const ArtikelComponent = ({ initialArticles = [] }) => {
  const [articles, setArticles] = useState(initialArticles);

  useEffect(() => {
    if (articles.length === 0) {
      fetch("/api/articles?limit=4")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setArticles(data);
        })
        .catch((err) => console.error("Error fetching recent articles:", err));
    }
  }, [articles.length]);

  const truncateText = (text, limit) => {
    const words = (text || "").split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-5 md:px-20">
        {/* Title Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Artikel <span className="text-red-600">Terbaru</span>
          </h1>
          <p className="text-gray-600 text-md mt-4 max-w-2xl mx-auto">
            Dapatkan informasi dan tips menarik seputar wisata, pengalaman, dan
            banyak lagi di Telaga Sarangan.
          </p>
        </section>

        {/* Articles Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-0">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.slug}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-40 overflow-hidden relative">
                    <Image
                      className="object-cover w-full h-full"
                      src={article.coverImage}
                      alt={article.title}
                      width={500}
                      height={300}
                      layout="responsive"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition duration-300 line-clamp-2">
                      {truncateText(article.title, 8)}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 mb-4">
                      {article.displayDate || article.date}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <Link
                    href={`/artikel/${article.slug}`}
                    className="inline-flex items-center py-2 px-4 border-2 border-gray-300 text-xs font-semibold rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
                  >
                    Baca Selengkapnya <FaAngleRight className="ml-2" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-4">
              Tidak ada artikel untuk ditampilkan.
            </p>
          )}
        </section>

        {/* View More Section */}
        <div className="text-center mt-12">
          <div className="inline-block py-3 px-6 bg-red-600 text-white text-lg font-bold rounded-full shadow-lg cursor-pointer hover:bg-yellow-500 transition duration-300 hover:scale-105 transform">
            <Link href="/artikel" className="flex items-center justify-center">
              <span>Lihat Semua Artikel</span>
              <FaAngleRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikelComponent;
