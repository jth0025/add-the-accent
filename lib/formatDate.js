// Pure, client-safe date formatting — split out of lib/content.js (which
// pulls in fs/path/gray-matter and can't be bundled for the browser) so
// components rendered from client components can still format dates
// without dragging that server-only module along with them.
export function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
