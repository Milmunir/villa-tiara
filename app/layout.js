import "./globals.css";

export const metadata = {
  title: "Villa Tiara Sarangan",
  description: "Villa mewah di tepi telaga Sarangan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
