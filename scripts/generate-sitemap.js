import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://jacques-photographer.vercel.app";
const API_URL = process.env.VITE_API_URL || "http://localhost:5000";

const staticPages = [
  { loc: "/", priority: 1.0, changefreq: "weekly" },
  { loc: "/work", priority: 0.9, changefreq: "weekly" },
  { loc: "/about", priority: 0.7, changefreq: "monthly" },
  { loc: "/services", priority: 0.8, changefreq: "monthly" },
  { loc: "/contact", priority: 0.6, changefreq: "monthly" },
];

async function fetchPublishedEvents() {
  try {
    const res = await fetch(`${API_URL}/api/events?status=published&limit=200`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const events = await res.json();
    return Array.isArray(events) ? events : [];
  } catch (err) {
    console.warn("Could not fetch events for sitemap:", err.message);
    return [];
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function main() {
  const events = await fetchPublishedEvents();

  const urls = [];

  for (const page of staticPages) {
    urls.push(`  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`);
  }

  for (const event of events) {
    const lastmod = event.updatedAt
      ? new Date(event.updatedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    urls.push(`  <url>
    <loc>${SITE_URL}/event/${event._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  const outPath = resolve(__dirname, "..", "public", "sitemap.xml");
  writeFileSync(outPath, sitemap, "utf-8");
  console.log(`Sitemap generated at ${outPath} (${urls.length} URLs)`);
}

main();
