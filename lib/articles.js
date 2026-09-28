import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "article");

export function getAllArticles() {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticles = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const stat = fs.statSync(fullPath);

      const { data, content } = matter(fileContents);

      const date = data.date || stat.mtime.toISOString().split("T")[0];
      const displayDate =
        data.displayDate ||
        new Date(date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

      return {
        slug,
        id: data.id || slug,
        title: data.title || "Untitled Article",
        date,
        displayDate,
        coverImage: data.coverImage || "/imgArtikel/img1.jpg",
        tags: data.tags || [],
        readmore: data.readmore ? String(data.readmore) : null,
        readmoreTitle: data.readmoreTitle || "",
        content,
      };
    });

  // Sort articles by date descending
  return allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getArticleBySlugOrId(identifier) {
  const articles = getAllArticles();
  if (!identifier) return null;

  const targetStr = String(identifier).trim().toLowerCase();

  return (
    articles.find(
      (art) =>
        art.slug.toLowerCase() === targetStr ||
        String(art.id).toLowerCase() === targetStr
    ) || null
  );
}

export function getRecentArticles(limit = 4) {
  const articles = getAllArticles();
  return articles.slice(0, limit);
}
