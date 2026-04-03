"use client";

import { useEffect, useRef } from "react";
import * as fabric from "fabric";

export default function Whiteboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create canvas element imperatively — React never owns it
    const canvasEl = document.createElement("canvas");
    containerRef.current.appendChild(canvasEl);

    const fc = new fabric.Canvas(canvasEl, {
      height: 500,
      width: 500,
      backgroundColor: "white",
    });
    fabricRef.current = fc;

    const rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      fill: "red",
    });
    fc.add(rect);

    return () => {
      fc.dispose(); // fabric owns the canvas; React owns the div
    };
  }, []);

  return <div ref={containerRef} />;
}
