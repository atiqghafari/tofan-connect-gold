import { useEffect, useRef } from "react";

type Props = { density?: number; className?: string };

export function StormNetwork({ density = 1, className }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; node: boolean };
    let parts: P[] = [];

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(140, (w * h) / 11000) * density);
      parts = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0.15 + Math.random() * 0.55,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.5,
        a: 0.25 + Math.random() * 0.55,
        node: i % 4 === 0,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const nodes = parts.filter((p) => p.node);

      // network links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(212, 175, 90, ${0.16 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy + Math.sin((p.x + p.y) / 120) * 0.18;
        if (p.x > w + 8) p.x = -8;
        if (p.y > h + 8) p.y = -8;
        if (p.y < -8) p.y = h + 8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.node ? p.r + 0.6 : p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.node
          ? `rgba(240, 205, 120, ${p.a})`
          : `rgba(196, 158, 84, ${p.a * 0.75})`;
        ctx.shadowBlur = p.node ? 10 : 0;
        ctx.shadowColor = "rgba(230, 190, 110, 0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    };

    build();
    draw();
    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}