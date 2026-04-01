"use client";

const JumbotronComponent = () => {
  return (
    <div className="gambar bg-cover bg-center bg-loaded">
      <div className="h-768 flex items-center justify-center bg-black bg-opacity-65 backdrop-blur-sm">
        <div className="container px-16 text-white text-center items-center justify-center">
          <h1 className="text-4xl md:text-6xl mb-6 text-shadow-lg leading-tight font-jumbo">
            Villa <span className="text-red-500">Tiara</span>
            <br />
            Sarangan
          </h1>
          <p className="text-md md:text-xl mb-12 max-w-lg mx-auto text-shadow-md">
            Nikmati pengalaman menginap di villa terbaik di Sarangan dengan
            pemandangan Telaga Sarangan yang memukau.
          </p>
          <div className="flex justify-center mt-10 ">
            <a
              href="https://wa.me/6281335623403?text=Halo%2C%20Saya%20ingin%20bertanya.%0AApakah%20ada%20kamar%20yang%20tersedia%20dan%20harga%20kamar%20per-malam%20berapa%3F%0A%0ASaya%20dapat%20informasi%20tentang%20Villa%20Tiara%20dari%20Website%2C%20Terima%20kasih."
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 text-white font-bold shadow-xl border-4 border-red-500 px-8 py-4 rounded-full hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 hover:border-yellow-700 transition duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center space-x-3"
            >
              <span className="text-xl font-semibold animate-pulse">
                Pesan Sekarang
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JumbotronComponent;
