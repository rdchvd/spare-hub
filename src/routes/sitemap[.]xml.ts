import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { listings, categories, getSellers } from "@/lib/listings";
import { routeVisibility } from "@/lib/route-visibility";

const BASE_URL = "";

type Entry = {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
};

function siteEntry(path: string, changefreq: Entry["changefreq"], priority?: string): Entry {
  return { path, changefreq, priority };
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = [
          siteEntry("/", "weekly", "1.0"),
          ...(routeVisibility.backend.productsApiReady && routeVisibility.header.browse
            ? [siteEntry("/browse", "daily", "0.9")]
            : []),
          ...(routeVisibility.sitemap.sell ? [siteEntry("/sell", "weekly", "0.8")] : []),
          ...(routeVisibility.sitemap.about ? [siteEntry("/about", "monthly", "0.5")] : []),
          ...(routeVisibility.sitemap.howItWorks
            ? [siteEntry("/how-it-works", "monthly", "0.6")]
            : []),
          ...(routeVisibility.sitemap.safety ? [siteEntry("/safety", "monthly", "0.5")] : []),
          ...(routeVisibility.sitemap.help ? [siteEntry("/help", "monthly", "0.5")] : []),
          ...(routeVisibility.sitemap.legal
            ? [
                siteEntry("/legal/terms", "yearly", "0.3"),
                siteEntry("/legal/privacy", "yearly", "0.3"),
                siteEntry("/legal/cookies", "yearly", "0.3"),
              ]
            : []),
          siteEntry("/login", "yearly", "0.3"),
          siteEntry("/register", "yearly", "0.3"),
        ];

        if (routeVisibility.backend.productsApiReady) {
          for (const c of categories) {
            entries.push(siteEntry(`/c/${c.key}`, "daily", "0.7"));
          }
          for (const l of listings) {
            entries.push(siteEntry(`/listings/${l.id}`, "weekly", "0.6"));
          }
          for (const s of getSellers()) {
            entries.push(siteEntry(`/sellers/${s.slug}`, "weekly", "0.5"));
          }
        }

        const urls = entries.map((e) =>
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
