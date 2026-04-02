import React from "react";
import Image from "next/image";
import telaga from "@/public/imgArtikel/telagasa.jpg";

const Artikel6 = () => {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">
        Tembus Belasan Ribu Perhari! Beginilah Suasana Pengunjung Telaga Sarangan di Momen Lebaran
      </h1>

      {/* <Image
        src={telaga}
        alt="Suasana Lebaran di Telaga Sarangan"
        className="rounded-xl mb-4"
        placeholder="blur"
      /> */}

      <p>
        Libur Lebaran selalu jadi waktu yang dinanti-nantikan jutaan masyarakat Indonesia. Setelah berpuasa selama sebulan penuh, 
        momen Idulfitri bukan hanya menjadi ajang silaturahmi, tapi juga saat yang tepat untuk melepas penat bersama keluarga 
        dan orang tercinta. Salah satu destinasi yang paling ramai dikunjungi selama libur Lebaran 2025 ini adalah 
        <strong> Telaga Sarangan</strong>, permata wisata alam di kaki Gunung Lawu, Magetan, Jawa Timur.
      </p>

      <br />
      <h2 className="text-xl font-semibold">Ledakan Pengunjung: 17.000 Wisatawan Per Hari!</h2>
      <br />
      <p>
        Selama masa libur Lebaran, jumlah pengunjung mencapai belasan ribu orang per hari. 
        Berdasarkan laporan dari Disbudpar Magetan, puncaknya terjadi dengan lebih dari 23.000 pengunjung dalam satu hari. 
        Ini menjadi lonjakan luar biasa dibanding hari-hari biasa.
      </p>

      <br />
      <h2 className="text-xl font-semibold">Ramainya Pengunjung di Sekitar Telaga Sarangan</h2>
      <br />
      <p>
        Deretan kendaraan mengular menuju lokasi, area parkir penuh, dan berbagai wahana ramai dikunjungi. 
        Meskipun padat, suasana tetap terasa menyenangkan. Banyak keluarga mengabadikan momen, 
        remaja berswafoto, dan pasangan lansia menikmati udara pegunungan.
      </p>

      <br />
      <h2 className="text-xl font-semibold">UMKM Lokal Ikut Panen Rezeki</h2>
      <br />
      <p>
        Para pelaku UMKM merasakan berkah lonjakan wisatawan. Kuliner seperti sate kelinci dan wedang jahe 
        diburu pengunjung. Sementara kios oleh-oleh diserbu wisatawan yang ingin membawa pulang buah tangan khas Sarangan.
      </p>

      <br />
      <h2 className="text-xl font-semibold">Butuh Tempat Istirahat Nyaman? Ini Rekomendasinya</h2>
      <br />
      <p>
        <strong>Villa Tiara Sarangan</strong> menjadi pilihan ideal untuk menginap. Berlokasi strategis dengan pemandangan indah, 
        villa ini menawarkan kenyamanan dan ketenangan, dilengkapi fasilitas modern, dapur pribadi, area bersantai, 
        dan pelayanan ramah.
      </p>

      <br />
      <h2 className="text-xl font-semibold">Segera Rencanakan Liburan Anda ke Sarangan!</h2>
      <br />
      <p>
        Jika Anda merindukan suasana libur yang meriah namun tetap nyaman, 
        Telaga Sarangan dan Villa Tiara Sarangan adalah pilihan tepat. 
        Info lengkap dan reservasi kunjungi:{" "}
        <a href="https://www.villatiarasarangan.com" className="text-blue-600 underline">
          www.villatiarasarangan.com
        </a>
      </p>
    </>
  );
};

export default Artikel6;
