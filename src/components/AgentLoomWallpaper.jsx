import React, { useEffect, useRef } from "react";
import { PRESENT_YEAR } from "../configs/portfolio";

const PRE_STEPS = 220;
const POST_STEPS = 96;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/** C2-continuous quintic smootherstep: zero 1st & 2nd derivatives at t=0 and t=1 */
function smootherstep(t) {
  const c = clamp(t, 0, 1);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/**
 * Precompute geometry for the 4-stage pipeline:
 *   [0 .. specX]        Single spec input trunk
 *   [specX .. gateX]    C2 fan-out + parallel horizontal sub-agent lanes
 *   [gateX .. mergeX]   Verified convergence curves (verified lanes -> MAIN)
 *   [mergeX .. width]   Unified bright silver main trunk
 */
function buildGeometry(width, height) {
  const isCompact = width < 700;
  const cy = height * 0.5;

  const specX = Math.round(width * (isCompact ? 0.11 : 0.145));
  const fanEndX = Math.round(width * (isCompact ? 0.28 : 0.31));
  const gateX = Math.round(width * (isCompact ? 0.73 : 0.725));
  const mergeX = Math.round(width * (isCompact ? 0.88 : 0.865));

  // Central clear channel (+/-54px+) frames the DesktopHero watermark cleanly
  const maxSpread = clamp(height * 0.33, isCompact ? 124 : 180, isCompact ? 168 : 244);
  const normalizedOffsets = isCompact
    ? [-1, -0.65, -0.34, 0.34, 0.65, 1]
    : [-1, -0.79, -0.59, -0.41, -0.25, 0.25, 0.41, 0.59, 0.79, 1];

  const fanSpan = Math.max(1, fanEndX - specX);
  const preSpan = Math.max(1, gateX - specX);
  const postSpan = Math.max(1, mergeX - gateX);

  const lanes = normalizedOffsets.map((norm, idx) => {
    const targetY = cy + norm * maxSpread;
    const absNorm = Math.abs(norm);
    // Outermost pair are dedicated outlier branches that terminate at the CI gate
    const isOutlierTrack = absNorm > 0.92;
    const isOuter = absNorm > 0.7;

    const preGate = new Float32Array((PRE_STEPS + 1) * 2);
    for (let i = 0; i <= PRE_STEPS; i++) {
      const u = i / PRE_STEPS;
      const x = specX + preSpan * u;
      const fanT = (x - specX) / fanSpan;
      const y = fanT < 1 ? cy + (targetY - cy) * smootherstep(fanT) : targetY;
      preGate[i * 2] = x;
      preGate[i * 2 + 1] = y;
    }

    const postGate = new Float32Array((POST_STEPS + 1) * 2);
    for (let i = 0; i <= POST_STEPS; i++) {
      const t = i / POST_STEPS;
      const x = gateX + postSpan * t;
      const y = targetY + (cy - targetY) * smootherstep(t);
      postGate[i * 2] = x;
      postGate[i * 2 + 1] = y;
    }

    return {
      idx,
      norm,
      y: targetY,
      isOuter,
      isOutlierTrack,
      preGate,
      preGateCount: PRE_STEPS + 1,
      postGate,
      postGateCount: POST_STEPS + 1
    };
  });

  const gateTop = Math.max(44, cy - maxSpread - 36);
  const gateBottom = Math.min(height - 92, cy + maxSpread + 36);

  return {
    width,
    height,
    cy,
    specX,
    fanEndX,
    gateX,
    mergeX,
    gateTop,
    gateBottom,
    isCompact,
    lanes
  };
}

function samplePolyline(pts, count, u, out) {
  const clamped = clamp(u, 0, 1);
  const f = clamped * (count - 1);
  const i0 = Math.floor(f);
  const i1 = Math.min(count - 1, i0 + 1);
  const frac = f - i0;
  out.x = pts[i0 * 2] + (pts[i1 * 2] - pts[i0 * 2]) * frac;
  out.y = pts[i0 * 2 + 1] + (pts[i1 * 2 + 1] - pts[i0 * 2 + 1]) * frac;
}

/**
 * Parallel Agents & Verification Loom
 * Monochrome graphite-silver live canvas backdrop representing parallel AI sub-agent
 * execution bounded by deterministic specs, tests, and CI verification gates.
 */
export default function AgentLoomWallpaper({
  timeMachineYear = PRESENT_YEAR,
  style
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const yearRef = useRef(timeMachineYear);
  yearRef.current = timeMachineYear;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = reducedMotionQuery.matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let geom = buildGeometry(
      container.clientWidth || window.innerWidth,
      container.clientHeight || window.innerHeight
    );

    const pointer = {
      x: -9999,
      y: -9999,
      smoothX: -9999,
      smoothY: -9999,
      active: false
    };

    const agents = [];
    const gateFlashes = [];
    const trunkPulses = [];
    const specPulses = [];
    let batchCooldown = 0.25;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, container.clientWidth || window.innerWidth);
      const h = Math.max(1, container.clientHeight || window.innerHeight);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      geom = buildGeometry(w, h);
    };

    resize();

    const getActiveLaneIndices = () => {
      const yearDelta = clamp(PRESENT_YEAR - yearRef.current, 0, 4);
      const total = geom.lanes.length;
      const dropPairs = Math.min(Math.floor(total / 2) - 1, yearDelta);
      const minIdx = dropPairs;
      const maxIdx = total - 1 - dropPairs;
      const indices = [];
      for (let i = minIdx; i <= maxIdx; i++) indices.push(i);
      return indices;
    };

    const spawnBatch = (initialProgress = null) => {
      const activeIndices = getActiveLaneIndices();
      if (!activeIndices.length) return;

      const desired = clamp(
        Math.round(activeIndices.length * (0.62 + Math.random() * 0.28)),
        3,
        activeIndices.length
      );

      const shuffled = [...activeIndices];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = tmp;
      }
      const chosen = shuffled.slice(0, desired);

      if (initialProgress === null) {
        specPulses.push({ t: 0 });
      }

      let hasPassingInWave = false;
      chosen.forEach((laneIdx, orderIdx) => {
        const lane = geom.lanes[laneIdx];
        let willPass;
        if (lane.isOutlierTrack) {
          willPass = false;
        } else if (!hasPassingInWave && orderIdx === chosen.length - 1) {
          willPass = true;
        } else {
          willPass = Math.random() > (lane.isOuter ? 0.3 : 0.12);
        }
        if (willPass) hasPassingInWave = true;

        agents.push({
          laneIdx,
          phase: "pre",
          u:
            initialProgress !== null
              ? initialProgress * (0.76 + Math.random() * 0.24)
              : -orderIdx * 0.025,
          speed: 0.23 + Math.random() * 0.075,
          willPass,
          fade: 1,
          trailLen: 0.16 + Math.random() * 0.06,
          postSpeed: 0.62 + Math.random() * 0.13
        });
      });
    };

    // Seed staggered waves in flight so frame 0 has activity across all stages
    spawnBatch(0.88);
    spawnBatch(0.44);
    trunkPulses.push({ t: 0.28 });

    const ptA = { x: 0, y: 0 };
    const ptB = { x: 0, y: 0 };

    const applyCursorWarp = (x, y) => {
      if (!pointer.active) return y;
      const dx = x - pointer.smoothX;
      const dy = y - pointer.smoothY;
      const radius = 160;
      const distSq = dx * dx + dy * dy;
      if (distSq >= radius * radius || distSq < 1) return y;

      const distSpec = Math.min(1, Math.abs(x - geom.specX) / 36);
      const distGate = Math.min(1, Math.abs(x - geom.gateX) / 28);
      const distMerge = Math.min(1, Math.abs(x - geom.mergeX) / 36);
      const pinFactor = distSpec * distGate * distMerge;
      if (pinFactor <= 0.01) return y;

      const dist = Math.sqrt(distSq);
      const falloff = 1 - dist / radius;
      const push = falloff * falloff * 3.4 * pinFactor;
      return y + (dy / dist) * push;
    };

    const cursorProximityBoost = (x, y) => {
      if (!pointer.active) return 0;
      const dx = x - pointer.smoothX;
      const dy = y - pointer.smoothY;
      const radius = 180;
      const distSq = dx * dx + dy * dy;
      if (distSq >= radius * radius) return 0;
      const f = 1 - Math.sqrt(distSq) / radius;
      return f * f * 0.14;
    };

    const drawStaticArchitecture = () => {
      const { width, cy, specX, gateX, mergeX, gateTop, gateBottom, lanes, isCompact } = geom;
      const activeSet = new Set(getActiveLaneIndices());

      // 1. Input Spec Trunk [0 -> specX]
      const inGrad = ctx.createLinearGradient(0, cy, specX, cy);
      inGrad.addColorStop(0, "rgba(148, 163, 184, 0.04)");
      inGrad.addColorStop(0.5, "rgba(203, 213, 225, 0.20)");
      inGrad.addColorStop(1, "rgba(241, 245, 249, 0.36)");
      ctx.strokeStyle = inGrad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(specX, cy);
      ctx.stroke();

      // 2. Parallel Sub-Agent Lanes & Verified Post-Gate Convergence Curves
      lanes.forEach((lane) => {
        const isActive = activeSet.has(lane.idx);
        const baseAlpha = isActive
          ? lane.isOutlierTrack
            ? 0.085
            : lane.isOuter
              ? 0.115
              : 0.145
          : 0.032;

        const midBoost = cursorProximityBoost((specX + gateX) * 0.5, lane.y);

        if (lane.isOutlierTrack) {
          const outGrad = ctx.createLinearGradient(specX, lane.y, gateX, lane.y);
          const a = baseAlpha + midBoost;
          outGrad.addColorStop(0, `rgba(176, 188, 204, ${a.toFixed(3)})`);
          outGrad.addColorStop(0.75, `rgba(176, 188, 204, ${(a * 0.92).toFixed(3)})`);
          outGrad.addColorStop(1, `rgba(176, 188, 204, ${(a * 0.42).toFixed(3)})`);
          ctx.strokeStyle = outGrad;
        } else {
          ctx.strokeStyle = `rgba(186, 198, 214, ${(baseAlpha + midBoost).toFixed(3)})`;
        }

        ctx.lineWidth = 1;
        ctx.beginPath();
        const stepStride = 3;
        for (let i = 0; i < lane.preGateCount; i += stepStride) {
          const px = lane.preGate[i * 2];
          const py = applyCursorWarp(px, lane.preGate[i * 2 + 1]);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        const lastIdx = lane.preGateCount - 1;
        ctx.lineTo(lane.preGate[lastIdx * 2], lane.preGate[lastIdx * 2 + 1]);
        ctx.stroke();

        // Only verified non-outlier lanes converge past the CI gate into MAIN
        if (!lane.isOutlierTrack) {
          const postAlpha = isActive ? (lane.isOuter ? 0.12 : 0.165) : 0.03;
          const convGrad = ctx.createLinearGradient(gateX, lane.y, mergeX, cy);
          convGrad.addColorStop(0, `rgba(203, 213, 225, ${postAlpha.toFixed(3)})`);
          convGrad.addColorStop(1, `rgba(248, 250, 252, ${(postAlpha * 1.55).toFixed(3)})`);
          ctx.strokeStyle = convGrad;
          ctx.beginPath();
          for (let i = 0; i < lane.postGateCount; i += 2) {
            const px = lane.postGate[i * 2];
            const py = applyCursorWarp(px, lane.postGate[i * 2 + 1]);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          const pLast = lane.postGateCount - 1;
          ctx.lineTo(lane.postGate[pLast * 2], lane.postGate[pLast * 2 + 1]);
          ctx.stroke();
        }
      });

      // 3. Vertical CI Verification Gate Hairline at gateX
      // Subtle optical gate aura
      const gateAura = ctx.createLinearGradient(gateX, gateTop, gateX, gateBottom);
      gateAura.addColorStop(0, "rgba(226, 232, 240, 0)");
      gateAura.addColorStop(0.5, "rgba(226, 232, 240, 0.045)");
      gateAura.addColorStop(1, "rgba(226, 232, 240, 0)");
      ctx.strokeStyle = gateAura;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(gateX + 0.5, gateTop);
      ctx.lineTo(gateX + 0.5, gateBottom);
      ctx.stroke();

      // Razor-sharp vertical gate hairline
      const gateGrad = ctx.createLinearGradient(gateX, gateTop, gateX, gateBottom);
      gateGrad.addColorStop(0, "rgba(226, 232, 240, 0)");
      gateGrad.addColorStop(0.12, "rgba(226, 232, 240, 0.24)");
      gateGrad.addColorStop(0.5, "rgba(248, 250, 252, 0.36)");
      gateGrad.addColorStop(0.88, "rgba(226, 232, 240, 0.24)");
      gateGrad.addColorStop(1, "rgba(226, 232, 240, 0)");

      ctx.strokeStyle = gateGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gateX + 0.5, gateTop);
      ctx.lineTo(gateX + 0.5, gateBottom);
      ctx.stroke();

      // Crisp intersection ticks along the CI gate
      lanes.forEach((lane) => {
        if (!activeSet.has(lane.idx)) return;
        const boost = cursorProximityBoost(gateX, lane.y);
        const tickAlpha = (lane.isOutlierTrack ? 0.24 : 0.42) + boost * 1.4;
        ctx.strokeStyle = `rgba(241, 245, 249, ${tickAlpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const halfTick = lane.isOutlierTrack ? 3 : 4;
        ctx.moveTo(gateX - halfTick, lane.y);
        ctx.lineTo(gateX + (lane.isOutlierTrack ? 0.5 : halfTick), lane.y);
        ctx.stroke();
      });

      // 4. Unified Bright Silver Trunk [mergeX -> width]
      const glowGrad = ctx.createLinearGradient(mergeX, cy, width, cy);
      glowGrad.addColorStop(0, "rgba(248, 250, 252, 0.18)");
      glowGrad.addColorStop(0.55, "rgba(226, 232, 240, 0.10)");
      glowGrad.addColorStop(1, "rgba(226, 232, 240, 0.02)");
      ctx.strokeStyle = glowGrad;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(mergeX, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      const trunkGrad = ctx.createLinearGradient(mergeX, cy, width, cy);
      trunkGrad.addColorStop(0, "rgba(255, 255, 255, 0.72)");
      trunkGrad.addColorStop(0.6, "rgba(241, 245, 249, 0.50)");
      trunkGrad.addColorStop(1, "rgba(203, 213, 225, 0.18)");
      ctx.strokeStyle = trunkGrad;
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(mergeX, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      // 5. Spec & Merge Precision Nodes
      const drawNode = (nx, ny, outerR, innerR, ringAlpha, coreAlpha) => {
        ctx.strokeStyle = `rgba(241, 245, 249, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(nx, ny, outerR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${coreAlpha})`;
        ctx.beginPath();
        ctx.arc(nx, ny, innerR, 0, Math.PI * 2);
        ctx.fill();
      };

      drawNode(specX, cy, 6.5, 2.3, 0.36, 0.72);
      drawNode(mergeX, cy, 8, 2.8, 0.50, 0.94);

      // 6. Technical monospace micro-labels
      if (!isCompact) {
        ctx.font = '500 10px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.textAlign = "center";

        ctx.fillStyle = "rgba(186, 198, 214, 0.34)";
        ctx.fillText("SPEC", specX, cy - 16);

        ctx.fillStyle = "rgba(214, 224, 236, 0.38)";
        ctx.fillText("CI · GATE", gateX, gateTop - 10);

        ctx.fillStyle = "rgba(248, 250, 252, 0.44)";
        ctx.fillText("MAIN", mergeX, cy - 17);
      }
    };

    const drawFilament = (pts, count, headU, tailU, alpha, tier, warp) => {
      const u0 = clamp(tailU, 0, 1);
      const u1 = clamp(headU, 0, 1);
      if (u1 - u0 < 0.003 || alpha <= 0.01) return;

      samplePolyline(pts, count, u0, ptA);
      samplePolyline(pts, count, u1, ptB);

      const x0 = ptA.x;
      const y0 = warp ? applyCursorWarp(ptA.x, ptA.y) : ptA.y;
      const x1 = ptB.x;
      const y1 = warp ? applyCursorWarp(ptB.x, ptB.y) : ptB.y;

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      if (tier === "verified") {
        grad.addColorStop(0, "rgba(241, 245, 249, 0)");
        grad.addColorStop(0.55, `rgba(241, 245, 249, ${(alpha * 0.58).toFixed(3)})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${(alpha * 0.95).toFixed(3)})`);
      } else if (tier === "candidate") {
        grad.addColorStop(0, "rgba(148, 163, 184, 0)");
        grad.addColorStop(0.58, `rgba(214, 224, 236, ${(alpha * 0.42).toFixed(3)})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${(alpha * 0.80).toFixed(3)})`);
      } else {
        grad.addColorStop(0, "rgba(148, 163, 184, 0)");
        grad.addColorStop(0.62, `rgba(176, 188, 204, ${(alpha * 0.28).toFixed(3)})`);
        grad.addColorStop(1, `rgba(226, 232, 240, ${(alpha * 0.54).toFixed(3)})`);
      }

      ctx.strokeStyle = grad;
      ctx.lineWidth = tier === "verified" ? 1.6 : 1.25;
      ctx.beginPath();

      const segs = 16;
      for (let s = 0; s <= segs; s++) {
        const us = u0 + (u1 - u0) * (s / segs);
        samplePolyline(pts, count, us, ptA);
        const py = warp ? applyCursorWarp(ptA.x, ptA.y) : ptA.y;
        if (s === 0) ctx.moveTo(ptA.x, py);
        else ctx.lineTo(ptA.x, py);
      }
      ctx.stroke();

      const headAlpha =
        tier === "verified" ? alpha * 0.96 : tier === "candidate" ? alpha * 0.82 : alpha * 0.52;
      ctx.fillStyle = `rgba(255, 255, 255, ${headAlpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x1, y1, tier === "verified" ? 1.75 : 1.45, 0, Math.PI * 2);
      ctx.fill();
    };

    let rafId = null;
    let lastTime = performance.now();

    const renderFrame = (now) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      if (pointer.active) {
        pointer.smoothX += (pointer.x - pointer.smoothX) * Math.min(1, dt * 10);
        pointer.smoothY += (pointer.y - pointer.smoothY) * Math.min(1, dt * 10);
      }

      ctx.clearRect(0, 0, geom.width, geom.height);
      drawStaticArchitecture();

      if (prefersReducedMotion) {
        const previewLanes = getActiveLaneIndices();
        previewLanes.forEach((idx, i) => {
          const lane = geom.lanes[idx];
          const pos = 0.36 + ((i * 0.15) % 0.48);
          drawFilament(
            lane.preGate,
            lane.preGateCount,
            pos,
            pos - 0.16,
            0.85,
            lane.isOutlierTrack ? "outlier" : "candidate",
            false
          );
        });
        return;
      }

      batchCooldown -= dt;
      if (batchCooldown <= 0) {
        spawnBatch(null);
        batchCooldown = 1.9 + Math.random() * 0.55;
      }

      // Input spec trunk lead-in pulses [0 -> specX]
      for (let i = specPulses.length - 1; i >= 0; i--) {
        const sp = specPulses[i];
        sp.t += dt * 1.65;
        if (sp.t >= 1.3) {
          specPulses.splice(i, 1);
          continue;
        }
        const headX = clamp(sp.t, 0, 1) * geom.specX;
        const tailX = clamp(sp.t - 0.38, 0, 1) * geom.specX;
        if (headX - tailX > 2) {
          const g = ctx.createLinearGradient(tailX, geom.cy, headX, geom.cy);
          g.addColorStop(0, "rgba(226, 232, 240, 0)");
          g.addColorStop(1, "rgba(255, 255, 255, 0.72)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tailX, geom.cy);
          ctx.lineTo(headX, geom.cy);
          ctx.stroke();
        }
      }

      // Update & draw parallel sub-agents
      for (let i = agents.length - 1; i >= 0; i--) {
        const a = agents[i];
        const lane = geom.lanes[a.laneIdx];
        if (!lane) {
          agents.splice(i, 1);
          continue;
        }

        if (a.phase === "pre") {
          a.u += dt * a.speed;
          if (a.u > 0) {
            drawFilament(
              lane.preGate,
              lane.preGateCount,
              Math.min(1, a.u),
              a.u - a.trailLen,
              1,
              a.willPass ? "candidate" : "outlier",
              true
            );
          }

          if (a.u >= 1) {
            if (a.willPass) {
              a.phase = "post";
              a.u = 0;
              gateFlashes.push({
                x: geom.gateX,
                y: lane.y,
                pass: true,
                t: 0
              });
            } else {
              a.phase = "hold";
              a.u = 1;
              gateFlashes.push({
                x: geom.gateX,
                y: lane.y,
                pass: false,
                t: 0
              });
            }
          }
        } else if (a.phase === "hold") {
          // Outlier branch cleanly halts & dissolves at the CI gate
          a.fade -= dt * 1.15;
          if (a.fade <= 0) {
            agents.splice(i, 1);
            continue;
          }
          const shrinkTail = 1 - a.trailLen * a.fade;
          drawFilament(
            lane.preGate,
            lane.preGateCount,
            1,
            shrinkTail,
            a.fade,
            "outlier",
            true
          );
        } else if (a.phase === "post") {
          a.u += dt * a.postSpeed;
          drawFilament(
            lane.postGate,
            lane.postGateCount,
            Math.min(1, a.u),
            a.u - 0.28,
            1,
            "verified",
            true
          );

          if (a.u >= 1) {
            trunkPulses.push({ t: 0 });
            agents.splice(i, 1);
          }
        }
      }

      // Draw CI Gate verification micro-signals
      for (let i = gateFlashes.length - 1; i >= 0; i--) {
        const gf = gateFlashes[i];
        gf.t += dt * 1.75;
        if (gf.t >= 1) {
          gateFlashes.splice(i, 1);
          continue;
        }
        const inv = 1 - gf.t;
        const wy = gf.y;

        if (gf.pass) {
          const r = 2.2 + gf.t * 7;
          ctx.strokeStyle = `rgba(248, 250, 252, ${(inv * 0.58).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(gf.x, wy, r, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = `rgba(255, 255, 255, ${(inv * 0.88).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(gf.x, wy, 1.7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Subtle arrest tick where outlier branch halts & dissolves
          ctx.strokeStyle = `rgba(186, 198, 214, ${(inv * 0.62).toFixed(3)})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(gf.x + 0.5, wy - 4.5);
          ctx.lineTo(gf.x + 0.5, wy + 4.5);
          ctx.stroke();
        }
      }

      // Draw unified bright silver trunk pulses [mergeX -> width]
      const trunkSpan = Math.max(1, geom.width - geom.mergeX);
      for (let i = trunkPulses.length - 1; i >= 0; i--) {
        const tp = trunkPulses[i];
        tp.t += dt * 1.15;
        if (tp.t >= 1.4) {
          trunkPulses.splice(i, 1);
          continue;
        }

        if (tp.t < 0.45) {
          const mInv = 1 - tp.t / 0.45;
          ctx.strokeStyle = `rgba(255, 255, 255, ${(mInv * 0.52).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(geom.mergeX, geom.cy, 8 + tp.t * 14, 0, Math.PI * 2);
          ctx.stroke();
        }

        const headX = geom.mergeX + clamp(tp.t, 0, 1) * trunkSpan;
        const tailX = geom.mergeX + clamp(tp.t - 0.42, 0, 1) * trunkSpan;
        if (headX - tailX > 1.5) {
          const sheen = ctx.createLinearGradient(tailX, geom.cy, headX, geom.cy);
          sheen.addColorStop(0, "rgba(248, 250, 252, 0)");
          sheen.addColorStop(1, "rgba(255, 255, 255, 0.28)");
          ctx.strokeStyle = sheen;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(tailX, geom.cy);
          ctx.lineTo(headX, geom.cy);
          ctx.stroke();

          const g = ctx.createLinearGradient(tailX, geom.cy, headX, geom.cy);
          g.addColorStop(0, "rgba(248, 250, 252, 0)");
          g.addColorStop(0.58, "rgba(248, 250, 252, 0.72)");
          g.addColorStop(1, "rgba(255, 255, 255, 1)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 2.1;
          ctx.beginPath();
          ctx.moveTo(tailX, geom.cy);
          ctx.lineTo(headX, geom.cy);
          ctx.stroke();

          ctx.fillStyle = "rgba(255, 255, 255, 1)";
          ctx.beginPath();
          ctx.arc(headX, geom.cy, 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    const startLoop = () => {
      if (rafId !== null) return;
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(renderFrame);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const onPointerMove = (e) => {
      if (!pointer.active) {
        pointer.smoothX = e.clientX;
        pointer.smoothY = e.clientY;
        pointer.active = true;
      }
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (!prefersReducedMotion) {
        startLoop();
      }
    };

    const onReducedMotionChange = (e) => {
      prefersReducedMotion = e.matches;
      stopLoop();
      renderFrame(performance.now());
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(container);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    }

    startLoop();

    return () => {
      stopLoop();
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="wallpaper" style={style} aria-hidden="true">
      <canvas ref={canvasRef} className="wallpaper-loom-canvas" />
    </div>
  );
}
