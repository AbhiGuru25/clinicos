'use client';
import { motion } from 'framer-motion';

export default function BackgroundDecor() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden', background: '#F8FAFF' }}>
      {/* Top Right Blob */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, 80, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="medical-blob" 
        style={{ 
          top: '-100px', right: '-100px', width: '600px', height: '600px', 
          background: 'radial-gradient(circle, #BAE6FD 0%, transparent 70%)',
          opacity: 0.4
        }} 
      />
      
      {/* Bottom Left Blob */}
      <motion.div 
        animate={{ 
          x: [0, -60, 0],
          y: [0, -100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="medical-blob" 
        style={{ 
          bottom: '-200px', left: '-200px', width: '700px', height: '700px', 
          background: 'radial-gradient(circle, #CCFBF1 0%, transparent 70%)',
          opacity: 0.3
        }} 
      />

      {/* Center Subtle Grid */}
      <div className="bg-medical-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
    </div>
  );
}
