import React from "react";
import {
  FaConciergeBell,
  FaParking,
  FaUtensils,
  FaCoffee,
  FaChalkboardTeacher,
  FaWifi,
  FaBed,
  FaTree,
  FaMosque,
} from "react-icons/fa";

const FasilitasAllComponent = () => {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          {
            icon: <FaConciergeBell />,
            title: "Resepsionis 24 Jam",
            description: "Kami siap melayani kebutuhan Anda kapan saja.",
          },
          {
            icon: <FaParking />,
            title: "Parkir Strategis",
            description: "Area parkir strategis yang aman dan nyaman.",
          },
          {
            icon: <FaUtensils />,
            title: "Restoran",
            description: "Nikmati hidangan lezat di restoran kami.",
          },
          {
            icon: <FaCoffee />,
            title: "Café Tiara",
            description: "Nikmati minuman dan makanan ringan di Café Tiara.",
          },
          {
            icon: <FaChalkboardTeacher />,
            title: "Meeting Room",
            description:
              "Ruang pertemuan yang dilengkapi dengan fasilitas lengkap.",
          },
          {
            icon: <FaMosque />,
            title: "Musholla",
            description: "Tempat ibadah yang nyaman dan bersih.",
          },
          {
            icon: <FaWifi />,
            title: "WiFi Gratis",
            description:
              "Tetap terhubung dengan internet cepat di seluruh area villa.",
          },
          {
            icon: <FaBed />,
            title: "Kamar Nyaman",
            description:
              "Kamar bersih dan nyaman untuk istirahat terbaik Anda.",
          },
          {
            icon: <FaTree />,
            title: "View Alam",
            description:
              "Dikelilingi pemandangan hijau untuk pengalaman yang menyegarkan.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <div className="text-4xl text-red-600 mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FasilitasAllComponent;
