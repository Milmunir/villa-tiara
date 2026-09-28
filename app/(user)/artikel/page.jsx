import React from "react";
import ArtikelAllComponent from "@/app/components/(User)/(Artikel)/ArtikelAll";
import { getAllArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Artikel - Villa Tiara Sarangan",
  description: "Informasi dan berita seputar Telaga Sarangan dan Villa Tiara",
};

export default function ArtikelPage() {
  const articles = getAllArticles();
  return <ArtikelAllComponent initialArticles={articles} />;
}
