"use client";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const customComponents = {
  a: ({ href, children }) => {
    const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
    if (isInternal) {
      return (
        <Link href={href} className="text-red-600 font-bold hover:underline">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline font-semibold"
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }) => (
    <span className="block py-4">
      <Image
        src={src}
        alt={alt || "Gambar Artikel"}
        width={800}
        height={450}
        layout="responsive"
        className="rounded-xl md:rounded-2xl object-cover"
      />
    </span>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 text-base md:text-lg leading-relaxed md:leading-8 mb-6 text-justify">
      {children}
    </p>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-6 mb-3">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="list-disc ml-6 my-6 space-y-3 text-gray-700">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-6 my-6 space-y-3 text-gray-700">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-base md:text-lg leading-relaxed md:leading-8 text-gray-700 pl-1">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-red-500 pl-4 py-2 my-6 italic text-gray-600 bg-gray-50 rounded-r">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">{children}</strong>
  ),
  hr: () => <hr className="my-8 border-gray-200" />,
};

const ArtikelDetailComponent = ({ article, recentArticles = [] }) => {
  const router = useRouter();

  const truncateText = (text, limit) => {
    const words = (text || "").split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  if (!article) {
    return (
      <div className="text-center py-32 text-gray-600 font-semibold">
        Artikel tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="mt-16 md:mt-24 grid md:grid-cols-4 md:gap-4 px-4 md:px-20">
      <div className="container md:col-span-3 mx-auto pt-14 pb-10">
        {/* Tombol Back */}
        <button
          onClick={() => router.push("/artikel")}
          className="mb-8 px-4 py-2 text-sm font-semibold text-white flex justify-center items-center bg-red-500 rounded hover:bg-yellow-600 transition duration-300"
        >
          <FaAngleLeft className="mr-2" /> Kembali
        </button>

        {/* Detail Artikel */}
        <div className="bg-white rounded-xl shadow-lg px-6 md:px-10 py-10 md:py-14 overflow-hidden">
          {/* Judul Artikel */}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 my-4 text-center">
              {article.title}
            </h1>
          </div>

          {/* Gambar Artikel */}
          {article.coverImage && (
            <div className="py-6">
              <Image
                src={article.coverImage}
                alt={article.title}
                width={800}
                height={450}
                loading="lazy"
                layout="responsive"
                className="rounded-xl md:rounded-2xl object-cover"
              />
            </div>
          )}

          {/* Tanggal Artikel */}
          <div>
            <p className="text-gray-500 text-sm text-center mb-6">
              Diterbitkan pada{" "}
              <span className="font-semibold">
                {article.displayDate || article.date}
              </span>
            </p>
          </div>

          {/* Konten Artikel */}
          <div className="py-4 prose prose-lg max-w-none text-gray-700">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={customComponents}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Tag Artikel */}
          {article.tags && article.tags.length > 0 && (
            <div className="py-6 border-t border-gray-100 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Read More */}
          {article.readmore && (
            <div className="text-md text-start pt-4 border-t border-gray-100">
              <p className="font-semibold text-gray-800">
                Baca Juga:{" "}
                <Link
                  className="text-blue-600 hover:underline"
                  href={`/artikel/${article.readmore}`}
                >
                  {article.readmoreTitle}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-1 py-32 hidden md:inline">
        <div className="bg-red-500 font-bold text-lg text-center text-white py-4 mb-4 rounded-lg">
          <h1>Artikel Terbaru</h1>
        </div>
        {/* Articles Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
          className="grid grid-cols-1 gap-4"
        >
          {recentArticles.length > 0 ? (
            recentArticles.map((item) => (
              <motion.div
                key={item.slug}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group"
              >
                <div className="w-full h-40 overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    src={item.coverImage}
                    alt={item.title}
                    width={500}
                    height={300}
                    layout="responsive"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition duration-300">
                    {truncateText(item.title, 8)}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 mb-4">
                    {item.displayDate || item.date}
                  </p>
                  <Link
                    href={`/artikel/${item.slug}`}
                    className="inline-flex items-center py-2 px-4 border-2 border-gray-300 text-xs font-semibold rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
                  >
                    Baca Selengkapnya <FaAngleRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-4">
              Tidak ada artikel untuk ditampilkan.
            </p>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default ArtikelDetailComponent;
