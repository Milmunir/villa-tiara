import React from "react";
import { FaWater, FaCampground, FaTint, FaSeedling } from "react-icons/fa";

const NearbyLocComponent = () => {
  return (
    <section className="nearby-attractions mb-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold">
          Tempat Wisata Sarangan Dekat
          <span className="text-red-700"> Villa Tiara Sarangan</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: <FaWater />,
            title: "Telaga Sarangan",
            description: "20 m dari villa",
          },
          {
            icon: <FaTint />,
            title: "Air Terjun Ngadiloyo",
            description: "2.4 km dari villa",
          },
          {
            icon: <FaCampground />,
            title: "Mojosemi Forest Park",
            description: "1.23 km dari villa",
          },
          {
            icon: <FaSeedling />,
            title: "Agrowisata Strawberry",
            description: "1.9 km dari villa",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <div className="text-4xl text-green-600 mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NearbyLocComponent;
