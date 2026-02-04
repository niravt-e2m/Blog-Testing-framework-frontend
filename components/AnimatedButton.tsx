import React, { useRef, useEffect, useCallback, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface AnimatedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ onClick, children, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [isHovering, setIsHovering] = useState(false);

  // Initialize particles spread across button
  const initParticles = useCallback((width: number, height: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      // Random direction with slow speed
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.2;
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 1.5,
        opacity: 0.5 + Math.random() * 0.3,
      });
    }
    
    particlesRef.current = newParticles;
  }, []);

  // Animate particles continuously
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Get current canvas dimensions each frame
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      // Invert molecule colors on hover: white on black, black on white
      const particleColor = isHovering ? '0, 0, 0' : '255, 255, 255';
      const lineColor = isHovering ? '0, 0, 0' : '255, 255, 255';

      particles.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges with padding
        if (p.x <= p.radius || p.x >= width - p.radius) {
          p.vx *= -1;
          p.x = Math.max(p.radius, Math.min(width - p.radius, p.x));
        }
        if (p.y <= p.radius || p.y >= height - p.radius) {
          p.vy *= -1;
          p.y = Math.max(p.radius, Math.min(height - p.radius, p.y));
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        particles.forEach((other, j) => {
          if (j <= i) return;
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${0.3 * (1 - dist / 60)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovering]);

  // Resize canvas and init particles
  useEffect(() => {
    if (!canvasRef.current || !buttonRef.current) return;
    
    const resizeCanvas = () => {
      if (!canvasRef.current || !buttonRef.current) return;
      const width = buttonRef.current.offsetWidth;
      const height = buttonRef.current.offsetHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      initParticles(width, height);
    };
    
    // Small delay to ensure button has rendered with correct dimensions
    const timer = setTimeout(resizeCanvas, 50);
    window.addEventListener('resize', resizeCanvas);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [initParticles]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ${
        isHovering 
          ? 'bg-white text-black' 
          : 'bg-black text-white'
      } ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />
      <span className="relative z-0">{children}</span>
    </button>
  );
};

export default AnimatedButton;
