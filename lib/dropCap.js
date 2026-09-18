// Wraps the very first letter of a block of marked-rendered HTML in a
// floated drop-cap span — the exact same classes as the hand-placed
// drop cap on the About page, so it reads as the same treatment. The
// span floats left with its own right margin, so the paragraph text
// wraps around it instead of overlapping it.
export function withDropCap(html) {
  const pIndex = html.indexOf("<p>");
  if (pIndex === -1) return html;

  const contentStart = pIndex + 3;
  const firstChar = html[contentStart];
  if (!firstChar || !/[A-Za-z]/.test(firstChar)) return html;

  const dropCapSpan = `<span class="float-left -ml-3 mr-4 -mt-1 font-serif italic text-7xl leading-[0.7] text-ink sm:text-8xl">${firstChar}</span>`;

  return (
    html.slice(0, contentStart) + dropCapSpan + html.slice(contentStart + 1)
  );
}
