import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * Interactive OS memory compaction visualiser (1024 KB physical RAM, 0x000–0x400).
 * Demonstrates external fragmentation blocking a 256 KB request (P5) despite 352 KB
 * total free RAM, followed by sequential PCB base-register relocation of P1, P3, P4
 * to coalesce free holes into one contiguous high-memory block so P5 can allocate.
 */

const TOTAL_KB = 1024;

const STAGES = [
  {
    id: "fragmented",
    movingId: null,
    status: "External fragmentation: 352 KB free across 4 holes, max contiguous is 128 KB — P5 (256 KB) blocked",
    duration: 2200,
    blocks: [
      { id: "KERN", label: "KERN", base: 0, size: 128, kind: "kernel" },
      { id: "P1", label: "P1", base: 224, size: 160, prevBase: null, kind: "proc" },
      { id: "P3", label: "P3", base: 512, size: 192, prevBase: null, kind: "proc" },
      { id: "P4", label: "P4", base: 768, size: 192, prevBase: null, kind: "proc" }
    ]
  },
  {
    id: "relocate-p1",
    movingId: "P1",
    status: "Relocating P1: copying 160 KB down to 0x080 · updating PCB base register 0x0E0 → 0x080",
    duration: 1050,
    blocks: [
      { id: "KERN", label: "KERN", base: 0, size: 128, kind: "kernel" },
      { id: "P1", label: "P1", base: 128, size: 160, prevBase: 224, kind: "proc" },
      { id: "P3", label: "P3", base: 512, size: 192, prevBase: null, kind: "proc" },
      { id: "P4", label: "P4", base: 768, size: 192, prevBase: null, kind: "proc" }
    ]
  },
  {
    id: "relocate-p3",
    movingId: "P3",
    status: "Relocating P3: copying 192 KB down to 0x120 · updating PCB base register 0x200 → 0x120",
    duration: 1050,
    blocks: [
      { id: "KERN", label: "KERN", base: 0, size: 128, kind: "kernel" },
      { id: "P1", label: "P1", base: 128, size: 160, prevBase: 224, kind: "proc" },
      { id: "P3", label: "P3", base: 288, size: 192, prevBase: 512, kind: "proc" },
      { id: "P4", label: "P4", base: 768, size: 192, prevBase: null, kind: "proc" }
    ]
  },
  {
    id: "coalesced",
    movingId: "P4",
    status: "Relocating P4 → 0x1E0 · holes coalesced into one 352 KB contiguous block at 0x2A0",
    duration: 1500,
    blocks: [
      { id: "KERN", label: "KERN", base: 0, size: 128, kind: "kernel" },
      { id: "P1", label: "P1", base: 128, size: 160, prevBase: 224, kind: "proc" },
      { id: "P3", label: "P3", base: 288, size: 192, prevBase: 512, kind: "proc" },
      { id: "P4", label: "P4", base: 480, size: 192, prevBase: 768, kind: "proc" }
    ]
  },
  {
    id: "allocated",
    movingId: "P5",
    status: "Compaction complete: queued P5 (256 KB) allocated at 0x2A0 · 96 KB free tail at 0x3A0",
    duration: 2600,
    blocks: [
      { id: "KERN", label: "KERN", base: 0, size: 128, kind: "kernel" },
      { id: "P1", label: "P1", base: 128, size: 160, prevBase: 224, kind: "proc" },
      { id: "P3", label: "P3", base: 288, size: 192, prevBase: 512, kind: "proc" },
      { id: "P4", label: "P4", base: 480, size: 192, prevBase: 768, kind: "proc" },
      { id: "P5", label: "P5", base: 672, size: 256, prevBase: null, kind: "allocated" }
    ]
  }
];

function toHex(kb) {
  return `0x${kb.toString(16).toUpperCase().padStart(3, "0")}`;
}

function computeHoles(blocks) {
  const sorted = [...blocks].sort((a, b) => a.base - b.base);
  const holes = [];
  let cursor = 0;
  sorted.forEach((b) => {
    if (b.base > cursor) {
      holes.push({ base: cursor, size: b.base - cursor });
    }
    cursor = b.base + b.size;
  });
  if (cursor < TOTAL_KB) {
    holes.push({ base: cursor, size: TOTAL_KB - cursor });
  }
  return holes;
}

const TICKS = [0, 256, 512, 768, 1024];

export default function CompactionScene() {
  const reduceMotion = useReducedMotion();
  const [stageIdx, setStageIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(!reduceMotion);
  const [runSequence, setRunSequence] = useState(false);

  const stage = STAGES[stageIdx];
  const holes = computeHoles(stage.blocks);
  const totalFree = holes.reduce((sum, h) => sum + h.size, 0);
  const maxHole = holes.reduce((max, h) => Math.max(max, h.size), 0);

  // Auto-loop or one-shot sequence timer
  useEffect(() => {
    if (!autoPlay && !runSequence) return undefined;

    const wait = reduceMotion ? 600 : stage.duration;
    const timer = setTimeout(() => {
      if (runSequence) {
        if (stageIdx < STAGES.length - 1) {
          setStageIdx((i) => i + 1);
        } else {
          setRunSequence(false);
        }
      } else if (autoPlay) {
        setStageIdx((i) => (i + 1) % STAGES.length);
      }
    }, wait);

    return () => clearTimeout(timer);
  }, [autoPlay, runSequence, stageIdx, stage.duration, reduceMotion]);

  const handleStep = useCallback(() => {
    setAutoPlay(false);
    setRunSequence(false);
    setStageIdx((i) => (i + 1) % STAGES.length);
  }, []);

  const handleCompactOrReset = useCallback(() => {
    setAutoPlay(false);
    if (stageIdx === 0) {
      setStageIdx(1);
      setRunSequence(true);
    } else if (runSequence) {
      setRunSequence(false);
    } else if (stageIdx < STAGES.length - 1) {
      setRunSequence(true);
    } else {
      setStageIdx(0);
      setRunSequence(false);
    }
  }, [stageIdx, runSequence]);

  const toggleAuto = useCallback(() => {
    setRunSequence(false);
    setAutoPlay((v) => !v);
  }, []);

  const p5State =
    stageIdx === 4
      ? { label: "ALLOCATED @ 0x2A0", tone: "ok" }
      : stageIdx === 3
        ? { label: "READY · 352K CONTIGUOUS", tone: "ready" }
        : { label: `BLOCKED · MAX HOLE ${maxHole}K`, tone: "blocked" };

  const pcbRows = [
    ...stage.blocks.filter((b) => b.id !== "KERN"),
    ...(stageIdx < 4 ? [{ id: "P5", label: "P5", base: null, size: 256, kind: "queued" }] : [])
  ];

  const primaryLabel =
    runSequence
      ? "Pause"
      : stageIdx === 0
        ? "Compact RAM"
        : stageIdx < STAGES.length - 1
          ? "Finish Compaction"
          : "Reset Fragmented";

  return (
    <div className="compaction-scene">
      <div className="compaction-viewport">
        {/* Top telemetry header */}
        <div className="compaction-telemetry">
          <div className="compaction-queue">
            <span className="compaction-queue-title">Queue: P5 (256 KB)</span>
            <span className={`compaction-pill compaction-pill--${p5State.tone}`}>
              <span className="compaction-pill-dot" />
              {p5State.label}
            </span>
          </div>
          <div className="compaction-stats">
            <span>Free: <strong>{totalFree} KB</strong></span>
            <span className="compaction-sep">·</span>
            <span>Holes: <strong>{holes.length}</strong></span>
            <span className="compaction-sep">·</span>
            <span>Largest: <strong>{maxHole} KB</strong></span>
          </div>
        </div>

        {/* Hex address ruler */}
        <div className="compaction-ruler" aria-hidden="true">
          {TICKS.map((kb) => (
            <span
              key={kb}
              className="compaction-tick"
              style={{
                left: `${(kb / TOTAL_KB) * 100}%`,
                transform: kb === 0 ? "none" : kb === TOTAL_KB ? "translateX(-100%)" : "translateX(-50%)"
              }}
            >
              {toHex(kb)}
            </span>
          ))}
        </div>

        {/* Physical memory address bar */}
        <div className="compaction-ram-track" role="img" aria-label={stage.status}>
          {/* Free hole labels rendered in unallocated gaps */}
          <AnimatePresence initial={false}>
            {holes.map((h) => (
              <motion.div
                key={`hole-${h.base}-${h.size}`}
                className="compaction-hole"
                initial={{ opacity: 0 }}
                animate={{
                  left: `${(h.base / TOTAL_KB) * 100}%`,
                  width: `${(h.size / TOTAL_KB) * 100}%`,
                  opacity: 1
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
              >
                {h.size >= 64 && (
                  <span className="compaction-hole-label">
                    {h.size >= 200 ? `FREE · ${h.size}K` : `${h.size}K`}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Allocated partitions */}
          <AnimatePresence initial={false}>
            {stage.blocks.map((block) => {
              const isMoving = stage.movingId === block.id;
              return (
                <motion.div
                  key={block.id}
                  className={`compaction-block compaction-block--${block.kind}${isMoving ? " is-active" : ""}`}
                  initial={
                    block.kind === "allocated"
                      ? { opacity: 0, scale: 0.96, left: `${(block.base / TOTAL_KB) * 100}%`, width: `${(block.size / TOTAL_KB) * 100}%` }
                      : false
                  }
                  animate={{
                    left: `${(block.base / TOTAL_KB) * 100}%`,
                    width: `${(block.size / TOTAL_KB) * 100}%`,
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 210, damping: 26, mass: 0.8 }
                  }
                >
                  <div className="compaction-block-top">
                    <span className="compaction-block-id">
                      {isMoving && block.kind === "proc" ? `← ${block.label}` : block.label}
                    </span>
                    <span className="compaction-block-size">{block.size}K</span>
                  </div>
                  <span className="compaction-block-addr">{toHex(block.base)}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* PCB Relocation Register table */}
        <div className="compaction-pcb-grid">
          {pcbRows.map((row) => {
            const isActive = stage.movingId === row.id;
            const relocated = row.prevBase != null;
            return (
              <div
                key={row.id}
                className={`compaction-pcb-card${isActive ? " is-active" : ""}${row.kind === "queued" ? " is-queued" : ""}`}
              >
                <div className="compaction-pcb-head">
                  <span className="compaction-pcb-pid">{row.label}</span>
                  <span className="compaction-pcb-limit">{row.size}K</span>
                </div>
                <div className="compaction-pcb-base">
                  {row.base == null ? (
                    <span className="compaction-pcb-wait">waiting…</span>
                  ) : relocated ? (
                    <span>
                      <span className="compaction-pcb-old">{toHex(row.prevBase)}</span>
                      {" → "}
                      <span className="compaction-pcb-new">{toHex(row.base)}</span>
                    </span>
                  ) : (
                    <span>base {toHex(row.base)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control bar */}
      <div className="railway-scene-bar">
        <div className="railway-scene-meta">
          <span className="railway-scene-label">
            Memory compaction · Stage {stageIdx + 1}/{STAGES.length}
          </span>
          <span className="railway-scene-status">{stage.status}</span>
        </div>
        <div className="compaction-actions">
          <button
            type="button"
            className={`compaction-ghost-btn${autoPlay ? " is-on" : ""}`}
            onClick={toggleAuto}
            title={autoPlay ? "Pause automatic loop" : "Loop animation automatically"}
          >
            {autoPlay ? "Auto: On" : "Auto: Off"}
          </button>
          <button
            type="button"
            className="compaction-ghost-btn"
            onClick={handleStep}
          >
            Step →
          </button>
          <button
            type="button"
            className="compaction-primary-btn"
            onClick={handleCompactOrReset}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
      <p className="railway-scene-caption">
        Compaction shifts relocatable partitions toward low memory and rewrites PCB base registers so scattered free holes merge into one contiguous block.
      </p>
    </div>
  );
}
