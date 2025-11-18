import React, { useEffect, useRef } from 'react';

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; z: number; size: number }[] = [];
    const numStars = 400;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width - canvas.width / 2,
          y: Math.random() * canvas.height - canvas.height / 2,
          z: Math.random() * 2000,
          size: Math.random() * 2
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = '#050511'; // Match bg-space-900
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      stars.forEach(star => {
        // Move star closer
        star.z -= 2; // Speed

        // Reset if too close or out of bounds
        if (star.z <= 0) {
          star.z = 2000;
          star.x = Math.random() * canvas.width - cx;
          star.y = Math.random() * canvas.height - cy;
        }

        // Project 3D to 2D
        const scale = 500 / star.z;
        const x2d = cx + star.x * scale;
        const y2d = cy + star.y * scale;
        const s2d = star.size * scale;

        // Draw star
        const alpha = Math.min(1, (2000 - star.z) / 1000);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.arc(x2d, y2d, s2d, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initStars();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default StarField;
