import React, { useRef, useEffect, useCallback } from 'react';

export type OverlayType = 'none' | 'thirds' | 'golden';

interface CompositionOverlayProps {
  overlayType: OverlayType;
}

const CompositionOverlay: React.FC<CompositionOverlayProps> = ({ overlayType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (overlayType === 'none') return;
    
    const { width: w, height: h } = canvas;

    if (overlayType === 'thirds') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w / 3, 0); ctx.lineTo(w / 3, h);
        ctx.moveTo(2 * w / 3, 0); ctx.lineTo(2 * w / 3, h);
        ctx.moveTo(0, h / 3); ctx.lineTo(w, h / 3);
        ctx.moveTo(0, 2 * h / 3); ctx.lineTo(w, 2 * h / 3);
        ctx.stroke();
    }

    if (overlayType === 'golden') {
        const phi = 1.618;
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(w / phi, 0); ctx.lineTo(w / phi, h);
        ctx.moveTo(w - (w / phi), 0); ctx.lineTo(w - (w / phi), h);
        ctx.moveTo(0, h / phi); ctx.lineTo(w, h / phi);
        ctx.moveTo(0, h - (h / phi)); ctx.lineTo(w, h - (h / phi));
        ctx.stroke();
    }
  }, [overlayType]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (canvas && parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      draw();
    }
  }, [draw]);

  useEffect(() => {
    if (canvasRef.current) {
        parentRef.current = canvasRef.current.parentElement as HTMLDivElement;
    }
    
    const observer = new ResizeObserver(resizeCanvas);
    if (parentRef.current) {
        observer.observe(parentRef.current);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (parentRef.current) {
        observer.unobserve(parentRef.current);
      }
    };
  }, [resizeCanvas]);

  useEffect(() => {
    draw();
  }, [overlayType, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute left-0 top-0 h-full w-full"
    />
  );
};

export default CompositionOverlay;
