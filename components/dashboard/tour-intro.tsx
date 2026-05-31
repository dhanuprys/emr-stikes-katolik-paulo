"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

interface TourIntroProps {
  onConfirm: () => void;
  onDismiss: () => void;
}

const LETTERS = ["S", "I", "G", "A", "P"];
const TAGLINE = "Sistem Integrasi Data Pasien";

export function TourIntro({ onConfirm, onDismiss }: TourIntroProps) {
  const [phase, setPhase] = useState<"idle" | "scan" | "letters" | "tagline" | "message">("idle");
  const [revealedLetters, setRevealedLetters] = useState(0);
  const [taglineLength, setTaglineLength] = useState(0);
  const [heartbeat, setHeartbeat] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Slide navbar out when intro opens, restore when it closes
  useEffect(() => {
    const nav = document.querySelector("nav") as HTMLElement | null;
    if (nav) {
      nav.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      nav.style.transform = "translateY(-100%)";
    }
    return () => {
      if (nav) {
        nav.style.transform = "translateY(0)";
      }
    };
  }, []);

  // ECG drawing
  useEffect(() => {
    if (phase !== "scan") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const W = canvas.width;
    const H = canvas.height;
    const midY = H / 2;

    // ECG path points (normalized 0-1)
    const ecgPoints = [
      [0, 0], [0.12, 0], [0.14, -0.05], [0.16, 0],
      [0.18, 0], [0.20, -0.5], [0.22, 1], [0.24, -0.3],
      [0.26, 0], [0.30, 0], [0.32, -0.1], [0.34, 0.1], [0.36, 0],
      [1, 0],
    ];

    let progress = 0;
    const speed = 2.2;
    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#1c1917";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      for (let i = 0; i < ecgPoints.length; i++) {
        const [px, py] = ecgPoints[i];
        if (px > progress) break;
        const x = px * W;
        const y = midY - py * (H * 0.35);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Glow dot at the head
      const headPoint = ecgPoints.find((p, i) => ecgPoints[i + 1]?.[0] > progress) ?? ecgPoints[ecgPoints.length - 1];
      const dotX = headPoint[0] * W;
      const dotY = midY - headPoint[1] * (H * 0.35);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#1c1917";
      ctx.fill();

      progress += speed / W;
      if (progress < 1) {
        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  // Phase sequencer
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("scan"), 100));
    timers.push(setTimeout(() => { setPhase("letters"); setHeartbeat(true); }, 1300));

    // Stagger each letter
    LETTERS.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealedLetters(i + 1), 1500 + i * 160));
    });

    timers.push(setTimeout(() => setPhase("tagline"), 2600));

    // Typewriter tagline
    for (let i = 1; i <= TAGLINE.length; i++) {
      timers.push(setTimeout(() => setTaglineLength(i), 2700 + i * 35));
    }

    timers.push(setTimeout(() => setPhase("message"), 4200));

    return () => timers.forEach(clearTimeout);
  }, []);

  const isMessage = phase === "message";

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        zIndex: 2147483647,
        background: "#fafaf8",
      }}
    >
      {/* Subtle paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='1' fill='%23000'/%3E%3C/svg%3E")`,
          backgroundSize: "4px 4px",
        }}
      />

      {/* ECG Canvas — scan phase */}
      <div
        className="absolute w-full flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: phase === "scan" ? 1 : 0,
          height: "60px",
        }}
      >
        <canvas ref={canvasRef} className="w-full max-w-lg" style={{ height: "60px" }} />
      </div>

      {/* SIGAP Letters */}
      <div
        className="absolute flex items-end gap-0.5 transition-all duration-500"
        style={{
          opacity: phase === "letters" || phase === "tagline" || phase === "message" ? 1 : 0,
          transform: isMessage ? "translateY(-48px)" : "translateY(0)",
        }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={letter}
            className="font-black text-stone-900 leading-none"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(3.5rem, 10vw, 6rem)",
              letterSpacing: "0.05em",
              opacity: i < revealedLetters ? 1 : 0,
              transform: i < revealedLetters ? "translateY(0) scale(1)" : "translateY(12px) scale(0.92)",
              transition: `opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)`,
              transitionDelay: `${i * 0.06}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Tagline typewriter */}
      <div
        className="absolute transition-all duration-500"
        style={{
          opacity: phase === "tagline" || phase === "message" ? 1 : 0,
          transform: isMessage ? "translateY(0px)" : "translateY(16px)",
          top: "calc(50% + 30px)",
        }}
      >
        <p
          className="text-stone-400 text-xs tracking-[0.28em] uppercase font-medium"
          style={{ minHeight: "1.2em" }}
        >
          {TAGLINE.slice(0, taglineLength)}
          <span
            className="inline-block w-0.5 h-3 bg-stone-400 ml-0.5 align-middle"
            style={{
              opacity: taglineLength < TAGLINE.length ? 1 : 0,
              animation: "blink 0.7s step-end infinite",
            }}
          />
        </p>
      </div>

      {/* Heartbeat pulse indicator */}
      {heartbeat && (
        <div
          className="absolute bottom-12 flex items-center gap-2 transition-opacity duration-700"
          style={{ opacity: isMessage ? 0 : 0.5 }}
        >
          <div
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            style={{ animation: "pulse 1.2s ease-in-out infinite" }}
          />
          <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400">Live System</span>
        </div>
      )}

      {/* Message phase — CTA */}
      <div
        className="absolute flex flex-col items-center gap-8 px-8 max-w-sm text-center transition-all duration-700"
        style={{
          bottom: "10%",
          opacity: isMessage ? 1 : 0,
          transform: isMessage ? "translateY(0)" : "translateY(16px)",
          pointerEvents: isMessage ? "auto" : "none",
        }}
      >
        <div className="space-y-2">
          <h2 className="text-stone-800 text-lg font-semibold">Panduan Penggunaan Sistem</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            Ikuti tur singkat ini untuk memahami alur pencatatan pasien, observasi klinis, dan dokumentasi timbang terima.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <button
            onClick={onConfirm}
            className="group w-full flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-white text-sm font-medium tracking-wide hover:bg-stone-700 active:scale-95 transition-all duration-200"
          >
            Mulai Tur
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button
            onClick={onDismiss}
            className="text-stone-400 hover:text-stone-600 text-sm transition-colors duration-200"
          >
            Lewati
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
