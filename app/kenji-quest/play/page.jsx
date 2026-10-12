import QuestIntro from "@/components/kenji-game/QuestIntro";

export const metadata = {
  title: "Kenji's Quest: First Light — Play",
  description:
    "The opening of Kenji's Quest: First Light — a cinematic threshold into the Kuroshio Reach, and the first sacred stage, The Inheritance.",
};

// Let the game run edge to edge under a notch when a phone is held sideways.
export const viewport = {
  viewportFit: "cover",
  themeColor: "#0a0d0f",
};

export default function KenjiQuestPlayPage() {
  return <QuestIntro />;
}
