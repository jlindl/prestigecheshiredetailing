"use client";
import { useEffect, useState, type ComponentType } from "react";

// Shows the review layer only on links with ?feedback (it stays on for the rest of the visit).
export default function FeedbackGate() {
  const [C, setC] = useState<ComponentType | null>(null);
  useEffect(() => {
    let on = false;
    try {
      const q = new URLSearchParams(window.location.search);
      if (q.has("feedback")) sessionStorage.setItem("fb-on", "1");
      if (q.get("feedback") === "off") sessionStorage.removeItem("fb-on");
      on = sessionStorage.getItem("fb-on") === "1";
    } catch {
      on = new URLSearchParams(window.location.search).has("feedback");
    }
    if (on) import("./Feedback").then((m) => setC(() => m.default));
  }, []);
  return C ? <C /> : null;
}
