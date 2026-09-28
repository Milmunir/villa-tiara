import { DarkModeProvider } from "@/app/(contexts)/DarkModeContext";
import { FullScreenProvider } from "@/app/(contexts)/FullScreenContext";

export const metadata = {
  title: "Admin - Villa Tiara Sarangan",
};

export default function AdminRootLayout({ children }) {
  return (
    <DarkModeProvider>
      <FullScreenProvider>{children}</FullScreenProvider>
    </DarkModeProvider>
  );
}
