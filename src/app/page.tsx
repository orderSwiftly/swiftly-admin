'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const css = `
  .sw-main {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    background: var(--txt-clr);
    overflow: hidden;
  }

  /* ── Orbs ── */
  .sw-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.18;
    animation: swFloat 9s ease-in-out infinite;
    pointer-events: none;
  }
  .sw-orb-1 {
    width: 420px; height: 420px;
    background: var(--acc-clr);
    top: -12%; left: -8%;
    animation-duration: 10s;
  }
  .sw-orb-2 {
    width: 320px; height: 320px;
    background: var(--pry-clr, #4f46e5);
    bottom: -8%; right: -6%;
    animation-duration: 13s;
    animation-delay: -4s;
  }
  .sw-orb-3 {
    width: 180px; height: 180px;
    background: var(--sec-clr, #7c3aed);
    top: 45%; left: 65%;
    animation-duration: 8s;
    animation-delay: -6s;
  }
  @keyframes swFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(28px, -28px) scale(1.06); }
    66%       { transform: translate(-18px, 18px) scale(0.94); }
  }

  /* ── Grid ── */
  .sw-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.07;
    background-image:
      linear-gradient(var(--dark-bg, #111) 1px, transparent 1px),
      linear-gradient(90deg, var(--dark-bg, #111) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── Particles ── */
  .sw-particle {
    position: absolute;
    bottom: -10px;
    width: 3px; height: 3px;
    border-radius: 50%;
    background: var(--acc-clr);
    opacity: 0;
    pointer-events: none;
    animation: swRise linear infinite;
  }
  @keyframes swRise {
    0%   { transform: translateY(0) scale(1);   opacity: 0; }
    15%  { opacity: 0.7; }
    85%  { opacity: 0.2; }
    100% { transform: translateY(-100vh) scale(0.2); opacity: 0; }
  }

  /* ── Content wrapper ── */
  .sw-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  /* ── Badge ── */
  .sw-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 18px;
    border: 1px solid color-mix(in srgb, var(--dark-bg, #111) 40%, transparent);
    border-radius: 999px;
    opacity: 0;
    animation: swFadeUp 0.5s ease 0.1s forwards;
  }
  .sw-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--acc-clr);
    animation: swPulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes swPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.35; transform: scale(1.6); }
  }

  /* ── Title words ── */
  .sw-word {
    display: inline-block;
    opacity: 0;
    animation: swSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* ── Divider bar ── */
  .sw-bar {
    height: 3px;
    width: 0;
    opacity: 0;
    background: linear-gradient(90deg, transparent, var(--acc-clr), transparent);
    border-radius: 2px;
    transition: width 0.7s ease 0.55s, opacity 0.7s ease 0.55s;
  }
  .sw-bar.active {
    width: 180px;
    opacity: 1;
  }

  /* ── Login button ── */
  .sw-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 1.05rem;
    color: var(--acc-clr);
    padding: 11px 30px;
    border: 1.5px solid var(--acc-clr);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    opacity: 0;
    text-decoration: none;
    animation: swFadeUp 0.5s ease 0.65s forwards;
    transition: color 0.3s ease, gap 0.25s ease;
  }
  .sw-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--acc-clr);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 0;
  }
  .sw-btn:hover::before { transform: scaleX(1); }
  .sw-btn:hover {
    color: var(--txt-clr);
    gap: 14px;
    text-decoration: none;
  }
  .sw-btn span,
  .sw-btn svg {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
  }

  /* ── Shared keyframes ── */
  @keyframes swFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes swSlideUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 4.75) % 95}%`,
  delay: `${(i * 0.37) % 5}s`,
  duration: `${4 + (i * 0.6) % 6}s`,
}));

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <main className="sw-main">
        {/* Orbs */}
        <div className="sw-orb sw-orb-1" />
        <div className="sw-orb sw-orb-2" />
        <div className="sw-orb sw-orb-3" />

        {/* Grid */}
        <div className="sw-grid" />

        {/* Particles */}
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="sw-particle"
            style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }}
          />
        ))}

        {/* Content */}
        <div className="sw-content">

          {/* Badge */}
          <div className="sw-badge">
            <span className="sw-dot" />
            <span className="pry-ff text-sm tracking-widest uppercase text-[var(--dark-bg)] opacity-60">
              Admin Portal
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold sec-ff capitalize text-[var(--dark-bg)] text-center leading-tight px-4">
            <span className="sw-word" style={{ animationDelay: '0.15s' }}>Swiftly</span>{' '}
            <span className="sw-word" style={{ animationDelay: '0.28s' }}>admin</span>{' '}
            <span className="sw-word" style={{ animationDelay: '0.42s' }}>dashboard</span>
          </h1>

          {/* Bar */}
          <div className={`sw-bar${mounted ? ' active' : ''}`} />

          {/* Login */}
          <Link className="sw-btn pry-ff" href="/login">
            <span>Login</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

        </div>
      </main>
    </>
  );
}