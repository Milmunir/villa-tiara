"use client";

import {
  FaFileExcel,
  FaBookOpen,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

const DaftarRiwayat = () => {
  const [riwayatList, setRiwayatList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRiwayatList, setFilteredRiwayatList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/api/admin/bookings?status=CHECKED_OUT")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Riwayat gagal dimuat.");
        setRiwayatList(result);
        setFilteredRiwayatList(result);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const results = riwayatList.filter(
      (riwayat) =>
        riwayat.namaTamu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        riwayat.idKamar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        riwayat.noTelepon.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRiwayatList(results);
  }, [searchTerm, riwayatList]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const exportToExcel = async () => {
    try {
      setIsExporting(true);
      const [{ default: ExcelJS }, { saveAs }] = await Promise.all([
        import("exceljs"),
        import("file-saver"),
      ]);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Riwayat Reservasi");

      // Header Data
      const headers = [
        "No",
        "ID Kamar",
        "Nama Tamu",
        "No Telepon",
        "Check-In",
        "Check-Out",
        "Total Harga",
      ];
      worksheet.addRow(headers);

      // Style Header
      headers.forEach((_, index) => {
        const cell = worksheet.getRow(1).getCell(index + 1);
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF0000" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Add Data
      const rows = riwayatList.map((riwayat, index) => [
        index + 1,
        riwayat.idKamar,
        riwayat.namaTamu,
        riwayat.noTelepon,
        new Date(riwayat.tanggalCheckIn).toLocaleDateString("id-ID", {
          timeZone: "Asia/Jakarta",
        }),
        new Date(riwayat.tanggalCheckOut).toLocaleDateString("id-ID", {
          timeZone: "Asia/Jakarta",
        }),
        `Rp. ${riwayat.harga.toLocaleString()}`,
      ]);

      rows.forEach((row) => worksheet.addRow(row));

      // Atur Lebar Kolom Otomatis
      const allData = [headers, ...rows];
      worksheet.columns.forEach((column, index) => {
        const maxLength = Math.max(
          ...allData.map((row) => (row[index] ? row[index].toString().length : 0))
        );
        column.width = maxLength + 2; // Tambahkan margin
      });

      // Style Konten
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          if (rowNumber > 1) {
            cell.alignment = { vertical: "center", horizontal: "left" };
          }
        });
      });

      // Simpan File
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "Riwayat_Reservasi.xlsx");
    } catch (exportError) {
      console.error("Gagal mengekspor data Excel:", exportError);
    } finally {
      setIsExporting(false);
    }
  };

  // Hitung indeks untuk item yang akan ditampilkan pada halaman saat ini
  const sortedRiwayatList = [...filteredRiwayatList].reverse();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedRiwayatList.slice(
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
        <FaBookOpen className="text-yellow-500 mr-2" />
        Daftar Riwayat
      </h2>

      <div className="mt-6 flex justify-between items-center text-sm mb-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center text-md font-semibold text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition"
        >
          <FaArrowLeft className="text-yellow-500 mr-2" />
          Kembali
        </Link>
        <button
          onClick={exportToExcel}
          disabled={isExporting}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg shadow-sm flex items-center transition"
        >
          <FaFileExcel className="mr-2" />
          {isExporting ? "Mengekspor..." : "Ekspor Excel"}
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

      {/* Tabel Reservasi */}
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
            </tr>
          </thead>
          <tbody id="riwayatTableBody">
            {currentItems.length > 0 ? (
              currentItems.map((riwayat, index) => (
                <tr key={index} className="dark:text-gray-200">
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {riwayat.idKamar}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {riwayat.namaTamu}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {riwayat.noTelepon}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {riwayat.tanggalCheckIn}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {riwayat.tanggalCheckOut}
                  </td>
                  <td className="border px-4 py-2 dark:border-gray-700">
                    {riwayat.harga}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 dark:text-gray-400">
                  Tidak ada riwayat yang terdaftar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between my-6 mb-20">
        <div>
          {Array.from(
            { length: Math.ceil(filteredRiwayatList.length / itemsPerPage) },
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

export default DaftarRiwayat;
