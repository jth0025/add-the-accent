import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Reads every markdown file in content/<section> and returns them,
 * newest first, with frontmatter parsed and the body converted to HTML.
 *
 * To add a new piece: drop a new .md file in content/portfolio or
 * content/journal. The filename (minus .md) becomes the URL slug.
 */
export function getAllEntries(section) {
  const dir = path.join(CONTENT_DIR, section);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const entries = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, filename), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date || null,
      excerpt: data.excerpt || "",
      draft: Boolean(data.draft),
      content,
    };
  });

  return entries
    .filter((e) => !e.draft)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

export function getEntry(section, slug) {
  const filePath = path.join(CONTENT_DIR, section, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    date: data.date || null,
    excerpt: data.excerpt || "",
    html: marked.parse(content),
  };
}

export function getAllSlugs(section) {
  const dir = path.join(CONTENT_DIR, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
