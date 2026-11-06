// Where a speech or thought box sits when it belongs beside a face in the
// picture behind the talk (Day Three, once Kenji reaches the naming tree).
//
// Everything is in screen pixels. `face` is the speaker's face as
// [x0, y0, x1, y1]; `avoid` is every face on screen (the speaker's own
// included), none of which the box may cover. `measure(width)` returns how
// tall the box is at that width. The box goes beside the face on the
// speaker's own side when there is room, then on the other side, then below
// the face, then above it. If nothing fits it returns null and the box
// keeps its usual place at the bottom.
//
// The result depends only on the screen and the picture, never on the
// previous line, so a box lands in its place once and does not travel.

const EDGE = 20; // clear of the screen edge (the scroll rollers stick out a little)
const GAP = 22; // between the box and the face
const PAD = 8; // breathing room round every face
const MIN_SIDE = 250; // narrowest a box may be squeezed to sit beside a face
const MAX_W = 460;

const hits = (r, a) => !(r[2] <= a[0] - PAD || r[0] >= a[2] + PAD || r[3] <= a[1] - PAD || r[1] >= a[3] + PAD);
const inside = (r, W, H) => r[0] >= EDGE - 1 && r[1] >= EDGE - 1 && r[2] <= W - EDGE + 1 && r[3] <= H - EDGE + 1;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function placeBox({ W, H, face, avoid, measure, prefer = "r" }) {
  const maxW = Math.min(MAX_W, W - 2 * EDGE);
  const cx = (face[0] + face[2]) / 2;
  const cy = (face[1] + face[3]) / 2;
  const ok = (r) => inside(r, W, H) && !avoid.some((a) => hits(r, a));
  const out = (left, top, w, h, dir) => ({
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(w),
    height: Math.round(h),
    dir,
    // where, along the box's edge, the face is (for the thought-bubble dots)
    at: Math.round(clamp(dir === "r" || dir === "l" ? cy - top : cx - left, 24, (dir === "r" || dir === "l" ? h : w) - 24)),
  });

  const order = prefer === "l" ? ["l", "r", "b", "a"] : ["r", "l", "b", "a"];
  for (const dir of order) {
    if (dir === "r" || dir === "l") {
      const room = dir === "r" ? W - EDGE - (face[2] + GAP) : face[0] - GAP - EDGE;
      const w = Math.min(maxW, room);
      if (w < MIN_SIDE) continue;
      const h = measure(w);
      const left = dir === "r" ? face[2] + GAP : face[0] - GAP - w;
      // the top edge stays where it is for the speaker; a longer line grows downward
      const top = clamp(cy - 64, EDGE, H - EDGE - h);
      const r = [left, top, left + w, top + h];
      if (ok(r)) return out(left, top, w, h, dir);
    } else {
      // full width first, then narrower, so the box can slip past a second face
      for (const w of [maxW, 330, 290, 250].filter((x, k) => x <= maxW || k === 0)) {
        const h = measure(w);
        const top = dir === "b" ? face[3] + GAP : face[1] - GAP - h;
        if (top < EDGE - 1 || top + h > H - EDGE + 1) continue;
        // centred on the face first, then pushed to either edge
        for (const left of [clamp(cx - w / 2, EDGE, W - EDGE - w), EDGE, W - EDGE - w]) {
          const r = [left, top, left + w, top + h];
          if (ok(r)) return out(left, top, w, h, dir);
        }
      }
    }
  }
  return null;
}
