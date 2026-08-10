import { useEffect, useRef } from "react";

type Props = { density?: number; className?: string };

/**
 * A dramatic storm animation: swirling gold-dust vortex, drifting storm
 * bands, occasional lightning flashes and a faint network of connecting
 * nodes. Drawn on a single canvas for performance.
 */
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
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = {
      x: number;
      y: number;
      // base position so we can swirl around it
      bx: number;
      by: number;
      // angle on the vortex
      ang: number;
      // radius from vortex center
      rad: number;
      // angular velocity
      sp: number;
      // vertical drift
      vy: number;
      r: number;
      a: number;
      node: boolean;
    };
    let parts: P[] = [];

    // lightning state
    let flash = 0;
    let nextFlash = 220 + Math.random() * 400;
    let bolt: { x1: number; y1: number; x2: number; y2: number } | null = null;

    let cx = 0;
    let cy = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w * 0.5;
      cy = h * 0.42;
      const count = Math.round(Math.min(180, (w * h) / 9000) * density);
      parts = Array.from({ length: count }, (_, i) => {
        const rad = Math.random() * Math.max(w, h) * 0.55 + 20;
        const ang = Math.random() * Math.PI * 2;
        const bx = cx + Math.cos(ang) * rad;
        const by = cy + Math.sin(ang) * rad;
        return {
          x: bx,
          y: by,
          bx,
          by,
          ang,
          rad,
          // outer particles spin slower, inner faster — like a storm
          sp: (0.0016 + Math.random() * 0.004) * (1 - rad / (Math.max(w, h) * 0.7)),
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.4,
          a: 0.18 + Math.random() * 0.5,
          node: i % 5 === 0,
        };
      });
    };

    const drawLightning = () => {
      if (!bolt) return;
      // main jagged bolt
      ctx.save();
      ctx.strokeStyle = `rgba(245, 230, 180, ${0.5 * flash})`;
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 16;
      ctx.shadowColor = `rgba(240, 210, 130, ${0.8 * flash})`;
      ctx.beginPath();
      let x = bolt.x1;
      let y = bolt.y1;
      ctx.moveTo(x, y);
      const steps = 6;
      for (let i = 1; i <= steps; i++) {
        const px = bolt.x1 + (bolt.x2 - bolt.x1) * (i / steps);
        const py = bolt.y1 + (bolt.y2 - bolt.y1) * (i / steps);
        x = px + (Math.random() - 0.5) * 40;
        y = py;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      t += 1;
      // translucent fill creates motion trails for a stormy feel
      ctx.fillStyle = "rgba(10, 8, 6, 0.16)";
      ctx.fillRect(0, 0, w, h);

      // breathing storm core glow
      const pulse = 0.5 + Math.sin(t * 0.012) * 0.12;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
      grd.addColorStop(0, `rgba(120, 92, 40, ${0.12 * pulse})`);
      grd.addColorStop(0.5, "rgba(60, 45, 20, 0.05)");
      grd.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // lightning timing
      nextFlash -= 1;
      if (nextFlash <= 0) {
        flash = 1;
        nextFlash = 320 + Math.random() * 520;
        bolt = {
          x1: Math.random() * w,
          y1: 0,
          x2: Math.random() * w,
          y2: h * (0.5 + Math.random() * 0.4),
        };
      }
      if (flash > 0) {
        // full-screen flash overlay
        ctx.fillStyle = `rgba(255, 244, 214, ${0.06 * flash})`;
        ctx.fillRect(0, 0, w, h);
        drawLightning();
        flash -= 0.04;
      }

      const nodes: P[] = [];

      for (const p of parts) {
        // swirl around vortex center
        p.ang += p.sp;
        // slight radial breathing so the storm expands/contracts
        const breathe = Math.sin(t * 0.006 + p.rad * 0.01) * 6;
        const rad = p.rad + breathe;
        const nx = cx + Math.cos(p.ang) * rad;
        const ny = cy + Math.sin(p.ang) * rad * 0.62 + p.vy * t * 0.01;
        p.x = nx;
        p.y = ny;

        // wrap vertically
        if (p.y > h + 10) p.y = -10;
        if (p.y < -10) p.y = h + 10;

        if (p.node) nodes.push(p);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.node ? p.r + 0.7 : p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.node
          ? `rgba(244, 208, 120, ${p.a})`
          : `rgba(196, 158, 84, ${p.a * 0.7})`;
        ctx.shadowBlur = p.node ? 12 : 0;
        ctx.shadowColor = "rgba(230, 190, 110, 0.55)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // network links between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]!;
          const b = nodes[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 150) {
            ctx.strokeStyle = `rgba(212, 175, 90, ${0.14 * (1 - d / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
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
