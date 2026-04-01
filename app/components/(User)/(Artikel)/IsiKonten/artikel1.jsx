import React from "react";
import Image from "next/image";
import perahu from "@/public/imgArtikel/perahu.jpg";

const Artikel1 = () => {
  return (
    <>
      <p>
        Telaga Sarangan, atau yang juga dikenal sebagai Danau Telaga Sarangan,
        adalah salah satu destinasi wisata unggulan di Magetan, Jawa Timur.
        Terletak di kaki Gunung Lawu, danau ini menawarkan keindahan alam yang
        luar biasa dengan udara sejuk yang membuat siapa saja betah berlama-lama
        di sana. Bagi Anda yang mencari tempat liburan yang tenang, segar, dan
        cocok untuk seluruh keluarga, Telaga Sarangan adalah pilihan yang
        sempurna. Yuk, simak lebih lanjut apa saja yang bisa Anda nikmati di
        wisata Telaga Sarangan!
      </p>
      <br />
      <h2 className="text-xl">
        <strong>Pesona Alam yang Menawan</strong>
      </h2>
      <br />
      <p>
        Wisata Telaga Sarangan memiliki daya tarik utama berupa danau alami
        seluas 30 hektar dengan kedalaman sekitar 28 meter. Airnya yang jernih
        dan pemandangan pegunungan hijau di sekitarnya menciptakan suasana yang
        tenang dan damai. Suhu udara di kawasan ini berkisar antara 15-20
        derajat Celsius, menjadikannya tempat yang sempurna untuk melarikan diri
        dari hiruk-pikuk kota.
      </p>
      <br />
      <p>
        Anda dapat menikmati keindahan danau ini sambil berjalan-jalan santai di
        tepiannya. Jangan lupa membawa kamera, karena setiap sudut Telaga
        Sarangan sangat Instagramable!
      </p>
      <br />
      <h2 className="text-xl">
        <strong>Aktivitas Seru di Wisata Telaga Sarangan</strong>
      </h2>
      <br />
      <Image
        src={perahu}
        alt="Wisata Telaga Sarangan"
        className="rounded-xl mt-4"
      />
      <br />
      <ul>
        <li>
          <strong>1. Naik Perahu Motor:</strong> Salah satu cara terbaik
          menikmati keindahan Telaga Sarangan adalah dengan menyewa perahu
          motor. Anda bisa mengelilingi danau sambil merasakan hembusan angin
          sejuk yang menyegarkan. Harga sewa perahu motor cukup terjangkau,
          mulai dari Rp 50.000 untuk satu putaran.
        </li>
        <li>
          <strong>2. Berkuda di Sekitar Danau:</strong> Ingin pengalaman
          berbeda? Cobalah naik kuda dan menjelajahi area di sekitar Telaga
          Sarangan. Aktivitas ini cocok untuk anak-anak maupun orang dewasa,
          memberikan sensasi liburan yang unik dan menyenangkan.
        </li>
        <li>
          <strong>3. Wisata Kuliner Lokal:</strong> Jangan lewatkan menikmati
          makanan khas Magetan di sekitar danau. Anda bisa mencicipi sate
          kelinci, nasi pecel, atau jajanan pasar lainnya. Suasana makan di tepi
          danau dengan udara sejuk tentu memberikan pengalaman kuliner yang
          berbeda.
        </li>
        <li>
          <strong>4. Belanja Oleh-Oleh:</strong> Pasar Sarangan yang berada di
          dekat danau adalah surga bagi para pemburu oleh-oleh. Anda bisa
          membeli berbagai macam produk lokal, seperti kerajinan tangan, makanan
          ringan, hingga cinderamata untuk keluarga dan teman.
        </li>
      </ul>
      <br />
      <h2 className="text-xl">
        <strong>Tiket Telaga Sarangan dan Informasi Penting</strong>
      </h2>
      <br />
      <p>
        Harga tiket masuk Telaga Sarangan sangat terjangkau, hanya sekitar Rp
        20.000 per orang untuk dewasa dan Rp 10.000 untuk anak-anak. Parkir
        kendaraan juga tersedia dengan biaya mulai dari Rp 5.000. Area ini buka
        setiap hari mulai pukul 07.00 hingga 17.00, sehingga Anda memiliki
        banyak waktu untuk menikmati semua yang ditawarkan Telaga Sarangan.
      </p>
      <br />
      <h2 className="text-xl">
        <strong>Villa Nyaman di Dekat Telaga Sarangan</strong>
      </h2>
      <br />
      <p>
        Setelah puas menikmati keindahan wisata Sarangan, pastikan Anda memilih
        penginapan yang nyaman untuk beristirahat. Salah satu pilihan terbaik
        adalah
        <a href="/Beranda" className="pointer">
          <b> Villa Tiara Sarangan. </b>
        </a>
        Berlokasi strategis di dekat Telaga Sarangan, villa ini menawarkan
        fasilitas lengkap dan pemandangan menakjubkan dari kamar Anda.
        <a href="/Beranda" className="pointer">
          <b> Villa Tiara Sarangan </b>
        </a>
        juga cocok untuk Anda yang datang bersama keluarga atau rombongan.
      </p>
      <br />
      <h2 className="text-xl">
        <strong>Kesimpulan</strong>
      </h2>
      <br />
      <p>
        Telaga Sarangan adalah destinasi wisata yang wajib Anda kunjungi saat
        berada di Jawa Timur. Dari keindahan alamnya, aktivitas seru yang
        ditawarkan, hingga kuliner khas yang menggoda, semuanya akan membuat
        liburan Anda berkesan. Dengan tiket Telaga Sarangan yang terjangkau dan
        berbagai pilihan penginapan seperti
        <a href="/Beranda" className="pointer">
          <b> Villa Tiara Sarangan, </b>
        </a>
        Anda dapat menikmati pengalaman liburan yang sempurna. Jadi, tunggu apa
        lagi? Jadikan Telaga Sarangan sebagai tujuan liburan Anda berikutnya dan
        jangan lupa untuk menginap di
        <a href="/Beranda" className="pointer">
          <b> Villa Tiara Sarangan!</b>
        </a>
      </p>
    </>
  );
};

export default Artikel1;
