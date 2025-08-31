import { Suspense } from "react";
import AdvocatesPage from "./AdvocatesPage";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdvocatesPage />
    </Suspense>
  );
}
