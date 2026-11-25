import { Suspense } from "react";
import Chat from "../../components/Chat";

export const metadata = { title: "Tutor — BSA AI Tutor" };

export default function TutorPage() {
  return (
    <main className="container tutor">
      <Suspense fallback={<p className="muted">Loading tutor…</p>}>
        <Chat />
      </Suspense>
    </main>
  );
}
