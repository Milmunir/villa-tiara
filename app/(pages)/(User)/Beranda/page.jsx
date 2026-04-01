"use client";
import React, { useEffect, useState, useRef } from "react";
import UserTemplate from "@/app/(templates)/(User)/UserTemplate";
import dynamic from "next/dynamic";

const componentsBeranda = [
  {
    id: "jumbotron",
    component: dynamic(() =>
      import("@/app/components/(User)/(Beranda)/Jumbotron")
    ),
  },
  {
    id: "highlight",
    component: dynamic(() =>
      import("@/app/components/(User)/(Beranda)/Highlights")
    ),
  },
  {
    id: "tentang",
    component: dynamic(() =>
      import("@/app/components/(User)/(Beranda)/Tentang")
    ),
  },
  {
    id: "tipe-kamar",
    component: dynamic(() =>
      import("@/app/components/(User)/(Beranda)/TipeKamar")
    ),
  },
  {
    id: "fasilitas",
    component: dynamic(() =>
      import("@/app/components/(User)/(Beranda)/Fasilitas")
    ),
  },
  {
    id: "testimoni",
    component: dynamic(() =>
      import("@/app/components/(User)/(Beranda)/Testimoni")
    ),
  },
  {
    id: "galeri",
    component: dynamic(() =>
      import("@/app/components/(User)/(Beranda)/Galeri")
    ),
  },
  {
    id: "artikel",
    component: dynamic(() =>
      import("@/app/components/(User)/(Beranda)/Artikel")
    ),
  },
  {
    id: "faq",
    component: dynamic(() => import("@/app/components/(User)/(Beranda)/Faq")),
  },
];

const BerandaPage = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const observer = useRef();

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".fade-in, .fade-out");
    elements.forEach((el) => observer.current.observe(el));

    return () => observer.current.disconnect();
  }, []);

  return (
    <UserTemplate>
      {componentsBeranda.map(({ id, component: Component }) => {
        const isJumbotron = id === "jumbotron";
        const className = isJumbotron
          ? `fade-out ${visibleSections[id] ? "fade-out-visible" : ""}`
          : `fade-in ${visibleSections[id] ? "fade-in-visible" : ""}`;

        return (
          <div
            key={id}
            id={id}
            className={className}
            aria-label={`Section ${id}`}
          >
            <Component />
          </div>
        );
      })}
    </UserTemplate>
  );
};

export default BerandaPage;
