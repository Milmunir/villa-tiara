"use client";

import React from "react";
import Slider from "react-slick";
import {
  FaParking,
  FaWifi,
  FaCoffee,
  FaBed,
  FaTree,
  FaConciergeBell,
  FaUtensils,
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaAngleRight,
  FaMosque,
} from "react-icons/fa";

const FasilitasComponent = () => {
  const fasilitasSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const locationSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-b from-red-500 to-red-600 py-16">
      <div className="container mx-auto px-6 md:px-20">
        {/* Title Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Fasilitas Villa
          </h1>
          <p className="text-md text-gray-100 mt-4 max-w-2xl mx-auto">
            Temukan beragam fasilitas modern dan premium untuk mendukung
            kenyamanan Anda selama menginap.
          </p>
        </section>

        {/* Slider Fasilitas */}
        <Slider {...fasilitasSettings}>
          {[
            {
              icon: <FaConciergeBell className="text-5xl text-red-600 mb-4" />,
              title: "Resepsionis 24/7",
              description: "Kami siap melayani Anda kapan saja.",
            },
            {
              icon: <FaParking className="text-5xl text-red-600 mb-4" />,
              title: "Parkir Strategis",
              description: "Area parkir aman dan nyaman.",
            },
            {
              icon: <FaUtensils className="text-5xl text-red-600 mb-4" />,
              title: "Restoran",
              description: "Nikmati hidangan yang lezat",
            },
            {
              icon: <FaCoffee className="text-5xl text-red-600 mb-4" />,
              title: "Café Tiara",
              description: "Minuman dan makanan ringan.",
            },
            {
              icon: (
                <FaChalkboardTeacher className="text-5xl text-red-600 mb-4" />
              ),
              title: "Meeting Room",
              description: "Fasilitas lengkap dan nyaman.",
            },
            {
              icon: <FaMosque className="text-5xl text-red-600 mb-4" />,
              title: "Musholla",
              description: "Tempat ibadah yang nyaman dan bersih.",
            },
            {
              icon: <FaWifi className="text-5xl text-red-600 mb-4" />,
              title: "WiFi Gratis",
              description: "Internet cepat di seluruh area villa.",
            },
            {
              icon: <FaBed className="text-5xl text-red-600 mb-4" />,
              title: "Kamar Nyaman",
              description: "Nikmati istirahat terbaik Anda.",
            },
            {
              icon: <FaTree className="text-5xl text-red-600 mb-4" />,
              title: "View Alam",
              description: "Pemandangan hijau yang menyegarkan.",
            },
          ].map((facility, index) => (
            <section
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 px-5"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
                {facility.icon}
                <h3 className="text-xl font-semibold text-gray-800">
                  {facility.title}
                </h3>
                <p className="text-gray-600 text-md">{facility.description}</p>
              </div>
            </section>
          ))}
        </Slider>

        {/* Slider Nearby Locations */}
        <section>
          <Slider {...locationSettings}>
            {[
              { name: "Telaga Sarangan", distance: "20 m dari villa" },
              { name: "Air Terjun Ngadiloyo", distance: "2.4 km dari villa" },
              { name: "Mojosemi Forest Park", distance: "1.23 km dari villa" },
              { name: "Agrowisata Strawberry", distance: "1.9 km dari villa" },
            ].map((location, index) => (
              <section
                key={index}
                className="grid grid-cols-1 lg:grid-cols-3 text-center px-5 gap-4"
              >
                <div className="bg-gray-50 rounded-xl p-4 shadow-md flex justify-between items-center hover:shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-4xl text-red-600 mr-4" />
                    <div className="items-start flex flex-col">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {location.name}
                      </h4>
                      <p className="text-md text-gray-600">
                        {location.distance}
                      </p>
                    </div>
                  </div>
                  <FaAngleRight className="text-red-600 text-3xl" />
                </div>
              </section>
            ))}
          </Slider>
        </section>
      </div>
    </div>
  );
};

export default FasilitasComponent;
