import React from "react";
import Image from "next/image";
import geprek from "@/public/imgArtikel/geprek.webp";

const Artikel4 = () => {
  return (
    <>
      <p>
        Merencanakan kegiatan outing kantor atau perusahaan memerlukan tempat
        yang tidak hanya nyaman tetapi juga mendukung suasana kebersamaan.
        <a href="/Beranda" className="pointer">
          <b> Villa Tiara Sarangan </b>
        </a>
        hadir sebagai pilihan yang sempurna untuk outing kantor, outing
        karyawan, maupun outing perusahaan. Dengan lokasi strategis di dekat
        Telaga Sarangan, villa ini menawarkan suasana asri dan fasilitas lengkap
        untuk mendukung segala kebutuhan kegiatan outing Anda.
      </p>
      <br />
      <h2 className="text-xl">
        <strong>Mengapa Villa Tiara Sarangan Cocok untuk Outing Kantor?</strong>
      </h2>
      <br />
      <ul>
        <li>
          <strong>1. Lokasi Strategis di Sarangan</strong>
          <br /> Terletak hanya beberapa langkah dari Telaga Sarangan, Villa
          Tiara Sarangan memberikan akses mudah ke berbagai destinasi wisata
          seperti Telaga Sarangan, Mojosemi Forest Park, dan Kebun Strawberry
          Sarangan. Anda bisa mengisi waktu dengan berbagai aktivitas outdoor
          yang menyenangkan setelah sesi meeting atau kegiatan kelompok.
        </li>
        <li>
          <br />
          <strong>2. Fasilitas Lengkap untuk Kegiatan Outing</strong>
          <br />
          Villa Tiara Sarangan memiliki fasilitas seperti ruang pertemuan yang
          nyaman, cocok untuk diskusi atau presentasi perusahaan. Tidak hanya
          itu, terdapat juga area rooftop yang luas untuk acara santai bersama,
          dengan pemandangan Telaga Sarangan yang memukau. Setiap kamar
          dilengkapi dengan TV, sofa, meja, karpet, air panas, dan WiFi gratis
          untuk menunjang kenyamanan para peserta.
        </li>
        <li>
          <br />
          <strong>3. Pilihan Kamar untuk Grup Besar</strong>
          <br />
          Untuk outing kantor atau perusahaan, Villa Tiara Sarangan menyediakan
          kamar-kamar yang dirancang khusus untuk grup. Anda dapat memilih tipe
          kamar Deluxe dengan kapasitas lebih besar, dilengkapi balkon dengan
          view Telaga Sarangan yang indah. Kamar lainnya juga cocok untuk
          berbagai kebutuhan, dari tim kecil hingga rombongan besar.
        </li>
        <li>
          <br />
          <strong>4. Makanan dan Minuman di Kafe Tiara dan Geprek Tiara</strong>
          <br />
          <Image
            src={geprek}
            alt="Geprek Tiara Sarangan"
            className="rounded-xl mt-4"
          />
          <br />
          Setelah aktivitas outing yang padat, para peserta outing dapat
          menikmati santapan lezat di Kafe Tiara. Kafe ini menawarkan hidangan
          yang terjangkau dengan suasana hangat dan pemandangan indah sekitar
          Telaga Sarangan. Bagi pecinta makanan pedas, Geprek Tiara hadir dengan
          menu ayam geprek spesial yang menggugah selera dan cocok dinikmati
          bersama tim. Dengan pilihan makanan yang lezat dan lokasi strategis,
          momen kebersamaan akan terasa lebih lengkap di sini.
        </li>
      </ul>
      <br />
      <h2 className="text-xl">
        <strong>Aktivitas Outing yang Bisa Dilakukan di Sarangan</strong>
      </h2>
      <br />
      <ul>
        <li>
          <strong>1. Trekking dan Aktivitas Outdoor</strong>
          <br />
          Sarangan terkenal dengan jalur trekking yang menantang sekaligus
          menyenangkan. Outing karyawan atau perusahaan bisa diisi dengan
          kegiatan berjalan kaki ke Air Terjun Ngadiloyo atau berpetualang di
          Mojosemi Forest Park. Aktivitas ini dapat meningkatkan kebersamaan dan
          semangat tim.
        </li>
        <li>
          <br />
          <strong>2. Wisata dan Kuliner di Telaga Sarangan</strong>
          <br />
          Nikmati waktu santai dengan berkuda di sekitar Telaga Sarangan, naik
          speed boat yang seru, atau mencicipi kuliner khas Sarangan. Pengalaman
          ini akan memberikan kenangan tak terlupakan untuk seluruh tim.
        </li>
        <li>
          <br />
          <strong>3. Petik Strawberry di Kebun Strawberry Sarangan</strong>
          <br />
          Aktivitas petik strawberry menjadi salah satu pilihan menarik untuk
          mengisi outing perusahaan di Sarangan. Selain seru, kegiatan ini juga
          bisa menjadi cara untuk membangun kebersamaan antar karyawan.
        </li>
      </ul>
      <br />
      <h2 className="text-xl">
        <strong>Hubungi Villa Tiara Sarangan untuk Rencana Outing Anda</strong>
      </h2>
      <br />
      <p>
        Villa Tiara Sarangan menawarkan pengalaman menginap yang nyaman dengan
        harga yang ramah kantong. Jika Anda sedang mencari penginapan untuk
        outing kantor di Sarangan, Villa Tiara Sarangan adalah solusi terbaik.
        Untuk informasi lebih lanjut mengenai ketersediaan kamar dan harga, Anda
        dapat menghubungi kami melalui
        <a
          href="https://wa.me/6281335623403"
          target="_blank"
          rel="noreferrer"
          className="pointer"
        >
          <b> WhatsApp Villa Tiara Sarangan.</b>
        </a>
      </p>
      <br />
      <p>
        Nikmati suasana asri, fasilitas lengkap, dan lokasi strategis untuk
        mendukung kesuksesan acara outing kantor, karyawan, maupun perusahaan
        Anda di Sarangan. Villa Tiara Sarangan siap menyambut Anda dengan
        pengalaman yang tak terlupakan!
      </p>
    </>
  );
};

export default Artikel4;
