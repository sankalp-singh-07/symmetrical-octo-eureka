'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  useScroll,
  useSpring,
  useTransform,
  motion,
  MotionValue,
  AnimatePresence,
} from 'framer-motion';

/* ─────────────────────────────────────────────────────────── */
/*  Constants                                                  */
/* ─────────────────────────────────────────────────────────── */
const FRAME_COUNT = 174;
const SPRING_CONFIG = { stiffness: 80, damping: 28, restDelta: 0.0005 };

const frameName = (i: number) =>
  `/sequence/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;

/* ─────────────────────────────────────────────────────────── */
/*  TextBeat                                                   */
/* ─────────────────────────────────────────────────────────── */
interface BeatProps {
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
  align?: 'left' | 'center' | 'right';
  label: string;
  title: string;
  subtitle: string;
  accent?: boolean;
}

function TextBeat({
  scrollYProgress,
  start,
  end,
  align = 'center',
  label,
  title,
  subtitle,
  accent = false,
}: BeatProps) {
  const fade = 0.09;
  const rise = 24;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [start, start + fade, end - fade, end],
    [rise, 0, 0, -rise]
  );

  const alignClass =
    align === 'left'
      ? 'items-start text-left'
      : align === 'right'
      ? 'items-end text-right'
      : 'items-center text-center';

  const paddingClass =
    align === 'left'
      ? 'pl-8 md:pl-16 lg:pl-28'
      : align === 'right'
      ? 'pr-8 md:pr-16 lg:pr-28'
      : 'px-6';

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex flex-col justify-center pointer-events-none select-none ${alignClass} ${paddingClass}`}
    >
      {/* Label pill */}
      <div
        className={`inline-flex items-center gap-2 mb-5 ${
          align === 'center' ? 'self-center' : ''
        }`}
      >
        <div
          className="h-px w-6"
          style={{ background: 'linear-gradient(90deg, #c9a84c, transparent)' }}
        />
        <p
          className="beat-label"
          style={{ color: accent ? '#e8c97a' : '#c9a84c' }}
        >
          {label}
        </p>
        <div
          className="h-px w-6"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c)' }}
        />
      </div>

      {/* Title */}
      <h2
        className="beat-title mb-6"
        style={{
          maxWidth: align === 'center' ? '16ch' : '11ch',
          textShadow: '0 0 80px rgba(0,0,0,0.8)',
        }}
      >
        {accent ? (
          <span
            style={{
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </span>
        ) : (
          title
        )}
      </h2>

      {/* Subtitle */}
      <p
        className="beat-subtitle"
        style={{
          maxWidth: '38ch',
          textShadow: '0 2px 20px rgba(0,0,0,0.9)',
        }}
      >
        {subtitle}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Cursor Glow                                                */
/* ─────────────────────────────────────────────────────────── */
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.transform = `translate(${posRef.current.x - 200}px, ${posRef.current.y - 200}px)`;
        }
        rafRef.current = null;
      });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-40"
      style={{
        background:
          'radial-gradient(circle, rgba(74,124,89,0.06) 0%, rgba(201,168,76,0.03) 40%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main Component                                             */
/* ─────────────────────────────────────────────────────────── */
export default function MatchaSequence() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(-1);
  const dprRef = useRef<number>(1);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const { scrollYProgress } = useScroll({ target: wrapperRef });
  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

  /* ── Preload ─────────────────────────────────────────────── */
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameName(i);
      const finish = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT) {
          setIsLoaded(true);
          // brief pause to let state settle then remove loading screen
          setTimeout(() => setShowIntro(false), 400);
        }
      };
      img.onload = finish;
      img.onerror = finish;
      images[i - 1] = img;
    }
  }, []);

  /* ── Draw ────────────────────────────────────────────────── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img?.complete || !img.naturalWidth) return;

    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.min(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    const dpr = dprRef.current;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  }, []);

  /* ── Scroll → frame ─────────────────────────────────────── */
  useEffect(() => {
    if (!isLoaded) return;

    const unsub = frameIndex.on('change', (v) => {
      const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(v)));
      if (idx === lastFrameRef.current) return;
      lastFrameRef.current = idx;

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(idx);
        rafRef.current = null;
      });
    });

    drawFrame(0);

    return () => {
      unsub();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded, frameIndex, drawFrame]);

  /* ── Resize ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!isLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      drawFrame(Math.max(0, lastFrameRef.current));
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    return () => ro.disconnect();
  }, [isLoaded, drawFrame]);

  /* ── Scroll cue ─────────────────────────────────────────── */
  const cueOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);
  const progressScale = smoothProgress;

  /* ───────────────────────────────────────────────────────────
   *  Loading Screen
   * ───────────────────────────────────────────────────────── */
  return (
    <>
      <CursorGlow />

      {/* Loading overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] z-[100]"
          >
            {/* Animated ring */}
            <div className="relative w-16 h-16 mb-10">
              <svg
                className="animate-spin w-16 h-16"
                viewBox="0 0 64 64"
                fill="none"
                style={{ animationDuration: '2s' }}
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1.5"
                />
                <path
                  d="M32 4a28 28 0 0 1 28 28"
                  stroke="url(#ring-grad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="ring-grad"
                    x1="32"
                    y1="4"
                    x2="60"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#c9a84c" />
                    <stop offset="1" stopColor="#e8c97a" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Centre dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#c9a84c' }}
                />
              </div>
            </div>

            <p className="beat-label mb-7">Preparing your experience</p>

            {/* Track */}
            <div className="loading-bar-track">
              <div
                className="loading-bar-fill"
                style={{ width: `${loadProgress}%` }}
              />
            </div>

            <p className="mt-5 text-white/15 text-xs font-light tracking-widest tabular-nums">
              {loadProgress}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Scroll Container ──────────────────────────── */}
      <div ref={wrapperRef} className="relative" style={{ height: '500vh' }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: 'block' }}
          />

          {/* ── Beat A: Hero (0–18%) ────────────────────────── */}
          <TextBeat
            scrollYProgress={smoothProgress}
            start={0}
            end={0.20}
            align="center"
            label="Coffee & Matcha"
            title="Pure Matcha. Pure Moment."
            subtitle="Crafted for those who demand more from every sip."
            accent
          />

          {/* ── Beat B: Explosion (26–46%) ─────────────────── */}
          <TextBeat
            scrollYProgress={smoothProgress}
            start={0.26}
            end={0.46}
            align="left"
            label="Layers Revealed"
            title="Cold. Bold. Brilliant."
            subtitle="Watch our signature matcha erupt — layers of golden caramel, velvet milk, and whole-leaf green tea in free fall."
          />

          {/* ── Beat C: Drama (52–72%) ─────────────────────── */}
          <TextBeat
            scrollYProgress={smoothProgress}
            start={0.52}
            end={0.72}
            align="right"
            label="The Ritual"
            title="Crafted in Chaos."
            subtitle="Every pour is a controlled detonation. Ice, espresso, and ancient matcha collide at the speed of craving."
          />

          {/* ── Beat D: CTA (77–96%) ───────────────────────── */}
          <TextBeat
            scrollYProgress={smoothProgress}
            start={0.77}
            end={0.97}
            align="center"
            label="Order Now"
            title="Your cup awaits."
            subtitle="The finest iced matcha latte. Nothing else comes close."
            accent
          />

          {/* ── Scroll cue ──────────────────────────────────── */}
          <motion.div
            style={{ opacity: cueOpacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-none select-none"
          >
            <p className="beat-label" style={{ letterSpacing: '0.3em' }}>
              Scroll to explore
            </p>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 3v10M4 8l5 5 5-5"
                  stroke="rgba(201,168,76,0.55)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* ── Scroll progress bar ──────────────────────────── */}
          <motion.div
            className="absolute bottom-0 left-0 h-px"
            style={{
              scaleX: progressScale,
              transformOrigin: 'left',
              width: '100%',
              background:
                'linear-gradient(90deg, transparent, #c9a84c 30%, #e8c97a 70%, transparent)',
            }}
          />
        </div>
      </div>
    </>
  );
}
