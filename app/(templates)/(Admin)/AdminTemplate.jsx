"use client";

import React, { useState } from "react";
import SidebarAdmin from "@/app/components/(Admin)/SidebarAdmin";
import FooterAdmin from "@/app/components/(Admin)/FooterAdmin";
import NavbarAdmin from "@/app/components/(Admin)/NavbarAdmin";
import { DarkModeProvider } from "@/app/(contexts)/DarkModeContext";
import { FullScreenProvider } from "@/app/(contexts)/FullScreenContext";

const AdminTemplate = ({ children, currentUser }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <DarkModeProvider>
      <FullScreenProvider>
        <div className="flex h-screen overflow-hidden relative">
          <SidebarAdmin
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            currentUser={currentUser}
          />
          <div className="flex flex-col flex-1">
            <NavbarAdmin
              onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
            />
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 px-8 md:ml-64 pb-12">
              <div id="content" className="pt-6 md:pt-16 overflow-y-auto">
                {children}
              </div>
            </div>
            <FooterAdmin />
          </div>
        </div>
      </FullScreenProvider>
    </DarkModeProvider>
  );
};

export default AdminTemplate;
