import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import artikelLists from "../(Artikel)/ArtikelDummy";
import { renderToString } from "react-dom/server"; // Import renderToString

const ArtikelComponent = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Proses artikelLists: konversi komponen React di properti 'content' menjadi string HTML
    const serializedArticles = artikelLists.map((artikel) => ({
      ...artikel,
      content: renderToString(artikel.content), // Konversi content ke string HTML
    }));

    // Simpan artikel ke Local Storage
    localStorage.setItem("artikelList", JSON.stringify(serializedArticles));

    // Ambil data dari Local Storage
    const storedArticles = localStorage.getItem("artikelList");
    if (storedArticles) {
      const parsedArticles = JSON.parse(storedArticles);

      // Balikkan urutan artikel dan ambil 4 artikel terbaru
      const reversedArticles = parsedArticles.reverse();
      setArticles(reversedArticles.slice(0, 4));
    }
  }, []);

  const truncateText = (text, limit) => {
    const words = text.split(" ");
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
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-0"
        >
          {articles.length > 0 ? (
            articles.map((article) => (
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
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition duration-300">
                    {truncateText(article.title, 8)}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 mb-4">
                    {article.date}
                  </p>
                  <Link
                    href={`/Artikel/${article.id}`}
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

        {/* View More Section */}
        <div className="text-center mt-12">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-block py-3 px-6 bg-red-600 text-white text-lg font-bold rounded-full shadow-lg cursor-pointer hover:bg-yellow-500 transition duration-300"
          >
            <Link href="/Artikel" className="flex items-center justify-center">
              <span>Lihat Semua Artikel</span>
              <FaAngleRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ArtikelComponent;
