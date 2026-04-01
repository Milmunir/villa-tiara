"use client";

import React, { useEffect } from "react";
import Glide from "@glidejs/glide";
import { FaChevronLeft, FaChevronRight, FaHeart, FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Nurul Halimah",
    type: "Deluxe",
    rating: "9.0",
    date: "02 Feb 2023",
    review:
      "Kamar yang nyaman dan fasilitas yang lengkap. Pelayanan sangat ramah dan membantu. Sangat puas menginap di sini!",
    likes: 25,
  },
  {
    name: "Baihaqi Rusdi",
    type: "Family",
    rating: "8.8",
    date: "15 Mar 2024",
    review:
      "Lokasi strategis dan pemandangan indah. Kamar bersih dan luas, cocok untuk keluarga. Anak-anak sangat menikmati!",
    likes: 30,
  },
  {
    name: "Ulil Ardian",
    type: "Standar",
    rating: "9.2",
    date: "05 Apr 2024",
    review:
      "Tempat yang sempurna untuk perjalanan bisnis. WiFi cepat dan fasilitas meeting room sangat baik. Akan kembali lagi!",
    likes: 45,
  },
  {
    name: "Farah Azizah",
    type: "Suite",
    rating: "9.5",
    date: "20 Mei 2024",
    review:
      "Pelayanan luar biasa dan kamar yang sangat mewah. Sarapan lezat dan banyak pilihan. Pengalaman menginap yang tak terlupakan!",
    likes: 50,
  },
  {
    name: "Andi Nugroho",
    type: "Twin",
    rating: "8.7",
    date: "12 Jun 2024",
    review:
      "Staf yang sangat ramah dan membantu. Lokasi dekat dengan pusat kota. Kamar bersih dan nyaman. Sangat merekomendasikan!",
    likes: 40,
  },
];

const TestimoniComponent = () => {
  useEffect(() => {
    const glide = new Glide(".glide", {
      type: "carousel",
      perView: 1,
      focusAt: "center",
      gap: 0,
      autoplay: 5000,
    });

    glide.mount();

    return () => glide.destroy();
  }, []);

  return (
    <div className="py-16">
      <div className="container mx-auto px-6 md:px-12">
        {/* Title Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Testimoni <span className="text-red-600">Pengunjung</span>
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Temukan pengalaman tamu kami di Villa Tiara Sarangan.
          </p>
        </section>

        {/* Testimonials Section */}
        <div className="glide">
          <div
            className="glide__track rounded-3xl shadow-xl"
            data-glide-el="track"
          >
            <ul className="glide__slides rounded-3xl bg-red-600 items-center flex justify-center">
              {testimonials.map((testimonial, index) => (
                <li
                  className="glide__slide py-10 flex px-24 md:px-36 items-center justify-center"
                  key={index}
                >
                  {/* Content Section */}
                  <div className="flex-1 rounded-xl md:ml-10">
                    <div className="lg:flex justify-between items-start rounded-xl">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-white">{testimonial.type}</p>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, starIndex) => (
                          <FaStar
                            key={starIndex}
                            className={
                              starIndex < Math.round(testimonial.rating / 2)
                                ? "text-yellow-400"
                                : "text-white"
                            }
                          />
                        ))}
                        <span className="text-sm text-white ml-2">
                          {testimonial.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-white italic mt-4 mb-6 text-lg">
                      &quot;{testimonial.review}&quot;
                    </p>

                    <div className="flex justify-between items-center text-sm text-white rounded-xl">
                      <span>{testimonial.date}</span>
                      <div className="flex items-center">
                        <FaHeart className="text-white mr-1" />
                        {testimonial.likes}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Arrows */}
          <div
            className="glide__arrows flex justify-between mt-6"
            data-glide-el="controls"
          >
            <button
              className="glide__arrow glide__arrow--left bg-white hover:bg-gray-700 rounded-full p-2 shadow-lg"
              data-glide-dir="<"
            >
              <FaChevronLeft className="text-white text-xl" />
            </button>
            <button
              className="glide__arrow glide__arrow--right bg-white hover:bg-gray-700 rounded-full p-2 shadow-lg"
              data-glide-dir=">"
            >
              <FaChevronRight className="text-white text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimoniComponent;
