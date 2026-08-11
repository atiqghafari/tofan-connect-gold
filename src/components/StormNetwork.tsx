import { useEffect, useRef } from "react";

type Props = { density?: number; className?: string };

/**
 * Full-screen tornado / vortex storm animation.
 *
 * A central rotating funnel built from multiple spiral arms of gold dust,
 * with debris particles spiraling inward and outward, drifting storm bands,
 * and occasional lightning flashes. A faint network of connecting nodes
 * weaves through the storm. Drawn on a single canvas for performance.
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
      arm: number;        // which spiral arm
      ang: number;        // current angle
      rad: number;        // distance from center
      sp: number;         // angular speed
      r: number;          // radius
      a: number;          // alpha
      node: boolean;
      drift: number;      // vertical drift
    };
    let parts: P[] = [];

    // lightning
    let flash = 0;
    let nextFlash = 280 + Math.random() * 500;
    let bolt: { x1: number; y1: number; x2: number; y2: number; segs: [number, number][] } | null = null;

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
      cy = h * 0.5;

      const arms = 5;
      // Capped lower count — the real storm video now carries the motion;
      // this canvas is just a subtle gold-dust overlay, so keep it light.
      const count = Math.round(Math.min(160, (w * h) / 11000) * density);
      parts = Array.from({ length: count }, (_, i) => {
        const arm = i % arms;
        const rad = Math.pow(Math.random(), 0.55) * Math.max(w, h) * 0.68;
        const ang = (arm / arms) * Math.PI * 2 + Math.random() * 0.7;
        return {
          arm,
          ang,
          rad,
          // inner particles spin much faster — logarithmic spiral
          sp: (0.004 + Math.random() * 0.006) * (1 - rad / (Math.max(w, h) * 0.85)) + 0.001,
          r: Math.random() * 1.7 + 0.35,
          a: 0.12 + Math.random() * 0.48,
          node: i % 8 === 0,
          drift: (Math.random() - 0.5) * 0.18,
        };
      });
    };

    const makeBolt = () => {
      const x1 = Math.random() * w;
      const x2 = x1 + (Math.random() - 0.5) * w * 0.5;
      const y2 = h * (0.45 + Math.random() * 0.4);
      const segs: [number, number][] = [[x1, 0]];
      const steps = 7;
      for (let s = 1; s <= steps; s++) {
        const px = x1 + (x2 - x1) * (s / steps) + (Math.random() - 0.5) * 50;
        const py = (y2 / steps) * s;
        segs.push([px, py]);
      }
      return { x1, y1: 0, x2, y2, segs };
    };

    const drawLightning = () => {
      if (!bolt) return;
      ctx.save();
      ctx.strokeStyle = `rgba(248, 236, 196, ${0.55 * flash})`;
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(240, 210, 130, ${0.85 * flash})`;
      const seg0 = bolt.segs[0]!;
      ctx.beginPath();
      ctx.moveTo(seg0[0], seg0[1]);
      for (let i = 1; i < bolt.segs.length; i++) {
        const s = bolt.segs[i]!;
        ctx.lineTo(s[0], s[1]);
      }
      ctx.stroke();
      // branch glow
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = `rgba(255, 248, 220, ${0.3 * flash})`;
      ctx.shadowBlur = 28;
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      t += 1;

      // translucent fill → motion trails for a stormy, dusty feel
      ctx.fillStyle = "rgba(8, 6, 5, 0.14)";
      ctx.fillRect(0, 0, w, h);

      // --- vortex funnel glow (the heart of the tornado) ---
      const breathe = 1 + Math.sin(t * 0.01) * 0.08;
      const maxR = Math.max(w, h) * 0.72 * breathe;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grd.addColorStop(0, "rgba(150, 116, 52, 0.16)");
      grd.addColorStop(0.25, "rgba(90, 68, 32, 0.09)");
      grd.addColorStop(0.6, "rgba(40, 30, 16, 0.04)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // --- funnel core: a brighter concentrated swirl at center ---
      const coreR = 30 + Math.sin(t * 0.02) * 8;
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 6);
      core.addColorStop(0, "rgba(255, 230, 160, 0.22)");
      core.addColorStop(0.4, "rgba(200, 160, 80, 0.08)");
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, w, h);

      // --- lightning ---
      nextFlash -= 1;
      if (nextFlash <= 0) {
        flash = 1;
        nextFlash = 380 + Math.random() * 620;
        bolt = makeBolt();
      }
      if (flash > 0) {
        ctx.fillStyle = `rgba(255, 246, 218, ${0.05 * flash})`;
        ctx.fillRect(0, 0, w, h);
        drawLightning();
        flash -= 0.035;
      }

      const nodes: P[] = [];
      const diag = Math.max(w, h);

      for (const p of parts) {
        p.ang += p.sp;
        // logarithmic breathing: particles drift in/out radially
        const radialBreathe = Math.sin(t * 0.005 + p.arm * 1.2) * 10;
        const rad = p.rad + radialBreathe;
        // slight vertical drift for falling-dust feel
        const yOff = Math.sin(t * 0.003 + p.rad * 0.008) * 14 + p.drift * t * 0.008;

        const x = cx + Math.cos(p.ang) * rad;
        const y = cy + Math.sin(p.ang) * rad * 0.58 + yOff;

        if (p.node) nodes.push(p);

        // alpha fades toward the edges for depth
        const depthA = p.a * (1 - Math.min(rad / (diag * 0.8), 0.6));

        ctx.beginPath();
        ctx.arc(x, y, p.node ? p.r + 0.8 : p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.node
          ? `rgba(246, 212, 128, ${depthA})`
          : `rgba(200, 162, 88, ${depthA * 0.72})`;
        // No per-particle shadowBlur — it forces expensive GPU blur passes on
        // every frame. Nodes get a brighter fill instead to keep the glow feel.
        ctx.fill();
      }

      // --- network links between nodes ---
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]!;
          const b = nodes[j]!;
          const ax = cx + Math.cos(a.ang) * a.rad;
          const ay = cy + Math.sin(a.ang) * a.rad * 0.58;
          const bx = cx + Math.cos(b.ang) * b.rad;
          const by = cy + Math.sin(b.ang) * b.rad * 0.58;
          const d = Math.hypot(ax - bx, ay - by);
          if (d < 160) {
            ctx.strokeStyle = `rgba(212, 175, 90, ${0.13 * (1 - d / 160)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
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
