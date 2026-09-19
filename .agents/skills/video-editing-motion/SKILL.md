---
name: video-editing-motion
description: Use this skill when planning video edits, creating motion graphics, animating UI, writing FFmpeg commands, scripting Remotion videos, or designing keyframe animations.
---

# Video Editing & Motion Graphics Engineering

This skill provides comprehensive workflows for video editing, motion design principles, programmatic video generation (Remotion, Canvas, FFmpeg), and high-impact micro-animations.

---

## 1. The 12 Principles of Motion Applied to Digital Media

1. **Easing & Timing**: Never use linear transitions for UI/video elements. Use natural cubic-beziers:
   * Smooth Entry: `cubic-bezier(0.16, 1, 0.3, 1)` (Power4 Out)
   * Anticipation & Snap: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Back Out)
2. **Staggering & Offset**: When animating lists or grids, stagger children by `30ms` to `60ms` to create organic flow.
3. **Follow-Through & Overlap**: Secondary elements (accents, subtitles, particles) should arrive slightly after the primary subject.
4. **Visual Rhythm & Cuts**: Match cut points to sound transients (beats, snare hits, bass drops, cinematic impacts).

---

## 2. Programmatic Video Pipeline: Remotion & Canvas

### Frame-Accurate Animation Hook Pattern
```typescript
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const CinematicTitle = ({ title }: { title: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth cinematic entrance with spring physics
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 },
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ transform: `scale(${scale})`, opacity }}>
      <h1 className="cinematic-headline">{title}</h1>
    </div>
  );
};
```

---

## 3. High-Performance FFmpeg Command Runbook

### Clean WebM Video Encoding for Web Backgrounds
```bash
# Ultra-compact, transparent/high-quality VP9 loop for hero video
ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 1500k -crf 28 -an -auto-alt-ref 1 -lag-in-frames 25 -tile-columns 2 hero-bg.webm
```

### High-Speed Video Trimming & Social Aspect Ratio Formatting (9:16)
```bash
# Crop center 1080x1920 for Shorts / Reels with blurred background wings
ffmpeg -i landscape.mp4 -lavfi "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:20[bg];[0:v]scale=1080:-1[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" -c:a copy reel_output.mp4
```

---

## 4. Audio Mixing & Sound Design Pacing

* **Loudness Compliance**:
  * Web & Streaming standard: `-14 LUFS` Integrated with `-1.0 dBFS` True Peak.
  * Dialogue clarity: Duck background audio/music by `-9 dB` whenever voiceover occurs (sidechain compression).
* **Audio Transients**: Pair visual button clicks or page entries with subtle sub-audible clicks ($40\text{ms}$ pink noise blips at $2.5\text{kHz}$) for tactile feedback.
