"use client";

import { useEffect, useRef, useState } from "react";

const words = ["WORK.", "MATTER.", "MOVE.", "SCALE.", "CONNECT."];

export function HeroRotator() {
  const [index, setIndex] = useState(0);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    visualRef.current?.style.setProperty("--rx", `${-y * 8}deg`);
    visualRef.current?.style.setProperty("--ry", `${x * 10}deg`);
  }

  function resetTilt() {
    visualRef.current?.style.setProperty("--rx", "0deg");
    visualRef.current?.style.setProperty("--ry", "0deg");
  }

  return (
    <div
      ref={visualRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      className="hero-depth relative"
      aria-label={`I build digital things that ${words[index].toLowerCase()}`}
    >
      <div className="hero-orbit hero-orbit-a" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-b" aria-hidden="true" />
      <h1 className="relative z-10 text-[clamp(3.6rem,10vw,8.6rem)] font-semibold leading-[0.84] tracking-[-0.075em]">
        <span className="block">I BUILD DIGITAL</span>
        <span className="block">THINGS THAT</span>
        <span className="hero-word-wrap mt-2 block overflow-hidden">
          <span key={words[index]} className="hero-word block">
            {words[index]}
          </span>
        </span>
      </h1>
    </div>
  );
}
