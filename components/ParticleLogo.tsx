
import React, { useEffect, useRef, useState } from 'react';

const ParticleLogo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: LogoParticle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 26, zoom: 1.5 };
    const text = "EditorialAI";
    const displayWidth = 160;
    const displayHeight = 40;

    class LogoParticle {
      homeX: number;
      homeY: number;
      x: number;
      y: number;
      vx: number = 0;
      vy: number = 0;
      size: number;
      color: string;

      constructor(hx: number, hy: number) {
        this.homeX = hx;
        this.homeY = hy;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 22 + 8;
        this.x = hx + Math.cos(angle) * radius;
        this.y = hy + Math.sin(angle) * radius;
        this.size = 0.35 + Math.random() * 0.25;
        this.color = '#111111';
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const ax = (dx / dist) * force * 4;
          const ay = (dy / dist) * force * 4;
          this.vx -= ax;
          this.vy -= ay;
        }

        const hdx = this.homeX - this.x;
        const hdy = this.homeY - this.y;
        this.vx += hdx * 0.16;
        this.vy += hdy * 0.16;

        this.vx *= 0.7;
        this.vy *= 0.7;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const zoomStrength = dist < mouse.radius
          ? 1 + (mouse.zoom - 1) * (1 - dist / mouse.radius)
          : 1;
        const zoomX = mouse.x + dx * zoomStrength;
        const zoomY = mouse.y + dy * zoomStrength;

        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(zoomX, zoomY, this.size * zoomStrength, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = async () => {
      if (document.fonts) {
        await document.fonts.load('600 24px Inter');
        await document.fonts.ready;
      }

      const dpr = window.devicePixelRatio || 1;
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H1',location:'ParticleLogo.tsx:94',message:'init_dimensions',data:{dpr,displayWidth,displayHeight},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log

      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sampleScale = 4;
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCanvas.width = displayWidth * sampleScale;
      tempCanvas.height = displayHeight * sampleScale;

      tempCtx.fillStyle = 'black';
      tempCtx.font = `600 ${20 * sampleScale}px Inter, sans-serif`;
      tempCtx.textBaseline = 'alphabetic';
      tempCtx.textAlign = 'left';

      const metrics = tempCtx.measureText(text);
      const ascent = metrics.actualBoundingBoxAscent || 0;
      const descent = metrics.actualBoundingBoxDescent || 0;
      const textHeight = ascent + descent;
      const topY = Math.max(0, (displayHeight * sampleScale - textHeight) / 2);
      const baselineY = topY + ascent;

      tempCtx.fillText(text, 2 * sampleScale, baselineY);
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H2',location:'ParticleLogo.tsx:118',message:'text_render_config',data:{text,baseline:'alphabetic',align:'left',font:tempCtx.font,offsetX:2*sampleScale,offsetY:baselineY},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log

      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const pixels = imageData.data;
      particles = [];

      const step = 0.7 * sampleScale;

      for (let y = 0; y < tempCanvas.height; y += step) {
        for (let x = 0; x < tempCanvas.width; x += step) {
          const px = Math.floor(x);
          const py = Math.floor(y);
          const index = (py * tempCanvas.width + px) * 4;
          const alpha = pixels[index + 3];

          if (alpha > 210) {
            particles.push(new LogoParticle(x / sampleScale, y / sampleScale));
          }
        }
      }
      // #region agent log
      const particleStats = particles.reduce((acc, p) => {
        acc.count += 1;
        acc.minY = Math.min(acc.minY, p.homeY);
        acc.maxY = Math.max(acc.maxY, p.homeY);
        return acc;
      }, { count: 0, minY: Number.POSITIVE_INFINITY, maxY: Number.NEGATIVE_INFINITY });

      const baselineYDisplay = baselineY / sampleScale;
      const maxTextY = baselineYDisplay + descent / sampleScale;
      // Avoid trimming away the lower edge of glyphs (can make the logo look "cut off").
      const bottomTrim = maxTextY + 0.6;
      particles = particles.filter((p) => p.homeY <= bottomTrim);

      const trimmedStats = particles.reduce((acc, p) => {
        acc.minY = Math.min(acc.minY, p.homeY);
        acc.maxY = Math.max(acc.maxY, p.homeY);
        return acc;
      }, { minY: Number.POSITIVE_INFINITY, maxY: Number.NEGATIVE_INFINITY });
      const paddingY = 3;
      const availableHeight = displayHeight - paddingY * 2;
      const particleHeight = trimmedStats.maxY - trimmedStats.minY;
      const shiftY = particleHeight > 0
        ? (paddingY + (availableHeight - particleHeight) / 2) - trimmedStats.minY
        : 0;
      if (shiftY !== 0) {
        particles.forEach((p) => {
          p.homeY += shiftY;
          p.y += shiftY;
        });
      }
      fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H3',location:'ParticleLogo.tsx:140',message:'particle_stats',data:particleStats,timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log

      setIsReady(true);
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H4',location:'ParticleLogo.tsx:146',message:'canvas_ready',data:{canvasWidth:canvas.width,canvasHeight:canvas.height,styleWidth:canvas.style.width,styleHeight:canvas.style.height},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
    };

    const animate = () => {
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    init().then(() => {
      animate();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="h-10 flex items-center justify-start overflow-visible min-w-[160px]">
      <canvas
        ref={canvasRef}
        className={`cursor-pointer transition-opacity duration-700 ease-out ${isReady ? 'opacity-100' : 'opacity-0'}`}
        style={{
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.02))',
          display: 'block',
        }}
      />
    </div>
  );
};

export default ParticleLogo;
