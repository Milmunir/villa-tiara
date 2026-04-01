import React from "react";
import { FaInstagram, FaTwitter, FaTiktok, FaYoutube } from "react-icons/fa";
import Link from "next/link";

const FooterComponent = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10">
      <div className="container mx-auto px-10">
        {/* Section CTA */}
        <div className="relative bg-red-600 text-white rounded-xl p-8 md:p-10 mb-10 shadow-xl overflow-hidden">
          <div className="relative flex flex-col md:flex-row items-center justify-between">
            {/* Call to Action Text */}
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-xl md:text-3xl font-bold">
                Menginap Nyaman di <br className="lg:hidden" />
                <span className="text-yellow-200">Villa Tiara Sarangan</span>
              </h2>
              <p className="mt-2 text-md text-white/90">
                Tunggu apa lagi, segera pesan sebelum kamar kehabisan!
              </p>
            </div>
            {/* Call to Action Button */}
            <a
              href="https://wa.me/6281335623403?text=Halo%2C%20Saya%20ingin%20bertanya.%0AApakah%20ada%20kamar%20yang%20tersedia%20dan%20harga%20kamar%20per-malam%20berapa%3F%0A%0ASaya%20dapat%20informasi%20tentang%20Villa%20Tiara%20dari%20Website%2C%20Terima%20kasih."
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-white text-gray-800 px-8 py-3 rounded-lg text-md font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Hubungi Kami
            </a>
          </div>
        </div>

        {/* Section Footer Info */}
        <div className="grid grid-cols-5 lg:grid-cols-8 gap-10 mb-10">
          {/* Column 1 - logo/deskripsi */}
          <div className="col-span-5 lg:col-span-2">
            <h1 className="logo text-3xl md:text-4xl items-center justify-center font-medium transition-colors text-white mb-3">
              Villa Tiara
            </h1>
            <p className="lg:mb-6">
              Villa Tiara Sarangan menawarkan pengalaman menginap nyaman dan
              mewah, sejalan dengan keindahan Telaga Sarangan.
            </p>
          </div>

          {/* Column 2 - about & products */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h2 className="font-bold text-lg lg:mb-4">Tentang Villa</h2>
            <ul className="lg:mb-4">
              <li>
                <Link
                  href="/Beranda/#fasilitas"
                  className="hover:text-yellow-300"
                >
                  Fasilitas
                </Link>
              </li>
              <li>
                <Link href="/Galeri" className="hover:text-yellow-300">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/Artikel" className="hover:text-yellow-300">
                  Artikel
                </Link>
              </li>
              <li>
                <Link href="/Faq" className="hover:text-yellow-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-3 md:col-span-1 lg:col-span-1">
            <h2 className="font-bold text-lg lg:mb-4">Tipe Kamar</h2>
            <ul>
              <li>
                <Link
                  href="/TipeKamar/#standar"
                  className="hover:text-yellow-300"
                >
                  Standar
                </Link>
              </li>
              <li>
                <Link
                  href="/TipeKamar/#family"
                  className="hover:text-yellow-300"
                >
                  Family
                </Link>
              </li>
              <li>
                <Link
                  href="/TipeKamar/#deluxe"
                  className="hover:text-yellow-300"
                >
                  Deluxe
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - kantor & sosmed */}
          <div className="col-span-5 md:col-span-3 lg:col-span-2">
            <h2 className="font-bold text-lg mb-4">Lokasi Villa</h2>
            <p className="mb-2">
              No. 193, Jl, Raya Telaga Sarangan 63361 Magetan
            </p>
            <p className="mb-10">Phone: 0813-3562-3403</p>
            <div className="flex space-x-4">
              <a
                href="https://tiktok.com/@tiarasarangan"
                target="_blank"
                rel="noreferrer"
                className="hover:text-yellow-300"
                title="TikTok"
              >
                <FaTiktok className="mr-2" />
              </a>
              <a
                href="https://instagram.com/villatiara.sarangan"
                target="_blank"
                rel="noreferrer"
                className="hover:text-yellow-300"
                title="Instagram"
              >
                <FaInstagram className="mr-2" />
              </a>
              <a
                href="https://youtube.com/@villatiarasarangan9576"
                target="_blank"
                rel="noreferrer"
                className="hover:text-yellow-300"
                title="YouTube"
              >
                <FaYoutube className="mr-2" />
              </a>
              <a
                href=""
                target="_blank"
                rel="noreferrer"
                className="hover:text-yellow-300"
                title="X"
              >
                <FaTwitter className="mr-2" />
              </a>
            </div>
          </div>

          {/* Column 4 - Contact Info with Google Maps */}
          <div className="col-span-5 lg:col-span-2">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.0672071736167!2d111.21916971744382!3d-7.6759242999999895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e798f903e19578f%3A0x963948e3fb35ddef!2sVilla%20Tiara!5e0!3m2!1sid!2sid!4v1728476850917!5m2!1sid!2sid"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-3 bg-red-600">
        <p className="text-sm font-bold">
          &copy; 2024 Villa Tiara Sarangan | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default FooterComponent;
