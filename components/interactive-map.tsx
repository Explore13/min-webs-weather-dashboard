"use client";

import dynamic from "next/dynamic";

export const InteractiveMap = dynamic(
  () => import("./interactive-map-core").then((mod) => mod.InteractiveMapCore),
  { ssr: false }
);
