'use client';
import { motion } from 'framer-motion';

export default function BackgroundDecor() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden', background: '#F4F1EA' }}>
      {/* Top Right Glow — teal */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 80, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="medical-blob"
        style={{
          top: '-100px', right: '-100px', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(14,124,107,0.16) 0%, transparent 70%)',
          opacity: 0.7
        }}
      />

      {/* Bottom Left Glow — gold */}
      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, -100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="medical-blob"
        style={{
          bottom: '-200px', left: '-200px', width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(245,197,24,0.14) 0%, transparent 70%)',
          opacity: 0.7
        }}
      />

      {/* Paper dot texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5,
        backgroundImage: 'radial-gradient(#d8d1bf 1px, transparent 1px)',
        backgroundSize: '22px 22px'
      }} />
    </div>
  );
}
