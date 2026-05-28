import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { listings, categories, getSellers } from "@/lib/listings";

const BASE_URL = "";

type Entry = {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/browse", changefreq: "daily", priority: "0.9" },
          { path: "/sell", changefreq: "weekly", priority: "0.8" },
          { path: "/about", changefreq: "monthly", priority: "0.5" },
          { path: "/how-it-works", changefreq: "monthly", priority: "0.6" },
          { path: "/safety", changefreq: "monthly", priority: "0.5" },
          { path: "/help", changefreq: "monthly", priority: "0.5" },
          { path: "/legal/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/legal/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/legal/cookies", changefreq: "yearly", priority: "0.3" },
          { path: "/login", changefreq: "yearly", priority: "0.3" },
          { path: "/register", changefreq: "yearly", priority: "0.3" },
        ];

        for (const c of categories) {
          entries.push({ path: `/c/${c.key}`, changefreq: "daily", priority: "0.7" });
        }
        for (const l of listings) {
          entries.push({ path: `/listings/${l.id}`, changefreq: "weekly", priority: "0.6" });
        }
        for (const s of getSellers()) {
          entries.push({ path: `/sellers/${s.slug}`, changefreq: "weekly", priority: "0.5" });
        }

        const urls = entries.map(
          (e) =>
            [
              "  <url>",
              `    <loc>${BASE_URL}${e.path}</loc>`,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              "  </url>",
            ]
              .filter(Boolean)
              .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
