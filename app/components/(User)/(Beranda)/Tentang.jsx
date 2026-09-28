"use client";
import React from "react";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/swiper-bundle.css";

const TentangComponent = () => {
  const images = [
    "https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/10011479-0317d107c478aa5272bfdcde77220bcc.jpeg",
    "https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/10011479-147640908bf0184df67e31f2c26009fa.jpeg",
    "https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/10011479-9fc40c87b7c08e70296547d0c97dc3cd.jpeg",
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto flex flex-col lg:flex-row items-center lg:space-x-16 px-6">
        <section className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <div className="space-y-6">
            <p className="text-md font-extrabold text-red-600 uppercase tracking-wider">
              Tentang Villa Tiara Sarangan
            </p>
            <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
              Nikmati Pengalaman Tak Terlupakan di{" "}
              <span className="text-red-600">Villa Tiara Sarangan</span>
            </h1>
            <p className="text-md text-gray-700 leading-relaxed">
              Villa Tiara Sarangan menawarkan pemandangan indah Telaga Sarangan
              dan akses dekat dan mudah ke destinasi wisata Sarangan dan
              Tawangmangu. Harga yang terjangkau dan pelayanan maksimal
              membuatnya ideal bagi Anda yang ingin berlibur dengan nyaman tanpa
              menguras kantong.
            </p>
            <Link
              href="/tentang"
              className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-red-700 transition duration-300"
            >
              <span>Selengkapnya</span>
              <FaAngleRight className="ml-2" />
            </Link>
          </div>
        </section>

        <section className="w-full lg:w-1/2 relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={30}
            effect="fade"
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="${className} custom-pagination-bullet"></span>`,
            }}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            className="rounded-3xl md:rounded-5xl text-red-500 shadow-xl"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <Image
                  className="w-full h-auto object-cover rounded-3xl md:rounded-5xl"
                  src={src}
                  alt={`Villa Tiara Sarangan ${index}`}
                  width={800}
                  height={500}
                  loading="lazy"
                  layout="responsive"
                />
              </SwiperSlide>
            ))}

            {/* Custom Navigation Buttons */}
            <div className="custom-prev absolute top-1/2 left-4 z-10 text-white text-2xl cursor-pointer border-2 bg-gray-500 bg-opacity-50 border-white rounded-md p-2 shadow-lg hover:bg-red-500">
              ❮
            </div>
            <div className="custom-next absolute top-1/2 right-4 z-10 text-white text-2xl cursor-pointer border-2 bg-gray-500 bg-opacity-50 border-white rounded-md p-2 shadow-lg hover:bg-red-500">
              ❯
            </div>
          </Swiper>
        </section>
      </div>
    </div>
  );
};

export default TentangComponent;
