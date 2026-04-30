'use client';
import { motion } from 'framer-motion';

export default function BackgroundDecor() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Top Right Blob */}
      <motion.div 
        animate={{ 
          x: [0, 30, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="medical-blob" 
        style={{ 
          top: '-100px', right: '-100px', width: '500px', height: '500px', 
          background: 'radial-gradient(circle, #BAE6FD 0%, transparent 70%)' 
        }} 
      />
      
      {/* Bottom Left Blob */}
      <motion.div 
        animate={{ 
          x: [0, -40, 0],
          y: [0, -60, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="medical-blob" 
        style={{ 
          bottom: '-200px', left: '-200px', width: '600px', height: '600px', 
          background: 'radial-gradient(circle, #CCFBF1 0%, transparent 70%)' 
        }} 
      />

      {/* Center Subtle Grid */}
      <div className="bg-medical-grid" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
    </div>
  );
}
