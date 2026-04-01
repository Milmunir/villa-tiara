import React from "react";
import { FaBed, FaAngleRight } from "react-icons/fa";
import Link from "next/link";

const TipeKamarAllComponent = () => {
  return (
    <section className="facilities mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold">
          Jenis Kamar <span className="text-red-700">Villa Tiara Sarangan</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <FaBed />,
            title: "Kamar Standar",
            target: "/TipeKamar/#standar",
          },
          {
            icon: <FaBed />,
            title: "Kamar Family",
            target: "/TipeKamar/#family",
          },
          {
            icon: <FaBed />,
            title: "Kamar Deluxe",
            target: "/TipeKamar/#deluxe",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="facility-item bg-red-600 p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Link
              className="flex items-center justify-between"
              href={item.target}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white mr-4 flex-shrink-0">
                  <div className="text-3xl text-red-600">{item.icon}</div>
                </div>
                <div>
                  <h3 className="text-lg text-white font-extrabold">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="flex">
                <FaAngleRight className="ml-2 text-2xl text-white" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TipeKamarAllComponent;
