"use client";

import {
  FaPlus,
  FaBookOpen,
  FaArrowLeft,
  FaTrash,
  FaSearch,
  FaSignInAlt,
  FaEdit,
  FaTimes,
  FaHotel,
  FaBed,
  FaTags,
  FaDollarSign,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useContext, useState, useCallback } from "react";
import { DarkModeContext } from "@/app/(contexts)/DarkModeContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const DaftarBooking = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const router = useRouter();
  const { isDarkMode } = useContext(DarkModeContext);
  const today = getCurrentDate();

  const [bookingList, setBookingList] = useState([]);
  const [villaTiara1, setVillaTiara1] = useState([]);
  const [villaTiara2, setVillaTiara2] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookingList, setFilteredBookingList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editingBooking, setEditingBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBed, setSelectedBed] = useState("-");
  const [selectedStatus, setSelectedStatus] = useState("-");
  const [selectedRoomHarga, setSelectedRoomHarga] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      const response = await fetch("/api/admin/bookings?status=BOOKED");
      const bookings = await response.json();
      if (!response.ok) throw new Error(bookings.error || "Booking gagal dimuat.");
      if (cancelled) return;
      setBookingList(bookings);
      setFilteredBookingList(bookings);
    };
    loadData().catch((loadError) => {
      if (!cancelled) setError(loadError.message);
    });
    return () => {
      cancelled = true;
    };
  }, [today]);

  useEffect(() => {
    const results = bookingList.filter(
      (booking) =>
        booking.namaTamu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.idKamar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.noTelepon.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBookingList(results);
  }, [searchTerm, bookingList]);

  useEffect(() => {
    const today = getCurrentDate();
    setSelectedDate(today);
  }, []);

    // Fungsi untuk mengecek ketersediaan kamar berdasarkan tanggal yang dipilih
  const checkRoomAvailabilityByDate = useCallback(async () => {
    if (!selectedDate) return;
    const excludeId = editingBooking?.id ? `&excludeReservationId=${editingBooking.id}` : "";
    try {
      const response = await fetch(`/api/admin/rooms?date=${selectedDate}${excludeId}`);
      const rooms = await response.json();
      if (!response.ok) throw new Error(rooms.error || "Kamar gagal dimuat.");
      setVillaTiara1(rooms.VillaTiara1 || []);
      setVillaTiara2(rooms.VillaTiara2 || []);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [selectedDate, editingBooking?.id]);

  // Memperbarui daftar kamar setiap kali tanggal yang dipilih berubah
  useEffect(() => {
    checkRoomAvailabilityByDate();
  }, [checkRoomAvailabilityByDate]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (id) => {
    const bookingToEdit = bookingList.find((booking) => booking.id === id);
    setEditingBooking(bookingToEdit);
    setSelectedDate(bookingToEdit.tanggalCheckIn);
    setSelectedRoomHarga(bookingToEdit.room.pricePerNight);
    setSelectedBed(bookingToEdit.room.bedInfo);
    setSelectedStatus("kosong");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const confirmation = await MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Pastikan data yang Anda masukkan sudah benar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? "#f59e0b" : "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, perbarui!",
      cancelButtonText: "Batal",
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    });
    if (!confirmation.isConfirmed) return;
    try {
      const response = await fetch(`/api/admin/bookings/${editingBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBooking),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Booking gagal diperbarui.");
      const updatedBookingList = bookingList.map((booking) => booking.id === result.id ? result : booking);
      setBookingList(updatedBookingList);
      setFilteredBookingList(updatedBookingList);
      setEditingBooking(null);
      setIsEditing(false);
      await MySwal.fire({ title: "Update Berhasil!", text: "Data booking berhasil diperbarui.", icon: "success" });
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const calculateHarga = (tanggalCheckIn, tanggalCheckOut, hargaKamar) => {
    if (tanggalCheckIn && tanggalCheckOut) {
      const checkInTime = new Date(tanggalCheckIn);
      const checkOutTime = new Date(tanggalCheckOut);
      const timeDifference = checkOutTime - checkInTime;
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      const total = daysDifference * hargaKamar;
      return total;
    }
    return 0;
  };

  // Fungsi untuk menghapus tamu berdasarkan index
  const handleDelete = async (id) => {
    const confirmation = await MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikan data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? "#f59e0b" : "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    });
    if (!confirmation.isConfirmed) return;
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Booking gagal dibatalkan.");
      const updatedBookingList = bookingList.filter((booking) => booking.id !== id);
      setBookingList(updatedBookingList);
      setFilteredBookingList(updatedBookingList);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  // Fungsi untuk menghapus semua data booking
  const handleClearData = async () => {
    const confirmation = await MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikan data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? "#f59e0b" : "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    });
    if (!confirmation.isConfirmed) return;
    try {
      for (const booking of bookingList) {
        const response = await fetch(`/api/admin/bookings/${booking.id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Sebagian booking gagal dibatalkan.");
      }
      setBookingList([]);
      setFilteredBookingList([]);
    } catch (clearError) {
      setError(clearError.message);
    }
  };

  // Fungsi untuk checkIn berdasarkan index
  const handleCheckInClick = async (id) => {
    const confirmation = await MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Pastikan tamu telah datang.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? "#f59e0b" : "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
      cancelButtonText: "Batal",
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    });
    if (!confirmation.isConfirmed) return;
    try {
      const response = await fetch(`/api/admin/bookings/${id}/check-in`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Check-in gagal disimpan.");
      router.push("/admin/daftarcheckin");
    } catch (checkInError) {
      setError(checkInError.message);
    }
  };

  // Fungsi untuk navigasi ke halaman tambah tamu
  const handleAddGuest = () => {
    router.push("/admin/tambahbooking");
  };

  // Hitung indeks untuk item yang akan ditampilkan pada halaman saat ini
  const sortedBookingList = [...filteredBookingList].reverse();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBookingList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Fungsi untuk mengubah halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fungsi untuk menangani klik pada tombol kamar
  const handleRoomClick = (roomId) => {
    const allKamar = [...villaTiara1, ...villaTiara2];
    const kamar = allKamar.find((kamar) => kamar.kodeKamar === roomId);
    if (kamar && kamar.status === "kosong") {
      setSelectedRoomHarga(kamar.hargaKamar);
      setSelectedBed(kamar.jumlahBedKamar);
      setSelectedStatus(kamar.status);
      setEditingBooking((prev) => ({
        ...prev,
        idKamar: kamar.kodeKamar,
        tipeKamar: kamar.tipeKamar,
        harga: calculateHarga(
          prev.tanggalCheckIn,
          prev.tanggalCheckOut,
          kamar.hargaKamar
        ),
      }));
    }
  };

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setEditingBooking((prev) => {
      const updatedHarga = calculateHarga(
        newCheckIn,
        prev.tanggalCheckOut,
        selectedRoomHarga
      );
      return { ...prev, tanggalCheckIn: newCheckIn, harga: updatedHarga };
    });
  };

  const handleCheckOutChange = (e) => {
    const newCheckOut = e.target.value;
    setEditingBooking((prev) => {
      const updatedHarga = calculateHarga(
        prev.tanggalCheckIn,
        newCheckOut,
        selectedRoomHarga
      );
      return { ...prev, tanggalCheckOut: newCheckOut, harga: updatedHarga };
    });
  };

  return (
    <div className="fixed left-0 top-16 bottom-10 right-0 md:left-64 pt-14 pb-6 md:pt-10 px-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8 flex items-center justify-center">
        <FaBookOpen className="text-yellow-500 mr-2" />
        Daftar Booking
      </h2>
      {error && <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">{error}</p>}
      <div className="mt-6 flex justify-between items-center text-sm mb-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center text-md font-semibold text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition"
        >
          <FaArrowLeft className="text-yellow-500 mr-2" />
          Kembali
        </Link>
        <button
          onClick={handleAddGuest}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-sm flex items-center transition"
        >
          <FaPlus className="mr-2" />
          Tambah Booking
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Cari Berdasarkan Nama, ID Kamar, atau No Telepon"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-md shadow-md dark:bg-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition duration-300"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
      </div>

      {/* Tabel booking */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 text-left shadow-lg rounded-lg">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">ID Kamar</th>
              <th className="px-4 py-2">Nama Tamu</th>
              <th className="px-4 py-2">No Telepon</th>
              <th className="px-4 py-2">Check-in</th>
              <th className="px-4 py-2">Check-out</th>
              <th className="px-4 py-2">Total Harga</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody id="bookTableBody">
            {currentItems.length > 0 ? (
              currentItems.map((booking, index) => (
                <tr key={index} className="dark:text-gray-200">
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {booking.idKamar}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {booking.namaTamu}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {booking.noTelepon}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {booking.tanggalCheckIn}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {booking.tanggalCheckOut}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {booking.harga}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    <button
                      className="bg-green-600 hover:bg-green-500 text-white px-2 mx-1 py-1 rounded-md"
                      onClick={() => handleCheckInClick(booking.id)}
                    >
                      <FaSignInAlt />
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-md mx-1"
                      onClick={() => handleEditClick(booking.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 mx-1 py-1 rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 dark:text-gray-400">
                  Tidak ada booking yang terdaftar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex justify-center items-start z-50 p-10 py-24 md:left-64 overflow-auto">
          <div className="md:flex bg-white dark:bg-gray-700 rounded-xl shadow-lg">
            <div className="bg-gray-300 dark:bg-gray-900 md:rounded-bl-xl rounded-tl-xl md:rounded-tr-none rounded-tr-xl py-9 px-12 md:col-span-2">
              <div className="md:flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-center flex items-center justify-center text-gray-800 dark:text-gray-200 pb-6 md:pb-0">
                  <FaHotel className="text-yellow-500 mr-2" /> Denah Kamar
                </h2>
                <input
                  type="date"
                  id="selectedDate"
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none transition duration-300 ease-in-out"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={today}
                  style={{ width: "115px" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="logo bg-gradient-to-br from-orange-500 to-red-500 text-white text-md rounded-lg p-2 mb-4 text-center font-bold">
                    Villa Tiara 2
                  </h2>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    {villaTiara2.map((kamar) => (
                      <div
                        key={kamar.kodeKamar}
                        className={`text-center p-2 border-2 rounded-lg cursor-pointer ${
                          kamar.status === "checked"
                            ? "bg-green-600 text-white"
                            : kamar.status === "booked"
                            ? "bg-yellow-500 text-black"
                            : "bg-yellow-50 dark:bg-gray-700 border-yellow-500 dark:border-gray-500 hover:border-orange-700 dark:hover:border-orange-500"
                        }`}
                        onClick={() => handleRoomClick(kamar.kodeKamar)}
                      >
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {kamar.kodeKamar}
                        </h3>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="logo bg-gradient-to-br from-orange-500 to-red-500 text-white text-md rounded-lg p-2 mb-4 text-center font-bold">
                    Villa Tiara 1
                  </h2>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    {villaTiara1.map((kamar) => (
                      <div
                        key={kamar.kodeKamar}
                        className={`text-center p-2 border-2 rounded-lg cursor-pointer ${
                          kamar.status === "checked"
                            ? "bg-green-600 text-white"
                            : kamar.status === "booked"
                            ? "bg-yellow-500 text-black"
                            : "bg-yellow-50 dark:bg-gray-700 border-yellow-500 dark:border-gray-500 hover:border-orange-700 dark:hover:border-orange-500"
                        }`}
                        onClick={() => handleRoomClick(kamar.kodeKamar)}
                      >
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {kamar.kodeKamar}
                        </h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block p-4 bg-gray-200 dark:bg-gray-700 rounded-xl mt-4 shadow-lg border-2 border-gray-400 dark:border-gray-500">
                <div className="grid grid-cols-1 md:grid-cols-11 gap-2">
                  <div className="flex p-2 md:col-span-4 items-center shadow-md justify-start rounded-lg bg-white dark:bg-gray-800">
                    <FaBed className="text-yellow-600 text-xl mx-4" />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Jumlah Bed:
                      </h4>
                      <p className="text-gray-800 dark:text-gray-200 text-md font-bold">
                        {selectedBed}
                      </p>
                    </div>
                  </div>
                  <div className="flex p-2 md:col-span-3 items-center shadow-md justify-start rounded-lg bg-white dark:bg-gray-800">
                    <FaTags className="text-yellow-600 text-xl mx-4" />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Status:
                      </h4>
                      <p
                        className={`text-gray-800 dark:text-gray-200 text-md font-bold ${
                          selectedStatus === "kosong"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedStatus}
                      </p>
                    </div>
                  </div>
                  <div className="flex p-2 md:col-span-4 items-center shadow-md justify-start rounded-lg bg-white dark:bg-gray-800">
                    <FaDollarSign className="text-yellow-600 text-xl mx-4" />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Harga per Malam :
                      </h4>
                      <p className="text-gray-800 dark:text-gray-200 text-md font-bold">
                        Rp. {selectedRoomHarga.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-6 px-10 w-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Edit Booking
              </h3>
              <form className="text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      ID Kamar
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={editingBooking.idKamar}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          idKamar: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Tipe Kamar
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={editingBooking.tipeKamar}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          tipeKamar: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Nama Tamu
                  </label>
                  <input
                    type="text"
                    value={editingBooking.namaTamu}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        namaTamu: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    No Telepon
                  </label>
                  <input
                    type="text"
                    value={editingBooking.noTelepon}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        noTelepon: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Check-In
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={editingBooking?.tanggalCheckIn || ""}
                      onChange={handleCheckInChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      min={editingBooking.tanggalCheckIn}
                      value={editingBooking?.tanggalCheckOut || ""}
                      onChange={handleCheckOutChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Total Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={editingBooking?.harga || 0}
                    readOnly
                    className="w-full p-2 border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-700 rounded-md dark:text-gray-200"
                  />
                </div>
                <div className="flex justify-center items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md transition flex items-center"
                  >
                    <FaTimes className="mr-2" />
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-md transition flex items-center"
                  >
                    <FaEdit className="mr-2" />
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between my-6">
        <div>
          <button
            onClick={handleClearData}
            className="py-2 px-4 bg-gray-500 dark:bg-gray-700 text-white rounded-md hover:bg-gray-600 dark:hover:bg-gray-800"
          >
            Clear Data
          </button>
        </div>
        <div>
          {Array.from(
            { length: Math.ceil(filteredBookingList.length / itemsPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-4 p-2 rounded ${
                  currentPage === index + 1
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DaftarBooking;
