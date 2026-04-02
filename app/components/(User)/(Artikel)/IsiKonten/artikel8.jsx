import React from "react";
import Image from "next/image";
import telaga from "@/public/imgArtikel/Pondok.jpg";

const Artikel8 = () => {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">
        Panti Asuhan Al Amanah memilih Villa Tiara ketika wisata ke Sarangan
      </h1>

      {/* <Image
        src={telaga}
        alt="Suasana Lebaran di Telaga Sarangan"
        className="rounded-xl mb-4"
        placeholder="blur"
      /> */}

      <p>
        Pada hari Sabtu, tanggal 28 Maret 2026, Villa Tiara menerima tamu yang
        istimewa. Mengapa istimewa ? Karena tamu kita berasal dari Panti Asuhan
        Al Amanah, Krian, Sidoarjo dan telah melakukan survei ke berbagai hotel
        di Sarangan, dan ternyata pilihannya adalah Villa Tiara. Apa alasan
        memilih Villa Tiara ? Menurut pengasuh PA Al Amanah, Dra. Hj. Tatik
        Sudarwati, Villa Tiara adalah hotel yang fasilitasnya sangat bagus
        dengan harga yang sangat terjangkau. Menurut beliau, kamarnya bersih dan
        luas, kamar mandinya mewah, memiliki ruang pertemuan yang memadai untuk
        melakukan rapat atau kegiatan lainnya. Saat menginap di Villa Tiara, di
        Ruang Pertemuan, malam harinya mengadakan kegiatan Istighosah
        dilanjutkan dengan permainan game dan doorprize. 
      </p>
      <br/>
      <p>
      Dengan membawa anak-anak panti sebanyak 40 personil, malam itu terasa sangat berkesan
        bagi anak-anak panti yang tidak pernah mendapatkan belaian orang tua
        tersebut. Mereka terlihat gembira dan bahagia bersama teman-temannya.
        Pada kesempatan itu Pengasuh PA Al Amanah menyampaikan akan
        merekomendasikan kepada handai taulan dan pihak lain untuk menginap di
        Villa Tiara apabila mengunjungi Sarangan. Semoga PA Al Amanah selalu
        diberikan keberkahan dan kebahagiaan bagi anak-anak asuhannya. (FRS)
      </p>
      <br />
      <br />
      <h2 className="text-xl font-semibold">
        Segera Rencanakan Liburan Anda ke Sarangan!
      </h2>
      <br />
      <p>
        Jika Anda merindukan suasana libur yang meriah namun tetap nyaman,
        Telaga Sarangan dan Villa Tiara Sarangan adalah pilihan tepat. Info
        lengkap dan reservasi kunjungi:{" "}
        <a
          href="https://www.villatiarasarangan.com"
          className="text-blue-600 underline"
        >
          www.villatiarasarangan.com
        </a>
      </p>
    </>
  );
};

export default Artikel8;
