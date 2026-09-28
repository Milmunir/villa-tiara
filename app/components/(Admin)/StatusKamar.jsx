"use client";

import React, { useEffect, useState } from "react";
import { FaBed, FaCheckCircle, FaUserClock, FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const StatusKamar = () => {
  const [kamarData, setKamarData] = useState({ VillaTiara1: [], VillaTiara2: [] });
  useEffect(() => {
    fetch(`/api/admin/rooms?date=${new Date().toISOString().slice(0, 10)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Room status could not be loaded.");
        return response.json();
      })
      .then(setKamarData)
      .catch((error) => console.error(error));
  }, []);

  const getRoomStatus = (room) => {
    if (room.status === "checked") return { status: "Terisi", color: "bg-red-500 text-white", icon: <FaTimesCircle /> };
    if (room.status === "booked") return { status: "Dipesan", color: "bg-yellow-500 text-white", icon: <FaUserClock /> };

    return { status: "Tersedia", color: "bg-green-500 text-white", icon: <FaCheckCircle /> };
  };

  const renderVillaGrid = (title, rooms) => (
    <div className="mb-10">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2">
        {title} ({rooms.length} Kamar)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rooms.map((room) => {
          const { status, color, icon } = getRoomStatus(room);
          return (
            <div
              key={room.kodeKamar}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-gray-800 dark:text-gray-100 flex items-center">
                    <FaBed className="mr-2 text-yellow-500" />
                    {room.kodeKamar}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold ${color}`}>
                    {icon}
                    {status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tipe: {room.tipeKamar}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Kapasitas: {room.jumlahBedKamar}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-600 dark:text-gray-300">Harga / malam</span>
                <span className="text-red-600 dark:text-red-400 font-bold">
                  Rp {room.hargaKamar?.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed left-0 top-16 bottom-10 right-0 md:left-64 pt-14 pb-6 md:pt-10 px-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6 flex items-center justify-center">
        <FaBed className="text-yellow-500 mr-2" />
        Status Kamar Real-time
      </h2>

      <div className="mt-4 flex justify-between items-center text-sm mb-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center text-md font-semibold text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition"
        >
          <FaArrowLeft className="text-yellow-500 mr-2" />
          Kembali ke Dashboard
        </Link>
        <div className="flex space-x-3 text-xs font-medium">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Tersedia</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Dipesan</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Terisi</span>
        </div>
      </div>

      {renderVillaGrid("Villa Tiara 1", kamarData.VillaTiara1 || [])}
      {renderVillaGrid("Villa Tiara 2", kamarData.VillaTiara2 || [])}
    </div>
  );
};

export default StatusKamar;
