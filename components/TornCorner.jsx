/**
 * A small folded-down corner accent — the dog-eared page corner from
 * the paper reference — dropped on top of a `.torn-frame` box. Sits at
 * the box's literal top-right corner, which the torn-frame clip-path
 * deliberately leaves intact so this doesn't get clipped away with it.
 */
export default function TornCorner() {
  return <span aria-hidden="true" className="paper-fold-corner" />;
}
