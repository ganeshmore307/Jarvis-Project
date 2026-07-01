import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, Battery, Wifi, Cpu, Signal, Mic, Radio, Calendar, Cloud, Car,
  CheckCircle2, Clock, Mail, Bell, Github, TrendingUp, TrendingDown,
  Sparkles, Brain, Database, Wrench, MessageSquare, MapPin, Send,
  Globe, Search, FileText, Linkedin, Slack, Music, Heart, Zap, Eye,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SARA — AI Personal Assistant OS" },
      { name: "description", content: "An ultra-premium futuristic AI personal assistant operating system." },
    ],
  }),
  component: Sara,
});

type SpeechRecognitionAlternativeLike = { transcript: string; confidence: number };
type SpeechRecognitionResultLike = { isFinal: boolean; [index: number]: SpeechRecognitionAlternativeLike };
type SpeechRecognitionEventLike = { results: ArrayLike<SpeechRecognitionResultLike>; resultIndex: number };
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

// --- Live clock hook ---
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return now;
}

function useTicker(initial: number, range = 4, ms = 1400) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    const i = setInterval(() => {
      setV((p) => Math.max(0, Math.min(100, p + (Math.random() - 0.5) * range)));
    }, ms);
    return () => clearInterval(i);
  }, [range, ms]);
  return v;
}

const DESIGN_WEBPAGE_CODE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Beauty Product Landing Page</title>
    <style>
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #090c14; color: #f3f4f8; display: grid; place-items: center; min-height: 100vh; }
      .hero { width: min(720px, calc(100vw - 3rem)); padding: 3rem; border-radius: 2rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 40px 120px rgba(0,0,0,0.3); }
      .eyebrow { text-transform: uppercase; letter-spacing: 0.4em; color: #7c8abf; font-size: 0.75rem; margin-bottom: 1.5rem; }
      .title { font-size: clamp(2.5rem, 4vw, 4.25rem); line-height: 1.02; margin: 0 0 1.2rem; }
      .copy { color: #c7c9dc; line-height: 1.85; margin-bottom: 2rem; max-width: 38rem; }
      .cta { display: inline-flex; align-items: center; gap: 0.85rem; padding: 1rem 1.8rem; border-radius: 999px; background: linear-gradient(135deg, #7ee7ff, #a36bff); color: #081026; font-weight: 700; text-decoration: none; }
      .badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1rem; border-radius: 999px; background: rgba(126, 231, 255, 0.12); color: #8be2ff; margin-bottom: 1.25rem; font-size: 0.82rem; letter-spacing: 0.12em; text-transform: uppercase; }
    </style>
  </head>
  <body>
    <section class="hero">
      <div class="badge">Beauty product</div>
      <h1 class="title">Luna Glow Serum</h1>
      <p class="copy">Discover a lightweight radiance serum carefully crafted with hyaluronic fusion, botanical peptides, and luminous botanical extracts to brighten, nourish, and restore your glow.</p>
      <a class="cta" href="#">Discover the glow</a>
    </section>
  </body>
</html>`;

// --- Background particle field ---
function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 2 + 0.5,
        d: Math.random() * 10 + 8,
        delay: -Math.random() * 10,
        hue: Math.random() > 0.5 ? "210" : "290",
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,oklch(1_0_0/0.05),transparent_70%)] blur-3xl" style={{ animation: "drift 18s ease-in-out infinite" }} />
      <div className="absolute -bottom-40 -right-40 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,oklch(1_0_0/0.04),transparent_70%)] blur-3xl" style={{ animation: "drift 22s ease-in-out infinite reverse" }} />
      <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,oklch(1_0_0/0.03),transparent_70%)] blur-3xl" style={{ animation: "drift 14s ease-in-out infinite" }} />
      {dots.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            background: `oklch(0.9 0.2 ${p.hue})`,
            boxShadow: `0 0 ${p.s * 4}px oklch(0.8 0.2 ${p.hue})`,
            animation: `float-y ${p.d}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// --- Top status bar ---
function TopBar({ speaking, setSpeaking }: { speaking: boolean; setSpeaking: (b: boolean) => void }) {
  const now = useNow();
  const cpu = useTicker(34, 12);
  const lat = useTicker(42, 8, 1000);
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const stat = (icon: React.ReactNode, label: string, value: string, color = "text-cyan") => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
      <span className={color}>{icon}</span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <span className="text-xs font-mono font-medium text-foreground">{value}</span>
    </div>
  );

  return (
    <header className="relative z-20 flex items-center justify-between gap-6 px-8 pt-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-11 w-11 rounded-2xl glass flex items-center justify-center" style={{ animation: "glow-pulse 3s ease-in-out infinite" }}>
            <Sparkles className="h-5 w-5 text-cyan" />
          </div>
        </div>
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-[0.4em] text-foreground/70">Shivang's PA · OS v4.2</div>
          <div className="text-2xl font-light tracking-tight">
            <span className="text-gradient font-semibold">{greeting}</span>
            <span className="text-foreground/80">, Shivang.</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setSpeaking(!speaking)}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] transition ${speaking ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-white/10 bg-white/[0.03] text-foreground/80 hover:border-cyan/40"}`}
        >
          <Mic className="h-3.5 w-3.5" />
          {speaking ? "Live" : "Standby"}
        </button>
        <div className="hidden lg:flex items-center gap-2">
          {stat(<Activity className="h-3.5 w-3.5" />, "Gemini", "Online", "text-emerald-400")}
          {stat(<Cpu className="h-3.5 w-3.5" />, "CPU", `${cpu.toFixed(0)}%`)}
          {stat(<Signal className="h-3.5 w-3.5" />, "Lat", `${lat.toFixed(0)}ms`)}
          {stat(<Wifi className="h-3.5 w-3.5" />, "Net", "1.2 Gb/s")}
          {stat(<Battery className="h-3.5 w-3.5" />, "Pwr", "94%", "text-emerald-400")}
        </div>
      </div>

      <div className="text-right leading-tight">
        <div className="font-mono text-3xl font-light tracking-tight neon-text tabular-nums">{time}</div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{date}</div>
      </div>
    </header>
  );
}

// --- The orb ---
function Orb({ speaking }: { speaking: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 460, height: 460 }}>
      {/* outer rotating rings */}
      <div className="absolute inset-0 rounded-full border border-cyan/20" style={{ animation: "spin-slow 28s linear infinite" }}>
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_18px_oklch(0.85_0.18_210)]" />
      </div>
      <div className="absolute inset-6 rounded-full border border-violet/20" style={{ animation: "spin-rev 22s linear infinite" }}>
        <div className="absolute top-1/2 -right-1.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-violet shadow-[0_0_18px_oklch(0.65_0.27_295)]" />
        <div className="absolute -bottom-1.5 left-1/4 h-2 w-2 rounded-full bg-magenta shadow-[0_0_16px_oklch(0.7_0.28_330)]" />
      </div>
      <div className="absolute inset-14 rounded-full border border-azure/30" style={{ animation: "spin-slow 16s linear infinite" }} />

      {/* pulse rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-20 rounded-full border-2 border-cyan/40"
          style={{ animation: `pulse-ring 3s ease-out ${i * 1}s infinite` }}
        />
      ))}

      {/* orbiting particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            background: i % 2 ? "oklch(0.85 0.18 210)" : "oklch(0.7 0.27 295)",
            boxShadow: "0 0 14px currentColor",
            color: i % 2 ? "oklch(0.85 0.18 210)" : "oklch(0.7 0.27 295)",
            // @ts-expect-error custom prop
            "--r": `${130 + (i % 3) * 18}px`,
            animation: `particle-orbit ${10 + i * 1.4}s linear ${-i * 0.7}s infinite`,
          }}
        />
      ))}

      {/* core orb */}
      <div
        className="relative h-56 w-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, oklch(0.95 0.05 210) 0%, oklch(0.78 0.2 230) 18%, oklch(0.5 0.25 270) 50%, oklch(0.2 0.15 290) 80%)",
          boxShadow:
            "inset 0 -30px 60px oklch(0.2 0.15 290 / 0.9), inset 0 30px 60px oklch(0.95 0.1 210 / 0.4), 0 0 80px oklch(0.6 0.25 250 / 0.7), 0 0 160px oklch(0.55 0.25 280 / 0.5)",
          animation: `orb-breathe ${speaking ? 1.2 : 3.6}s ease-in-out infinite`,
        }}
      >
        <div className="absolute inset-6 rounded-full opacity-60 mix-blend-screen" style={{
          background: "conic-gradient(from 0deg, transparent, oklch(0.9 0.2 210 / 0.6), transparent 40%, oklch(0.7 0.27 305 / 0.5), transparent 80%)",
          animation: "spin-slow 8s linear infinite",
        }} />
        <div className="absolute inset-12 rounded-full bg-[radial-gradient(circle_at_40%_35%,oklch(1_0_0/0.5),transparent_60%)]" />
        {/* waveform inside */}
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-white/90"
              style={{
                height: 14 + (i % 3) * 8,
                boxShadow: "0 0 8px oklch(0.95 0.1 210)",
                animation: `wave ${0.7 + (i % 3) * 0.2}s ease-in-out ${-i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* status label */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full glass">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_oklch(0.7_0.18_150)]" style={{ animation: "blink 1.5s infinite" }} />
        <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/80">{speaking ? "Speaking" : "Listening"}</span>
      </div>
    </div>
  );
}

// --- Reusable panel ---
function Panel({ title, eyebrow, icon, children, className = "" }: {
  title?: string; eyebrow?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={`glass rounded-2xl p-5 ${className}`} style={{ animation: "float-y 8s ease-in-out infinite" }}>
      {(title || eyebrow) && (
        <header className="flex items-center justify-between mb-4">
          <div>
            {eyebrow && <div className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">{eyebrow}</div>}
            {title && <h3 className="text-sm font-medium text-foreground/90 mt-0.5">{title}</h3>}
          </div>
          {icon && <div className="text-cyan/80">{icon}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

// --- Left: schedule + weather ---
function SchedulePanel() {
  const items = [
    { t: "09:30", title: "Standup · Engineering", meta: "Zoom · 6 attendees", color: "from-cyan/60 to-azure/30" },
    { t: "11:00", title: "Content Making", meta: "Studio · script + shoot", color: "from-violet/60 to-magenta/30" },
    { t: "13:15", title: "Lunch", meta: "Blue Tokai, Koregaon", color: "from-emerald-400/60 to-cyan/20" },
    { t: "15:00", title: "Product Review", meta: "SARA v4.3 launch", color: "from-magenta/50 to-violet/20" },
    { t: "18:30", title: "Gym · Strength", meta: "Cult · 60 min", color: "from-amber-400/50 to-orange-500/20" },
  ];
  return (
    <Panel eyebrow="Today" title="Schedule" icon={<Calendar className="h-4 w-4" />}>
      <div className="space-y-2.5">
        {items.map((it, i) => (
          <div key={i} className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan/30 transition-all hover:translate-x-1">
            <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${it.color}`} />
            <div className="font-mono text-xs text-cyan w-12 tabular-nums">{it.t}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-foreground truncate">{it.title}</div>
              <div className="text-[10px] text-muted-foreground truncate">{it.meta}</div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan/70"><Clock className="h-3.5 w-3.5" /></div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TasksPanel() {
  const tasks = [
    { t: "Ship voice mode v2", done: true },
    { t: "Review pull request #482", done: false },
    { t: "Sign Acme contract", done: false },
    { t: "Write Q3 OKRs draft", done: false },
  ];
  return (
    <Panel eyebrow="Focus" title="Tasks" icon={<CheckCircle2 className="h-4 w-4" />}>
      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className={`h-4 w-4 rounded-md border ${t.done ? "bg-cyan/30 border-cyan" : "border-white/20"} flex items-center justify-center`}>
              {t.done && <CheckCircle2 className="h-3 w-3 text-cyan" />}
            </span>
            <span className={t.done ? "text-muted-foreground line-through" : "text-foreground/90"}>{t.t}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-cyan to-violet" style={{ animation: "gradient-x 4s ease infinite" }} />
      </div>
    </Panel>
  );
}

function WeatherPanel() {
  return (
    <Panel eyebrow="Delhi · 19:42" title="Climate" icon={<Cloud className="h-4 w-4" />} className="!p-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-4xl font-light tabular-nums text-gradient">41°</div>
          <div className="text-[11px] text-foreground/70">Hot · feels 44°</div>
        </div>
        <div className="text-right text-[10px] text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5 justify-end"><Car className="h-3 w-3 text-cyan" /> 24 min · light traffic</div>
          <div>Humidity 64% · UV 6</div>
        </div>
      </div>
    </Panel>
  );
}

// --- Right: AI thinking ---
function ThinkingPanel() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: <Brain className="h-3.5 w-3.5" />, label: "Parsing intent", detail: "input → semantic graph" },
    { icon: <Database className="h-3.5 w-3.5" />, label: "Retrieving memory", detail: "vector · 1,284 docs" },
    { icon: <Wrench className="h-3.5 w-3.5" />, label: "Calling tool", detail: "calendar.find_slot()" },
    { icon: <MessageSquare className="h-3.5 w-3.5" />, label: "Composing reply", detail: "tone: focused" },
  ];
  useEffect(() => {
    const i = setInterval(() => setStep((s) => (s + 1) % (steps.length + 1)), 1800);
    return () => clearInterval(i);
  }, []);
  return (
    <Panel eyebrow="Live" title="AI Reasoning" icon={<Brain className="h-4 w-4" />}>
      <div className="space-y-2">
        {steps.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div key={i} className={`flex items-start gap-3 p-2 rounded-lg transition-all ${active ? "bg-cyan/5 border border-cyan/30" : "border border-transparent"}`}>
              <div className={`mt-0.5 h-6 w-6 rounded-md flex items-center justify-center ${active ? "bg-cyan/20 text-cyan" : done ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="text-xs text-foreground/90 flex items-center gap-2">
                  {s.label}
                  {active && <span className="inline-block w-1.5 h-3 bg-cyan" style={{ animation: "type-cursor 0.8s infinite" }} />}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">{s.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-1.5">Agent logs</div>
        <div className="font-mono text-[10px] text-muted-foreground/80 space-y-0.5 max-h-24 overflow-hidden">
          <div><span className="text-cyan">[19:42:11]</span> route → assistant.primary</div>
          <div><span className="text-violet">[19:42:11]</span> ctx · 8.4k tokens loaded</div>
          <div><span className="text-emerald-400">[19:42:12]</span> tool calendar.find_slot OK 184ms</div>
          <div><span className="text-cyan">[19:42:12]</span> stream → user · 38 tok/s</div>
        </div>
      </div>
    </Panel>
  );
}

// --- World map ---
function WorldMap() {
  const orbits = [
    { r: 44, dur: 14, count: 3, color: "oklch(0.85 0.18 210)" },
    { r: 62, dur: 22, count: 4, color: "oklch(0.78 0.20 280)" },
    { r: 80, dur: 32, count: 2, color: "oklch(0.82 0.20 330)" },
  ];
  return (
    <Panel eyebrow="Global · Live" title="Network Activity" icon={<Globe className="h-4 w-4" />}>
      <div className="relative w-full aspect-square max-h-[220px] mx-auto rounded-xl overflow-hidden bg-[radial-gradient(circle_at_center,oklch(0.18_0.06_240/0.6),transparent_70%)] flex items-center justify-center">
        {/* outer atmosphere */}
        <div className="absolute inset-4 rounded-full" style={{ boxShadow: "0 0 80px 10px oklch(0.7 0.22 220 / 0.25), inset 0 0 60px oklch(0.7 0.22 220 / 0.15)" }} />

        {/* the globe */}
        <div className="relative" style={{ width: "70%", aspectRatio: "1" }}>
          <div
            className="absolute inset-0 rounded-full overflow-hidden border border-cyan/30"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, oklch(0.28 0.08 240) 0%, oklch(0.1 0.04 250) 60%, oklch(0.06 0.02 250) 100%)",
              boxShadow: "inset -30px -20px 80px rgba(0,0,0,0.7), inset 20px 10px 40px oklch(0.6 0.2 220 / 0.25)",
            }}
          >
            {/* rotating longitude grid */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ animation: "spin-slow 18s linear infinite" }}>
              <defs>
                <radialGradient id="globeMask" cx="50%" cy="50%" r="50%">
                  <stop offset="80%" stopColor="white" stopOpacity="1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <mask id="gMask"><circle cx="100" cy="100" r="100" fill="url(#globeMask)" /></mask>
              </defs>
              <g mask="url(#gMask)" fill="none" stroke="oklch(0.85 0.18 210)" strokeWidth="0.5" opacity="0.55">
                {/* meridians */}
                {[10, 25, 40, 55, 70, 85].map((rx, i) => (
                  <ellipse key={i} cx="100" cy="100" rx={rx} ry="85" />
                ))}
                {/* parallels */}
                {[20, 40, 60, 75, 85].map((ry, i) => (
                  <ellipse key={i} cx="100" cy="100" rx="92" ry={ry} />
                ))}
                {/* equator */}
                <line x1="6" y1="100" x2="194" y2="100" stroke="oklch(0.9 0.2 200)" strokeWidth="0.7" opacity="0.7" />
              </g>
              {/* dot land masses scattered */}
              <g mask="url(#gMask)" fill="oklch(0.85 0.18 200)" opacity="0.85">
                {Array.from({ length: 90 }).map((_, i) => {
                  const a = (i * 137.5) % 360;
                  const r = 30 + ((i * 17) % 65);
                  const x = 100 + Math.cos((a * Math.PI) / 180) * r;
                  const y = 100 + Math.sin((a * Math.PI) / 180) * r * 0.95;
                  return <circle key={i} cx={x} cy={y} r={0.7 + (i % 3) * 0.25} />;
                })}
              </g>
            </svg>

            {/* glossy highlight */}
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.18), transparent 35%)" }} />
          </div>

          {/* orbiting rings + satellites */}
          {orbits.map((o, idx) => (
            <div
              key={idx}
              className="absolute left-1/2 top-1/2 rounded-full border border-white/10"
              style={{
                width: `${o.r * 2}%`,
                height: `${o.r * 2}%`,
                transform: "translate(-50%, -50%) rotateX(72deg)",
                animation: `spin-slow ${o.dur}s linear infinite${idx % 2 ? " reverse" : ""}`,
                borderColor: "oklch(0.8 0.18 220 / 0.25)",
              }}
            >
              {Array.from({ length: o.count }).map((_, i) => {
                const angle = (360 / o.count) * i;
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2"
                    style={{ transform: `rotate(${angle}deg) translateX(${o.r}%) rotate(-${angle}deg)` }}
                  >
                    <div className="h-2 w-2 rounded-full" style={{ background: o.color, boxShadow: `0 0 12px ${o.color}` }} />
                  </div>
                );
              })}
            </div>
          ))}

          {/* ping nodes on surface */}
          {[{x:30,y:35},{x:68,y:42},{x:55,y:68},{x:40,y:60}].map((n,i)=>(
            <div key={i} className="absolute" style={{ left:`${n.x}%`, top:`${n.y}%`, transform:"translate(-50%,-50%)" }}>
              <div className="absolute inset-0 rounded-full bg-cyan/40" style={{ width:14, height:14, marginLeft:-7, marginTop:-7, animation:`node-pulse 2s ease-out ${-i*0.4}s infinite` }} />
              <div className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_oklch(0.85_0.18_210)]" />
            </div>
          ))}
        </div>

        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-foreground/70">28 nodes · 1.4k req/s</div>
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-foreground/70">orbit · stable</div>
      </div>
    </Panel>
  );
}

// --- Stocks / Crypto / mini stats ---
function MiniStat({ label, value, change, up, spark }: { label: string; value: string; change: string; up: boolean; spark: number[] }) {
  const max = Math.max(...spark), min = Math.min(...spark);
  const pts = spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${30 - ((v - min) / (max - min || 1)) * 28}`).join(" ");
  return (
    <div className="glass rounded-xl p-3 flex flex-col gap-1.5 hover:border-cyan/30 transition">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <span className={`text-[10px] font-mono flex items-center gap-0.5 ${up ? "text-emerald-400" : "text-rose-400"}`}>
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {change}
        </span>
      </div>
      <div className="text-base font-light tabular-nums">{value}</div>
      <svg viewBox="0 0 100 32" className="w-full h-6">
        <polyline points={pts} fill="none" stroke={up ? "oklch(0.75 0.2 160)" : "oklch(0.7 0.22 25)"} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <MiniStat label="NVDA" value="$948.32" change="+2.4%" up spark={[3,4,3,5,6,5,7,8,7,9,10]} />
      <MiniStat label="BTC" value="$71.2k" change="+1.8%" up spark={[5,4,6,5,7,6,8,7,9,8,10]} />
      <MiniStat label="ETH" value="$3.84k" change="-0.6%" up={false} spark={[8,9,7,8,6,7,5,6,4,5,3]} />
      <MiniStat label="AAPL" value="$224.18" change="+0.9%" up spark={[2,3,2,4,3,5,4,6,5,7,6]} />
    </div>
  );
}

function QuickPanels() {
  const items = [
    { i: <Mail className="h-3.5 w-3.5" />, l: "Inbox", v: "12 unread", g: "from-cyan/30" },
    { i: <Bell className="h-3.5 w-3.5" />, l: "Alerts", v: "3 new", g: "from-violet/30" },
    { i: <Github className="h-3.5 w-3.5" />, l: "Commits", v: "8 today", g: "from-magenta/30" },
    { i: <Heart className="h-3.5 w-3.5" />, l: "Heart", v: "72 bpm", g: "from-rose-400/30" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((x, i) => (
        <div key={i} className={`glass rounded-xl p-3 bg-gradient-to-br ${x.g} to-transparent`}>
          <div className="flex items-center gap-1.5 text-cyan/90">{x.i}<span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{x.l}</span></div>
          <div className="text-sm mt-1 text-foreground/90">{x.v}</div>
        </div>
      ))}
    </div>
  );
}

// --- Productivity radial ---
function Productivity() {
  const score = 87;
  const c = 2 * Math.PI * 32;
  return (
    <Panel eyebrow="Today" title="Productivity Score" icon={<Zap className="h-4 w-4" />}>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle cx="40" cy="40" r="32" stroke="oklch(1 0 0 / 0.06)" strokeWidth="6" fill="none" />
          <circle cx="40" cy="40" r="32" stroke="url(#gscore)" strokeWidth="6" fill="none"
            strokeDasharray={c} strokeDashoffset={c - (c * score) / 100} strokeLinecap="round" />
          <defs>
            <linearGradient id="gscore" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="oklch(0.85 0.18 210)" />
              <stop offset="1" stopColor="oklch(0.7 0.27 305)" />
            </linearGradient>
          </defs>
        </svg>
        <div>
          <div className="text-3xl font-light text-gradient tabular-nums">{score}</div>
          <div className="text-[10px] text-muted-foreground">Deep focus · 4h 18m</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">+12% vs yesterday</div>
        </div>
      </div>
    </Panel>
  );
}

// --- Graphs grid ---
function Sparkline({ data, color, fill }: { data: number[]; color: string; fill: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 100, h = 40;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.45" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${fill})`} />
      <polyline points={pts} stroke={color} strokeWidth="1.4" fill="none" />
    </svg>
  );
}

function GraphsRow() {
  const charts = [
    { l: "Revenue", v: "$48.2k", d: [4,6,5,7,6,8,7,9,8,10,9,11,12], c: "oklch(0.85 0.18 210)", k: "rev" },
    { l: "Focus", v: "92%", d: [6,5,7,6,8,7,9,8,10,9,11,10,12], c: "oklch(0.7 0.27 305)", k: "foc" },
    { l: "Sleep", v: "7h 42m", d: [3,4,5,4,6,5,7,6,8,7,8,7,8], c: "oklch(0.75 0.2 160)", k: "sl" },
    { l: "Heart", v: "72 bpm", d: [5,7,4,8,5,9,6,8,5,7,6,8,5], c: "oklch(0.7 0.22 25)", k: "hr" },
    { l: "CPU", v: "34%", d: [2,3,4,3,5,4,6,5,4,3,4,5,4], c: "oklch(0.78 0.18 230)", k: "cpu" },
    { l: "Memory", v: "12.4 GB", d: [6,6,7,7,8,7,8,9,8,9,9,10,10], c: "oklch(0.7 0.25 280)", k: "mem" },
  ];
  return (
    <Panel eyebrow="Telemetry" title="Realtime Metrics" icon={<Activity className="h-4 w-4" />}>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {charts.map((c, i) => (
          <div key={i} className="space-y-1">
            <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{c.l}</div>
            <div className="text-sm font-light tabular-nums">{c.v}</div>
            <Sparkline data={c.d} color={c.c} fill={c.k} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

// --- Capabilities ---
function Capabilities() {
  const caps = [
    { i: <Calendar className="h-4 w-4" />, l: "Calendar" },
    { i: <Mail className="h-4 w-4" />, l: "Gmail" },
    { i: <MessageSquare className="h-4 w-4" />, l: "WhatsApp" },
    { i: <FileText className="h-4 w-4" />, l: "Notion" },
    { i: <Slack className="h-4 w-4" />, l: "Slack" },
    { i: <Github className="h-4 w-4" />, l: "GitHub" },
    { i: <Linkedin className="h-4 w-4" />, l: "LinkedIn" },
    { i: <MapPin className="h-4 w-4" />, l: "Maps" },
    { i: <Cloud className="h-4 w-4" />, l: "Weather" },
    { i: <Search className="h-4 w-4" />, l: "Search" },
    { i: <FileText className="h-4 w-4" />, l: "Docs" },
    { i: <Music className="h-4 w-4" />, l: "Music" },
  ];
  return (
    <Panel eyebrow="Connected" title="Agent Capabilities" icon={<Sparkles className="h-4 w-4" />}>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2.5">
        {caps.map((c, i) => (
          <div
            key={i}
            className="group relative aspect-square rounded-xl glass flex flex-col items-center justify-center gap-1.5 hover:scale-105 hover:border-cyan/40 transition-all cursor-pointer"
            style={{ animation: `float-y ${5 + (i % 4)}s ease-in-out ${-i * 0.4}s infinite` }}
          >
            <div className="text-cyan group-hover:text-violet transition-colors">{c.i}</div>
            <div className="text-[10px] text-foreground/70">{c.l}</div>
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.75_0.2_150)]" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

// --- Horizontal Markets strip ---
function MarketsStrip() {
  const rows = [
    { sym: "BTC",   name: "Bitcoin",       px: "$103,482", chg: "+2.14%", up: true },
    { sym: "ETH",   name: "Ethereum",      px: "$5,728",   chg: "+1.62%", up: true },
    { sym: "SOL",   name: "Solana",        px: "$284.10",  chg: "-0.84%", up: false },
    { sym: "NVDA",  name: "NVIDIA",        px: "$1,612",   chg: "+3.42%", up: true },
    { sym: "AAPL",  name: "Apple",         px: "$248.90",  chg: "+0.41%", up: true },
    { sym: "TSLA",  name: "Tesla",         px: "$412.55",  chg: "-1.27%", up: false },
    { sym: "MSFT",  name: "Microsoft",     px: "$502.18",  chg: "+0.92%", up: true },
    { sym: "GOOG",  name: "Alphabet",      px: "$214.74",  chg: "+1.08%", up: true },
    { sym: "META",  name: "Meta",          px: "$728.40",  chg: "+2.21%", up: true },
    { sym: "AMZN",  name: "Amazon",        px: "$248.66",  chg: "-0.32%", up: false },
    { sym: "GOLD",  name: "Gold / oz",     px: "$2,914",   chg: "+0.18%", up: true },
    { sym: "OIL",   name: "Brent",         px: "$74.30",   chg: "-0.61%", up: false },
  ];
  const loop = [...rows, ...rows];
  const spark = (up: boolean) => {
    const pts = Array.from({ length: 16 }).map((_, i) => {
      const y = 10 + Math.sin(i * 0.9 + (up ? 0 : 1.7)) * 4 + (up ? -i * 0.25 : i * 0.25);
      return `${i * 6},${y.toFixed(1)}`;
    }).join(" ");
    return (
      <svg viewBox="0 0 96 24" className="w-24 h-6">
        <polyline fill="none" stroke={up ? "oklch(0.8 0.18 150)" : "oklch(0.7 0.22 25)"} strokeWidth="1.4" points={pts} />
      </svg>
    );
  };
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-foreground/70" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/80">Markets</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono">· streaming</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono">12 instruments</span>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#050505] to-transparent" />
        <div className="flex gap-3 py-3 px-5 whitespace-nowrap" style={{ animation: "ticker 70s linear infinite", width: "max-content" }}>
          {loop.map((r, i) => (
            <div key={i} className="shrink-0 flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-2">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">{r.sym}</span>
                <span className="text-sm font-medium text-foreground/90">{r.px}</span>
              </div>
              {spark(r.up)}
              <span className={`text-xs font-mono ${r.up ? "text-emerald-400" : "text-red-400"}`}>{r.chg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function NewsTicker() {
  const items = [
    { cat: "AI",       src: "TechCrunch", time: "2m", title: "OpenAI unveils GPT-6 with native agentic reasoning",   trend: "up",   delta: "+4.2%" },
    { cat: "Markets",  src: "Bloomberg",  time: "5m", title: "NVIDIA hits $4T market cap on Blackwell demand",        trend: "up",   delta: "+2.8%" },
    { cat: "Funding",  src: "The Information", time: "11m", title: "Anthropic raises $8B at $120B valuation",          trend: "up",   delta: "+12%" },
    { cat: "Hardware", src: "The Verge",  time: "22m", title: "Apple Vision Pro 2 ships with neural eye tracking",    trend: "up",   delta: "+1.1%" },
    { cat: "Robotics", src: "Reuters",    time: "34m", title: "Tesla Optimus enters limited consumer pilot",          trend: "up",   delta: "+5.6%" },
    { cat: "Policy",   src: "FT",         time: "48m", title: "EU passes AI Liability Act, effective 2027",           trend: "down", delta: "-0.4%" },
    { cat: "Space",    src: "Ars Technica", time: "1h", title: "SpaceX Starship completes 14th orbital test",         trend: "up",   delta: "+3.0%" },
    { cat: "Deals",    src: "WSJ",        time: "1h", title: "Stripe acquires payments AI startup for $1.2B",         trend: "up",   delta: "+0.9%" },
    { cat: "Product",  src: "Notion",     time: "2h", title: "Notion launches AI workspace agents",                   trend: "up",   delta: "+2.1%" },
  ];
  const loop = [...items, ...items];
  const catColor: Record<string, string> = {
    AI: "text-cyan", Markets: "text-emerald-400", Funding: "text-violet", Hardware: "text-foreground/80",
    Robotics: "text-magenta", Policy: "text-amber-400", Space: "text-cyan", Deals: "text-emerald-400", Product: "text-violet",
  };
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70" style={{ animation: "pulse-ring 1.6s ease-out infinite" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/80">Live Feed</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono">· global · realtime</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono">
          <span>9 sources</span>
          <span className="h-3 w-px bg-white/10" />
          <span>auto-curated</span>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#050505] to-transparent" />
        <div className="flex gap-4 py-4 px-5 whitespace-nowrap" style={{ animation: "ticker 90s linear infinite", width: "max-content" }}>
          {loop.map((it, i) => {
            const Up = it.trend === "up";
            return (
              <article key={i} className="group shrink-0 w-[320px] rounded-xl border border-white/8 bg-white/[0.025] hover:bg-white/[0.05] transition-colors px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] uppercase tracking-[0.32em] ${catColor[it.cat] ?? "text-foreground/70"}`}>{it.cat}</span>
                  <div className={`flex items-center gap-1 text-[10px] font-mono ${Up ? "text-emerald-400" : "text-red-400"}`}>
                    {Up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {it.delta}
                  </div>
                </div>
                <p className="text-[13px] leading-snug text-foreground/90 whitespace-normal line-clamp-2 group-hover:text-foreground">
                  {it.title}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
                  <span>{it.src}</span>
                  <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{it.time}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function useSpeechRecognition(active: boolean, onFinalTranscript?: (speech: string) => void) {
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Tap the mic to start listening in your browser.");
  const [supported, setSupported] = useState(false);
  const callbackRef = useRef(onFinalTranscript);
  const stopRequested = useRef(false);

  useEffect(() => {
    callbackRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(Boolean(Recognition));

    if (!Recognition) {
      setStatus("Browser speech recognition is not supported here.");
      return;
    }

    if (!active) {
      setStatus("Ready to listen");
      return;
    }

    stopRequested.current = false;
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let cumulativeFinal = "";
    let interimText = "";

    recognition.onresult = (event) => {
      interimText = "";
      let hasNewFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";

        if (result.isFinal) {
          cumulativeFinal = `${cumulativeFinal} ${text}`.trim();
          hasNewFinal = true;
        } else {
          interimText = text;
        }
      }

      const nextTranscript = `${cumulativeFinal} ${interimText}`.trim();
      if (hasNewFinal) {
        callbackRef.current?.(cumulativeFinal);
      }
      setTranscript(nextTranscript);
      setStatus(nextTranscript ? "Listening live…" : "Listening…");
    };

    recognition.onerror = (event) => {
      setStatus(`Speech error: ${event.error}`);
    };

    recognition.onend = () => {
      if (stopRequested.current || !active) {
        setStatus("Ready to listen");
      } else {
        setStatus("Listening stopped. Tap start to resume.");
      }
      stopRequested.current = false;
    };

    recognition.start();
    setStatus("Listening live…");

    return () => {
      stopRequested.current = true;
      recognition.stop();
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [active]);

  return { transcript, status, supported };
}

function AssistantPopup({ open, code, onClose }: { open: boolean; code: string; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="relative max-w-5xl w-full rounded-3xl border border-white/10 bg-slate-950/95 shadow-[0_0_80px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-white/10 bg-slate-900/80">
          <div>
            <div className="text-sm uppercase tracking-[0.32em] text-cyan/80">Design Editor</div>
            <div className="text-xs text-muted-foreground">Beauty product webpage</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.24em] text-foreground/80 hover:border-cyan/40"
          >
            Close
          </button>
        </div>
        <div className="p-6 bg-slate-950/90 min-h-[320px] overflow-auto">
          <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-emerald-100 font-mono">{code || "Starting code preview..."}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Bottom voice command ---
function VoiceBar({ speaking, assistantMessage, transcript, status, supported, setSpeaking }: { speaking: boolean; assistantMessage?: string; transcript: string; status: string; supported: boolean; setSpeaking: (b: boolean) => void }) {
  return (
    <div className="glass-strong rounded-2xl p-5 flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative h-14 w-14 rounded-full shrink-0 flex items-center justify-center text-background"
        style={{
          background: "radial-gradient(circle at 30% 30%, oklch(0.95 0.06 210), oklch(0.78 0.2 230) 50%, oklch(0.5 0.25 280))",
          animation: "glow-pulse 2.4s ease-in-out infinite",
        }}
      >
        <Mic className="h-6 w-6" />
        <span className="absolute inset-0 rounded-full border border-cyan/50" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-1.5">
          {speaking ? "Listening · live transcription" : "Ready · browser speech"}
        </div>
        <div className="text-base text-foreground/95 leading-relaxed min-h-[1.5rem]">
          {transcript || (supported ? "Start listening to capture your words in real time." : "Your browser does not support speech recognition.")}
        </div>
        {assistantMessage ? (
          <div className="mt-1 rounded-2xl border border-cyan/10 bg-cyan/5 px-3 py-2 text-[12px] text-cyan-100">
            {assistantMessage}
          </div>
        ) : null}
        <div className="mt-1 text-[11px] text-cyan/80">{status}</div>
      </div>

      <div className="flex items-end gap-[3px] h-12">
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-cyan via-azure to-violet"
            style={{
              height: `${20 + ((i * 53) % 80)}%`,
              animation: `wave ${0.6 + (i % 5) * 0.12}s ease-in-out ${-i * 0.05}s infinite`,
              opacity: speaking ? 1 : 0.6,
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSpeaking(!speaking)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-foreground/80 transition ${speaking ? "border-red-400 text-red-300 hover:border-red-200" : "hover:border-cyan/40"}`}
        >
          <Mic className="h-3.5 w-3.5 text-current" />
          {speaking ? "Stop listening" : "Start listening"}
        </button>
        <button
          type="button"
          onClick={() => setSpeaking(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-foreground/80 hover:border-red-400 transition"
        >
          Stop
        </button>
      </div>
    </div>
  );
}

// --- Page ---
const INTRO_LINE = "Hi Boss. Good morning. While you were sleeping, I organized your day. Would you like a quick briefing?";

function Intro({ onDone }: { onDone: () => void }) {
  const [started, setStarted] = useState(false);
  const [typed, setTyped] = useState("");
  const [fading, setFading] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(() => onDone(), 900);
  };

  const begin = () => {
    if (started) return;
    setStarted(true);

    // Create utterance synchronously in the user gesture so browsers allow it.
    let spoke = false;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(INTRO_LINE);
      u.lang = "en-US";
      u.rate = 0.96;
      u.pitch = 0.85;
      u.volume = 1;

      const pickMaleVoice = () => {
        const voices = synth.getVoices();
        const score = (v: SpeechSynthesisVoice) => {
          const n = v.name.toLowerCase();
          let s = 0;
          if (/en[-_]?(us|gb|au)/i.test(v.lang)) s += 3;
          else if (/^en/i.test(v.lang)) s += 2;
          if (/(male|man|david|daniel|alex|fred|guy|aaron|arthur|oliver|james|george|mark|tom|rishi|ravi)/i.test(n)) s += 5;
          if (/(female|woman|samantha|victoria|karen|moira|tessa|zira|jenny|aria|allison|ava|susan|fiona|catherine)/i.test(n)) s -= 5;
          if (/google.*us english/i.test(n)) s += 1; // typically male-ish on Chrome
          return s;
        };
        const sorted = [...voices].filter((v) => /^en/i.test(v.lang)).sort((a, b) => score(b) - score(a));
        const chosen = sorted[0];
        if (chosen) u.voice = chosen;
      };

      u.onend = () => finish();
      u.onerror = () => finish();

      const speakNow = () => {
        pickMaleVoice();
        synth.speak(u);
        spoke = true;
      };

      if (synth.getVoices().length) speakNow();
      else {
        synth.addEventListener("voiceschanged", () => { if (!spoke) speakNow(); }, { once: true });
        setTimeout(() => { if (!spoke) speakNow(); }, 400);
      }
    } catch {
      /* speech unsupported */
    }

    // Hard fallback so the dashboard always loads even if speech never fires/ends.
    setTimeout(() => finish(), 9000);
  };

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const tick = setInterval(() => {
      i++;
      setTyped(INTRO_LINE.slice(0, i));
      if (i >= INTRO_LINE.length) clearInterval(tick);
    }, 55);
    return () => clearInterval(tick);
  }, [started]);

  useEffect(() => {
    return () => { try { window.speechSynthesis.cancel(); } catch {} };
  }, []);



  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-[900ms]"
      style={{ background: "#050505", opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }}
      onClick={begin}
    >
      <div className="absolute inset-0 opacity-60" style={{
        background: "radial-gradient(circle at 50% 50%, oklch(0.3 0.18 250 / 0.35), transparent 60%)",
      }} />
      <div className="relative">
        <Orb speaking />
      </div>
      <div className="relative mt-10 max-w-xl px-8 text-center min-h-[6rem]">
        <div className="text-[10px] uppercase tracking-[0.5em] text-cyan/80 mb-3" style={{ animation: "blink 1.6s infinite" }}>
          {started ? "Shivang's PA · speaking" : "Shivang's PA · standby"}
        </div>
        {started ? (
          <p className="text-foreground/90 text-lg leading-relaxed font-light">
            {typed}
            <span className="inline-block w-[2px] h-[1.1em] align-[-2px] ml-1 bg-cyan" style={{ animation: "type-cursor 0.9s infinite" }} />
          </p>
        ) : (
          <button
            type="button"
            onClick={begin}
            className="text-foreground/80 text-sm tracking-[0.4em] uppercase font-mono px-6 py-3 rounded-full border border-white/15 hover:border-cyan/60 hover:text-cyan transition-colors"
            style={{ animation: "orb-breathe 2.4s ease-in-out infinite" }}
          >
            Tap to wake Shivang's PA
          </button>
        )}
      </div>
      <div className="absolute bottom-10 text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 font-mono">
        Booting sentience layer · v3.0
      </div>
    </div>
  );
}

function Sara() {
  const [speaking, setSpeaking] = useState(false);
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    if (!intro) {
      setSpeaking(true);
    }
  }, [intro]);

  const [assistantMessage, setAssistantMessage] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupCode, setPopupCode] = useState("");
  const [popupWriting, setPopupWriting] = useState(false);
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const lastCommandRef = useRef("");
  const pendingCommandTimeoutRef = useRef<number | null>(null);

  const speak = (message: string) => {
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "en-US";
      utterance.rate = 0.98;
      utterance.pitch = 1;
      utterance.volume = 1;
      synth.speak(utterance);
    } catch {
      // ignore unsupported speech
    }
  };

  const clearPendingCommand = () => {
    if (pendingCommandTimeoutRef.current) {
      window.clearTimeout(pendingCommandTimeoutRef.current);
      pendingCommandTimeoutRef.current = null;
    }
    setPendingCommand(null);
  };

  const executeCommand = async (commandKey: string, normalized: string) => {
    switch (commandKey) {
      case "schedule-aman": {
        const message = "meeting scheduled for Tomorrow Boss.";
        setAssistantMessage(message);
        speak(message);
        break;
      }
      case "news-ai": {
        const message = "SpaceX is exploring the concept of building AI data centers in orbit. The goal is to bypass Earth's land and environmental resource strains by tapping directly into abundant, uninterrupted solar energy.";
        setAssistantMessage(message);
        speak(message);
        break;
      }
      case "design-beauty-page": {
        const message = "Opening a beauty product webpage editor now.";
        setAssistantMessage(message);
        speak(message);
        setPopupOpen(true);
        break;
      }
      case "open-file-explorer": {
        const message = "Opening File Explorer.";
        setAssistantMessage(message);
        speak(message);
        break;
      }
      case "battery-percentage": {
        try {
          const battery = await navigator.getBattery?.();
          const message = battery
            ? `Your battery is at ${Math.round(battery.level * 100)} percent.`
            : "I cannot read battery status from this browser.";
          setAssistantMessage(message);
          speak(message);
        } catch {
          const message = "I cannot read battery status from this browser.";
          setAssistantMessage(message);
          speak(message);
        }
        break;
      }
      case "current-time": {
        const now = new Date();
        const message = `The time is ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}.`;
        setAssistantMessage(message);
        speak(message);
        break;
      }
      case "current-date": {
        const today = new Date();
        const message = `Today is ${today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}.`;
        setAssistantMessage(message);
        speak(message);
        break;
      }
      case "cpu-status": {
        const message = "Your system appears nominal. CPU status reporting is limited in this browser demo.";
        setAssistantMessage(message);
        speak(message);
        break;
      }
      default: {
        const message = "Command recognized, but I could not execute it yet.";
        setAssistantMessage(message);
        speak(message);
      }
    }

    clearPendingCommand();
  };

  const handleSpeechCommand = (speech: string) => {
    const normalized = speech.trim().toLowerCase();
    if (!normalized || normalized === lastCommandRef.current) return;
    lastCommandRef.current = normalized;
    clearPendingCommand();

    let commandKey: string | null = null;

    if (/schedule.*meeting.*aman/.test(normalized) || /aman.*meeting/.test(normalized)) {
      commandKey = "schedule-aman";
    } else if (/give me latest news about ai|latest news about ai|news about ai/.test(normalized)) {
      commandKey = "news-ai";
    } else if ((/design.*(webpage|web page|page)/.test(normalized) || /(webpage|web page|page).*design/.test(normalized)) && /beauty|product/.test(normalized)) {
      commandKey = "design-beauty-page";
    } else if (/open.*(file explorer|explorer)|launch.*(file explorer|explorer)/.test(normalized)) {
      commandKey = "open-file-explorer";
    } else if (/battery.*percentage|battery.*percent|what.*battery|battery.*level/.test(normalized)) {
      commandKey = "battery-percentage";
    } else if (/what.*time|tell me the time|current time/.test(normalized)) {
      commandKey = "current-time";
    } else if (/what.*date|today.*date|current date|today is/.test(normalized)) {
      commandKey = "current-date";
    } else if (/cpu.*usage|cpu.*status|how.*cpu/.test(normalized)) {
      commandKey = "cpu-status";
    }

    if (!commandKey) return;

    setPendingCommand(commandKey);
    setAssistantMessage("Command detected. Executing in 2 seconds...");
    pendingCommandTimeoutRef.current = window.setTimeout(() => {
      executeCommand(commandKey, normalized);
    }, 2000);
  };

  const { transcript, status, supported } = useSpeechRecognition(speaking, handleSpeechCommand);

  useEffect(() => {
    if (!intro) {
      setSpeaking(true);
    }
  }, [intro]);

  useEffect(() => {
    if (!popupOpen) return;

    setPopupCode("");
    setPopupWriting(true);
    let index = 0;

    const writer = window.setInterval(() => {
      index += 1;
      setPopupCode(DESIGN_WEBPAGE_CODE.slice(0, index));
      if (index >= DESIGN_WEBPAGE_CODE.length) {
        window.clearInterval(writer);
        setPopupWriting(false);
      }
    }, 18);

    return () => {
      window.clearInterval(writer);
    };
  }, [popupOpen]);

  const closePopup = () => {
    setPopupOpen(false);
    setPopupWriting(false);
  };

  return (
    <div className="relative min-h-screen text-foreground">
      {intro && <Intro onDone={() => setIntro(false)} />}
      <Particles />
      <div
        className="relative z-10 max-w-[1800px] mx-auto pb-8 transition-opacity duration-[1200ms]"
        style={{ opacity: intro ? 0 : 1 }}
      >

        <TopBar speaking={speaking} setSpeaking={setSpeaking} />
        <div className="px-8 mt-6">
          <VoiceBar
            speaking={speaking}
            setSpeaking={setSpeaking}
            assistantMessage={assistantMessage}
            transcript={transcript}
            status={status}
            supported={supported}
          />
        </div>

        <main className="px-8 mt-6 grid grid-cols-12 gap-5">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-3 space-y-5">
            <SchedulePanel />
            <TasksPanel />
            <WeatherPanel />
          </div>

          {/* CENTER */}
          <div className="col-span-12 lg:col-span-6 space-y-5">
            <div className="glass-strong rounded-2xl p-6 flex flex-col items-center justify-center min-h-[520px] relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-20" />
              <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <Eye className="h-3 w-3 text-cyan" /> Sentience layer
              </div>
              <div className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono">model · gemini-3-flash</div>
              <Orb speaking={speaking} />
              <div className="mt-4 text-center max-w-md">
                <div className="text-[10px] uppercase tracking-[0.4em] text-cyan/80 mb-1">Now responding</div>
                <p className="text-foreground/85 text-sm leading-relaxed">
                  &ldquo;You have five meetings today. I&apos;ve prepared a one-page brief for your 11 AM sync with Sequoia and rescheduled the design review to make room.&rdquo;
                </p>
              </div>
            </div>
            <WorldMap />
            <Capabilities />
          </div>

          {/* RIGHT */}
          <div className="col-span-12 lg:col-span-3 space-y-5">
            <ThinkingPanel />
            <Productivity />
            <StatsGrid />
            <QuickPanels />
          </div>

          {/* FULL WIDTH */}
          <div className="col-span-12">
            <GraphsRow />
          </div>
          <div className="col-span-12">
            <MarketsStrip />
          </div>
          <div className="col-span-12">
            <NewsTicker />
          </div>
        </main>
        <AssistantPopup open={popupOpen} code={popupCode} onClose={closePopup} />

        <footer className="px-8 mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <div>Shivang's PA · Personal AI Operating System</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.7_0.2_150)]" style={{ animation: "blink 1.4s infinite" }} />
            All systems nominal
          </div>
        </footer>
      </div>
    </div>
  );
}
