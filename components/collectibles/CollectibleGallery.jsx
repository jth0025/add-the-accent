import Link from "next/link";
import { COLLECTIBLES } from "@/lib/collectibles";
import "./collectible-gallery.css";

const BOX = "/collectibles/box";

// The Journal page's gallery. Each figure stands in its own gold display
// box. The box is dim until hovered or focused, when a light comes on inside
// it. Clicking (or tapping) a box opens that figure's collector's card; there
// are no pop-ups here. The name is engraved on the box's bottom panel, and
// the ATA plus is printed in its right corner.
export default function CollectibleGallery() {
  return (
    <ul className="cg-grid" aria-label="The collectibles">
      {COLLECTIBLES.map((item) => (
        <li key={item.id} className="cg-item">
          <Link
            href={`/journal/collectibles/${item.id}`}
            className="cg-box"
            aria-label={`${item.identity}, collectible ${item.number}. Open the collector’s card.`}
          >
            <span
              className="cg-frame"
              style={{
                "--s": item.scale,
                "--x": `${item.x}%`,
                "--y": `${item.y}%`,
                "--turn": `${item.turn}deg`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cg-back" src={`${BOX}/box-back.webp`} alt="" width="640" height="896" draggable="false" />
              {/* The inside is dim until the light comes on. */}
              <span className="cg-dim" aria-hidden="true" />
              <span className="cg-stage">
                <span className="cg-floor" aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="cg-fig"
                  src={`/collectibles/figures/${item.figure}.webp`}
                  alt={item.alt}
                  loading="lazy"
                  draggable="false"
                />
              </span>
              <span className="cg-lamp" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cg-glass" src={`${BOX}/box-glass.webp`} alt="" width="640" height="896" draggable="false" />
              {/* Engraved on the bottom panel of the box, and the ATA plus. */}
              <span className="cg-engrave" aria-hidden="true">
                <b>{item.identity}</b>
                <i>No. {item.number}</i>
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cg-mark" src="/journal-art/plus-orange.webp" alt="" aria-hidden="true" draggable="false" />
            </span>
            <span className="cg-ground" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
