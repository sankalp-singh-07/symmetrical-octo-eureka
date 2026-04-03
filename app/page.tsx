'use client';

import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';

const MatchaSequence = dynamic(() => import('@/components/MatchaSequence'), { ssr: false });

/* ── Navbar ───────────────────────────────────────────────── */
function Navbar() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 100], ['rgba(5,5,5,0)', 'rgba(5,5,5,0.85)']);
  const blur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)']);

  return (
    <motion.nav
      style={{ backgroundColor: bg, backdropFilter: blur }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 py-5 border-b border-white/[0.04]"
    >
      <a href="#" className="flex items-center gap-2 group">
        {/* Leaf icon */}
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 2C6 2 2 6 2 11c0 3 1.5 5.5 3.8 7L11 11l5.2 7C18.5 16.5 20 14 20 11c0-5-4-9-9-9z"
            fill="url(#leaf-grad)"
          />
          <defs>
            <linearGradient id="leaf-grad" x1="2" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4a7c59" />
              <stop offset="1" stopColor="#c9a84c" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">Coffee & Matcha</span>
      </a>

      <div className="hidden md:flex items-center gap-10">
        {['Menu', 'Story', 'Locations'].map((item) => (
          <a
            key={item}
            href="#"
            className="text-white/40 hover:text-white/80 text-xs tracking-widest uppercase transition-colors duration-300"
          >
            {item}
          </a>
        ))}
      </div>

      <a
        href="#"
        className="relative text-xs tracking-widest uppercase px-5 py-2.5 border border-[#c9a84c]/40 text-[#c9a84c] hover:border-[#c9a84c] hover:text-[#e8c97a] transition-all duration-300 rounded-sm overflow-hidden group"
      >
        <span className="relative z-10">Order Now</span>
        <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/10 transition-colors duration-300" />
      </a>
    </motion.nav>
  );
}

/* ── After-scroll CTA Section ─────────────────────────────── */
function CtaSection() {
  return (
    <section className="relative bg-[#050505] min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4a7c59]/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#c9a84c]/6 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center"
      >
        <p className="beat-label mb-6">The Signature Drink</p>
        <h2 className="beat-title mb-8" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
          Iced Matcha<br />
          <span
            className="inline-block"
            style={{
              background: 'linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Latte.
          </span>
        </h2>
        <p className="beat-subtitle mb-14" style={{ maxWidth: '44ch' }}>
          Whole-leaf Japanese matcha. Golden caramel drizzle.<br />
          Perfectly chilled. Impossible to resist.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#"
            className="group relative inline-flex items-center gap-3 px-9 py-4 bg-[#c9a84c] text-[#050505] text-sm font-semibold tracking-widest uppercase rounded-sm overflow-hidden transition-all duration-500 hover:bg-[#e8c97a]"
          >
            <span>Order Now</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-9 py-4 border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 text-sm tracking-widest uppercase rounded-sm transition-all duration-300"
          >
            Explore Menu
          </a>
        </div>
      </motion.div>

      {/* Divider line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.04] px-8 md:px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-white/20 text-xs tracking-widest uppercase">
        © 2025 Coffee & Matcha. All rights reserved.
      </p>
      <div className="flex items-center gap-8">
        {['Privacy', 'Terms', 'Instagram'].map((item) => (
          <a key={item} href="#" className="text-white/20 hover:text-white/50 text-xs tracking-widest uppercase transition-colors duration-300">
            {item}
          </a>
        ))}
      </div>
    </footer>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="relative bg-[#050505]">
      <Navbar />
      <MatchaSequence />
      <CtaSection />
      <Footer />
    </main>
  );
}
