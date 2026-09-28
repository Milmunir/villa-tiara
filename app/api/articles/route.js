import { NextResponse } from "next/server";
import { getAllArticles, getRecentArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    if (limit) {
      const count = parseInt(limit, 10);
      const articles = getRecentArticles(isNaN(count) ? 4 : count);
      return NextResponse.json(articles);
    }

    const articles = getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error in /api/articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
