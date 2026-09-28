"use client";
import { FaBed, FaCalendar, FaUsers, FaDollarSign } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "@/app/(contexts)/DarkModeContext";

const DashboardAdmin = () => {
  const today = new Date().toISOString().split("T")[0];
  const [bookingList, setBookingList] = useState([]);
  const [checkInList, setCheckInList] = useState([]);
  const [tamuList, setTamuList] = useState([]);
  const [riwayatList, setRiwayatList] = useState([]);
  const [totalRooms, setTotalRooms] = useState(0);
  const [selectedDate, setSelectedDate] = useState(today);
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    let cancelled = false;
    const loadDashboardData = async () => {
      const requests = [
        "/api/admin/bookings?status=BOOKED",
        "/api/admin/bookings?status=CHECKED_IN",
        "/api/admin/bookings?status=CHECKED_OUT",
        "/api/admin/guests",
        "/api/admin/rooms",
      ];
      const responses = await Promise.all(requests.map((url) => fetch(url)));
      if (responses.some((response) => !response.ok)) {
        throw new Error("Dashboard data could not be loaded.");
      }
      const [bookings, checkIns, history, guests, rooms] = await Promise.all(
        responses.map((response) => response.json())
      );
      if (cancelled) return;
      setBookingList(bookings);
      setCheckInList(checkIns);
      setRiwayatList(history);
      setTamuList(guests);
      setTotalRooms(
        (rooms.VillaTiara1 || []).length + (rooms.VillaTiara2 || []).length
      );
    };

    loadDashboardData().catch((error) => console.error(error));
    return () => {
      cancelled = true;
    };
  }, []);

  // Fungsi untuk menghitung jumlah occupied rooms berdasarkan tanggal
  const calculateOccupiedRooms = (date) => {
    const dateObj = new Date(date);

    // Filter kamar dari bookingList dan checkInList
    const occupiedFromBooking = bookingList.filter(
      (booking) =>
        new Date(booking.tanggalCheckIn) <= dateObj &&
        new Date(booking.tanggalCheckOut) > dateObj
    );

    const occupiedFromCheckIn = checkInList.filter(
      (checkin) =>
        new Date(checkin.tanggalCheckIn) <= dateObj &&
        new Date(checkin.tanggalCheckOut) > dateObj
    );

    return occupiedFromBooking.length + occupiedFromCheckIn.length;
  };

  // Fungsi untuk menghitung jumlah tamu terdaftar berdasarkan tanggal
  const calculateGuestCount = (date) => {
    const dateObj = new Date(date); // Filter tamu berdasarkan tanggal
    const nextDate = new Date(dateObj);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    const guestsOnDate = tamuList.filter((tamu) => {
      const guestDate = new Date(tamu.timestamp || tamu.tanggalWaktu);
      return !Number.isNaN(guestDate.getTime()) && guestDate < nextDate;
    });

    return guestsOnDate.length; // Jumlah tamu pada tanggal tertentu
  };

  // Fungsi untuk format mata uang
  const formatCurrency = (value) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)} M`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)} Jt`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)} Rb`;
    }
    return value;
  };

  // Menghitung total pendapatan dari riwayatList
  const totalPendapatan = riwayatList.reduce(
    (sum, riwayat) => sum + riwayat.harga,
    0
  );

  // Hitung occupied rooms, available rooms, umlah tamu dan total pendapatan
  const occupiedRooms = calculateOccupiedRooms(selectedDate);
  const availableRooms = totalRooms - occupiedRooms;
  const guestCount = calculateGuestCount(selectedDate);

  // Menggabungkan dan mengurutkan data berdasarkan tanggal update
  const combinedList = [...bookingList, ...checkInList, ...riwayatList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Menampilkan 10 data terbaru
  const latestReservations = combinedList.slice(0, 5);

  return (
    <div
      className={`fixed left-0 top-14 bottom-10 right-0 md:left-64 pt-14 pb-6 md:pt-10 px-8 overflow-y-auto ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className="md:flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Selamat Datang di Dashboard Villa Tiara Sarangan
        </h2>
        <input
          type="date"
          min={today}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 mt-6 md:mt-0 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition duration-300"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-yellow-500 text-white flex justify-center items-center rounded-full">
              <FaBed size={35} />
            </div>
            <div className="ml-4">
              <h3 className="text-md font-medium text-gray-600 dark:text-gray-300">
                Kamar Kosong
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {availableRooms}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-500 text-white flex justify-center items-center rounded-full">
              <FaCalendar size={30} />
            </div>
            <div className="ml-4">
              <h3 className="text-md font-medium text-gray-600 dark:text-gray-300">
                Kamar Terisi
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {occupiedRooms}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-red-500 text-white flex justify-center items-center rounded-full">
              <FaUsers size={35} />
            </div>
            <div className="ml-4">
              <h3 className="text-md font-medium text-gray-600 dark:text-gray-300">
                Tamu Terdaftar
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {guestCount} Org
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-green-500 text-white flex justify-center items-center rounded-full">
              <FaDollarSign size={35} />
            </div>
            <div className="ml-4">
              <h3 className="text-md font-medium text-gray-600 dark:text-gray-300">
                Pendapatan
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(totalPendapatan)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Reservasi Terbaru
          </h3>
          <div className="overflow-x-auto bg-white dark:bg-gray-700 shadow-lg rounded-xl">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-center text-black dark:text-gray-200">
                    Nama Tamu
                  </th>
                  <th className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-center text-black dark:text-gray-200">
                    ID Kamar
                  </th>
                  <th className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-center text-black dark:text-gray-200">
                    Check-In
                  </th>
                  <th className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-center text-black dark:text-gray-200">
                    Check-Out
                  </th>
                  <th className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-center text-black dark:text-gray-200">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {latestReservations.map((reservation, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 dark:text-gray-200">
                      {reservation.namaTamu}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 dark:text-gray-200">
                      {reservation.idKamar}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 dark:text-gray-200">
                      {new Date(
                        reservation.tanggalCheckIn
                      ).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 dark:text-gray-200">
                      {new Date(
                        reservation.tanggalCheckOut
                      ).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-2 px-4 border-b border-gray-300 dark:border-gray-700 ${
                        reservation.statusBooking === "checkin"
                          ? "text-green-500 dark:text-green-400"
                          : reservation.statusBooking === "booking"
                          ? "text-yellow-500 dark:text-yellow-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {reservation.statusBooking}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 col-span-1 p-4 rounded-xl">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Pengumuman
          </h3>
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg">
            <div className="py-4 px-5 dark:text-gray-200">
              <p className="mb-2">
                Libur Nasional{" "}
                <span className="text-white bg-red-500 text-xs px-3 py-1 rounded-2xl mb-5">
                  Penting
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Oleh: Nama Syahrul - 2022-03-02 00:00
              </p>
            </div>
            <div className="py-4 px-5 dark:text-gray-200">
              <p className="mb-2">
                Libur Nasional{" "}
                <span className="text-white bg-yellow-500 text-xs px-3 py-1 rounded-2xl mb-5">
                  Penting
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Oleh: Nama Syahrul - 2022-03-02 00:00
              </p>
            </div>
            <div className="py-4 px-5 dark:text-gray-200">
              <p className="mb-2">
                Libur Nasional{" "}
                <span className="text-white bg-red-500 text-xs px-3 py-1 rounded-2xl mb-5">
                  Penting
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Oleh: Nama Syahrul - 2022-03-02 00:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
