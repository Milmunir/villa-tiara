"use client";

import {
  FaCreditCard,
  FaFileInvoice,
  FaArrowLeft,
  FaPrint,
  FaSignOutAlt,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { DarkModeContext } from "@/app/(contexts)/DarkModeContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const DaftarCheckIn = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(DarkModeContext);
  const [checkInList, setCheckInList] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCheckInList, setFilteredCheckInList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/bookings?status=CHECKED_IN")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Check-in gagal dimuat.");
        setCheckInList(result);
        setFilteredCheckInList(result);
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  useEffect(() => {
    const results = checkInList.filter((checkin) =>
      checkin.idKamar.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCheckInList(results);
  }, [searchTerm, checkInList]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fungsi untuk checkIn berdasarkan index
  const handleCheckOutClick = async (id) => {
    const confirmation = await MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Pastikan tamu sudah keluar.",
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
      const response = await fetch(`/api/admin/bookings/${id}/check-out`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Check-out gagal disimpan.");
      router.push("/admin/daftarriwayat");
    } catch (checkOutError) {
      setError(checkOutError.message);
    }
  };

  // Fungsi untuk melihat invoice
  const viewInvoice = (reservation) => {
    setInvoiceData(reservation);
    setShowInvoiceModal(true);
  };

  // Fungsi untuk mencetak invoice
  const printInvoice = () => {
    window.print();
  };

  // Fungsi format Rupiah
  const formatRupiah = (number) => {
    return `Rp${number.toLocaleString("id-ID")}`;
  };

  // Hitung indeks untuk item yang akan ditampilkan pada halaman saat ini
  const sortedCheckInList = [...filteredCheckInList].reverse();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCheckInList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Fungsi untuk mengubah halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="fixed left-0 top-16 bottom-10 right-0 md:left-64 pt-14 pb-6 md:pt-10 px-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8 flex items-center justify-center">
        <FaCreditCard className="text-yellow-500 mr-2" />
        CheckOut Reservasi
      </h2>
      {error && <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">{error}</p>}

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Cari Berdasarkan Nama ID Kamar"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-md shadow-md dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition duration-300"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentItems.length > 0 ? (
            currentItems.map((checkin, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <div className="flex flex-col justify-between h-full">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {checkin.idKamar}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Check-in: {checkin.tanggalCheckIn}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Check-out: {checkin.tanggalCheckOut}
                    </p>
                  </div>
                  <button
                    onClick={() => viewInvoice(checkin)}
                    className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow transition"
                  >
                    <FaFileInvoice className="mr-2" />
                    Lihat Invoice
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 col-span-full text-gray-800 dark:text-gray-200">
              Tidak ada check-in yang terdaftar
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-8">
          <div>
            <Link
              href="/admin/daftarbooking"
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition"
            >
              <FaArrowLeft className="mr-2" />
              Kembali
            </Link>
          </div>
          <div>
            {Array.from(
              { length: Math.ceil(filteredCheckInList.length / itemsPerPage) },
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

      {/* Modal Invoice */}
      {showInvoiceModal && invoiceData && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg max-w-lg w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
              Invoice Reservasi
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">
                  Kode Invoice:
                </span>
                <span className="font-semibold dark:text-gray-100">
                  INV-{invoiceData.idKamar}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">
                  Nama Tamu:
                </span>
                <span className="font-semibold dark:text-gray-100">
                  {invoiceData.namaTamu}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Kamar:</span>
                <span className="font-semibold dark:text-gray-100">
                  {invoiceData.idKamar}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">
                  Check-in:
                </span>
                <span className="font-semibold dark:text-gray-100">
                  {invoiceData.tanggalCheckIn}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">
                  Check-out:
                </span>
                <span className="font-semibold dark:text-gray-100">
                  {invoiceData.tanggalCheckOut}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 dark:border-gray-700">
                <span className="font-bold dark:text-gray-100">
                  Total Biaya:
                </span>
                <span className="font-bold dark:text-gray-100">
                  {formatRupiah(invoiceData.harga)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={printInvoice}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition flex items-center justify-center"
              >
                <FaPrint className="mr-2" />
                Print
              </button>
              <button
                onClick={() => handleCheckOutClick(invoiceData.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition flex items-center justify-center"
              >
                <FaSignOutAlt className="mr-2" /> Check Out
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition flex items-center justify-center"
              >
                <FaTimesCircle className="mr-2" />
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarCheckIn;
