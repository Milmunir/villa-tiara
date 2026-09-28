"use client";
import {
  FaUsers,
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { DarkModeContext } from "@/app/(contexts)/DarkModeContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const DaftarTamu = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(DarkModeContext);
  const [tamuList, setTamuList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTamuList, setFilteredTamuList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/guests")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Data tamu gagal dimuat.");
        setTamuList(result);
        setFilteredTamuList(result);
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  useEffect(() => {
    const results = tamuList.filter(
      (tamu) =>
        tamu.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tamu.noHp.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTamuList(results);
  }, [searchTerm, tamuList]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fungsi untuk menghapus tamu berdasarkan id
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
      const response = await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Data tamu gagal dihapus.");
      const updated = tamuList.filter((tamu) => tamu.id !== id);
      setTamuList(updated);
      setFilteredTamuList(updated);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  // Fungsi untuk clear semua data tamu
  const handleClearData = async () => {
    const confirmation = await MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikan data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? "#f59e0b" : "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus semuanya!",
      cancelButtonText: "Batal",
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    });
    if (!confirmation.isConfirmed) return;
    try {
      const response = await fetch("/api/admin/guests", { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Data tamu gagal dihapus.");
      setTamuList([]);
      setFilteredTamuList([]);
    } catch (clearError) {
      setError(clearError.message);
    }
  };

  // Fungsi untuk navigasi ke halaman tambah tamu
  const handleAddGuest = () => {
    router.push("/admin/tambahtamu");
  };

  // Hitung indeks untuk item yang akan ditampilkan pada halaman saat ini
  const sortedTamuList = [...filteredTamuList].reverse();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTamuList.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="fixed left-0 top-16 bottom-10 right-0 md:left-64 pt-14 pb-6 md:pt-10 px-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8 flex items-center justify-center">
        <FaUsers className="text-yellow-500 mr-2" />
        Daftar Tamu
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
          Tambah Tamu
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Cari Berdasarkan Nama atau No Telepon"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-md shadow-md dark:bg-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition duration-300"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 text-left shadow-lg rounded-lg">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <th className="px-4 py-2">No</th>
              <th className="px-6 py-2">Tanggal</th>
              <th className="px-6 py-2">Nama Tamu</th>
              <th className="px-6 py-2">No WA</th>
              <th className="px-6 py-2">Keperluan</th>
              <th className="px-6 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody id="tamuTableBody">
            {currentItems.length > 0 ? (
              currentItems.map((tamu, index) => (
                <tr key={tamu.id} className="dark:text-gray-200">
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="border px-6 py-2 dark:border-gray-700">
                    {tamu.tanggalWaktu}
                  </td>
                  <td className="border px-6 py-2 dark:border-gray-700">
                    {tamu.namaLengkap}
                  </td>
                  <td className="border px-6 py-2 dark:border-gray-700">
                    {tamu.noHp}
                  </td>
                  <td className="border px-6 py-2 dark:border-gray-700">
                    {tamu.keperluan}
                  </td>
                  <td className="border px-6 py-2 dark:border-gray-700">
                    <button
                      onClick={() => handleDelete(tamu.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 dark:text-gray-400">
                  Tidak ada tamu yang terdaftar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between my-6 mb-20">
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
            { length: Math.ceil(filteredTamuList.length / itemsPerPage) },
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

export default DaftarTamu;
