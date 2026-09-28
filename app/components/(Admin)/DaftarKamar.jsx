"use client";

import {
  FaUserCheck,
  FaArrowLeft,
  FaSearch,
  FaEdit,
  FaTimes,
  FaBed,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { DarkModeContext } from "@/app/(contexts)/DarkModeContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const DaftarKamar = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(DarkModeContext);

  const [kamarList, setKamarList] = useState({
    VillaTiara1: [],
    VillaTiara2: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredKamarList, setFilteredKamarList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editingKamar, setEditingKamar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/rooms")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Kamar gagal dimuat.");
        return result;
      })
      .then((rooms) => {
        if (!cancelled) setKamarList(rooms);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const results = [...kamarList.VillaTiara1, ...kamarList.VillaTiara2].filter(
      (kamar) =>
        kamar.kodeKamar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kamar.tipeKamar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kamar.jumlahBedKamar.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredKamarList(results);
  }, [searchTerm, kamarList]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (id) => {
    const kamarToEdit = filteredKamarList.find(
      (kamar) => kamar.kodeKamar === id
    );
    setEditingKamar(kamarToEdit);
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
      const response = await fetch(`/api/admin/rooms/${encodeURIComponent(editingKamar.kodeKamar)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingKamar),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Data kamar gagal diperbarui.");
      const updatedKamarList = Object.fromEntries(
        Object.entries(kamarList).map(([villa, rooms]) => [
          villa,
          rooms.map((room) => room.kodeKamar === editingKamar.kodeKamar ? editingKamar : room),
        ])
      );
      setKamarList(updatedKamarList);
      setEditingKamar(null);
      setIsEditing(false);
      setError("");
      await MySwal.fire({
        title: "Update Berhasil!",
        text: "Data kamar berhasil diperbarui.",
        icon: "success",
        confirmButtonText: "OK",
        background: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
        confirmButtonColor: "#f59e0b",
      });
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  // Fungsi untuk navigasi ke halaman tambah tamu
  const handleAddGuest = () => {
    router.push("/admin/statuskamar");
  };

  // Hitung indeks untuk item yang akan ditampilkan pada halaman saat ini
  const sortedKamarList = [...filteredKamarList].reverse();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedKamarList.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="fixed left-0 top-16 bottom-10 right-0 md:left-64 pt-14 pb-6 md:pt-10 px-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8 flex items-center justify-center">
        <FaBed className="text-yellow-500 mr-2" />
        Daftar Kamar
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
          <FaUserCheck className="mr-2" />
          Cek Status
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
              <th className="px-4 py-2">Kode Kamar</th>
              <th className="px-4 py-2">Tipe</th>
              <th className="px-4 py-2">Jumlah Bed</th>
              <th className="px-4 py-2">Harga</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody id="bookTableBody">
            {currentItems.length > 0 ? (
              currentItems.map((kamar, index) => (
                <tr key={index} className="dark:text-gray-200">
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {kamar.kodeKamar}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {kamar.tipeKamar}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {kamar.jumlahBedKamar}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {kamar.hargaKamar}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-md mx-1"
                      onClick={() => handleEditClick(kamar.kodeKamar)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 dark:text-gray-400">
                  Tidak ada kamar yang terdaftar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex justify-center items-start z-50 p-10 py-24 md:left-64 overflow-auto">
          <div className="md:flex bg-white dark:bg-gray-700 rounded-xl shadow-lg">
            <div className="py-6 px-10 w-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Edit Kamar
              </h3>
              <form className="text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Kode Kamar
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      readOnly
                      value={editingKamar.kodeKamar}
                      onChange={(e) =>
                        setEditingKamar({
                          ...editingKamar,
                          kodeKamar: e.target.value,
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
                      value={editingKamar.tipeKamar}
                      onChange={(e) =>
                        setEditingKamar({
                          ...editingKamar,
                          tipeKamar: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Jumlah Bed
                  </label>
                  <input
                    type="text"
                    value={editingKamar.jumlahBedKamar}
                    onChange={(e) =>
                      setEditingKamar({
                        ...editingKamar,
                        jumlahBedKamar: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Harga Kamar
                  </label>
                  <input
                    type="text"
                    value={editingKamar.hargaKamar}
                    onChange={(e) =>
                      setEditingKamar({
                        ...editingKamar,
                        hargaKamar: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-700 dark:text-gray-200"
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
          {Array.from(
            { length: Math.ceil(filteredKamarList.length / itemsPerPage) },
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

export default DaftarKamar;
