import React from "react";
import { notFound } from "next/navigation";
import ArtikelDetailComponent from "@/app/components/(User)/(Artikel)/ArtikelDetail";
import { getArticleBySlugOrId, getRecentArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = getArticleBySlugOrId(id);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan - Villa Tiara Sarangan",
    };
  }

  return {
    title: `${article.title} - Villa Tiara Sarangan`,
    description: article.title,
  };
}

export default async function ArtikelDetailPage({ params }) {
  const { id } = await params;
  const article = getArticleBySlugOrId(id);

  if (!article) {
    notFound();
  }

  const recentArticles = getRecentArticles(4).filter(
    (item) => item.slug !== article.slug && String(item.id) !== String(article.id)
  );

  return (
    <ArtikelDetailComponent
      article={article}
      recentArticles={recentArticles}
    />
  );
}
