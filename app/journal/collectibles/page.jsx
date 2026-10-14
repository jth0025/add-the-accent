import { redirect } from "next/navigation";

// There's no index of cards: the collection lives on the Journal page.
export default function CollectiblesIndex() {
  redirect("/journal#collectibles");
}
