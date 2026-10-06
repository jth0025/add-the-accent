/**
 * A piece's title as it appears in captions and on placards: the title,
 * then its running number when the title is repeated (styled like the
 * N° numbering under the images), then an optional subtitle after a
 * divider, in a thinner face.
 */
export default function CaptionTitle({ c, numberClass = "", subtitleClass = "" }) {
  return (
    <>
      {c.title}
      {c.number && (
        <span
          className={`ml-1.5 font-mono font-semibold uppercase not-italic tracking-[0.14em] ${numberClass}`}
        >
          N&deg; {c.number}
        </span>
      )}
      {c.subtitle && (
        <>
          <span aria-hidden="true" className="mx-1.5 font-normal not-italic opacity-40">
            |
          </span>
          <span className={`font-serif font-light not-italic ${subtitleClass}`}>
            {c.subtitle}
          </span>
          {c.subtitleNumber && (
            <span
              className={`ml-1.5 font-mono font-semibold uppercase not-italic tracking-[0.14em] ${numberClass}`}
            >
              N&deg; {c.subtitleNumber}
            </span>
          )}
        </>
      )}
    </>
  );
}
