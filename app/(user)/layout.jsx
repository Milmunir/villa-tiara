import NavbarComponent from "@/app/components/(User)/(Beranda)/Navbar";
import FooterComponent from "@/app/components/(User)/Footer";
import DirectWaComponent from "@/app/components/(User)/DirectWa";

export const metadata = {
  title: "Villa Tiara Sarangan",
  description: "Villa mewah di tepi telaga Sarangan",
};

export default function UserLayout({ children }) {
  return (
    <>
      <NavbarComponent />
      <main>{children}</main>
      <FooterComponent />
      <DirectWaComponent />
    </>
  );
}
