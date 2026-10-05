import React, { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause, Mic } from "lucide-react";

export default function VoiceNotePlayer({ url, isMine, duration = 0 }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  // Generate 22 consistent pseudo-random bar heights based on the audio url
  const waveformHeights = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < (url || "").length; i++) {
      seed = (seed * 31 + url.charCodeAt(i)) % 1000;
    }
    const heights = [];
    for (let i = 0; i < 22; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      // Between 20% and 100% height
      heights.push(Math.max(20, Math.floor(rnd * 80 + 20)));
    }
    return heights;
  }, [url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.playbackRate = playbackRate;
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const cycleSpeed = (e) => {
    e.stopPropagation();
    const speeds = [1, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = (totalDuration || 1) * pct;
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const formatSecs = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPct = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className={`flex items-center gap-2.5 p-2 rounded-2xl select-none max-w-[260px] sm:max-w-[290px] transition-all ${
      isMine
        ? "bg-blue-700/60 text-white border border-blue-400/30"
        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
    }`}>
      <audio ref={audioRef} src={url} preload="metadata" />

      {/* Play / Pause Circular Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center transition-transform hover:scale-105 shadow-sm cursor-pointer ${
          isMine
            ? "bg-white text-blue-600 hover:bg-blue-50"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        title={isPlaying ? "Pause" : "Play Voice Note"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform Equalizer Display & Scrubber */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div
          onClick={handleSeek}
          className="flex items-center gap-[2.5px] h-6 cursor-pointer py-1 group"
          title="Click to seek"
        >
          {waveformHeights.map((height, idx) => {
            const barPct = (idx / waveformHeights.length) * 100;
            const isPlayed = barPct <= progressPct;
            return (
              <span
                key={idx}
                style={{ height: `${height}%` }}
                className={`w-[3px] rounded-full transition-all duration-75 ${
                  isPlayed
                    ? isMine
                      ? "bg-white"
                      : "bg-blue-600 dark:bg-blue-400"
                    : isMine
                      ? "bg-blue-300/40 group-hover:bg-blue-300/70"
                      : "bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400"
                } ${isPlaying && isPlayed ? "opacity-100" : "opacity-80"}`}
              />
            );
          })}
        </div>

        {/* Duration Time Display */}
        <div className="flex items-center justify-between text-[10px] font-mono leading-none pt-0.5 opacity-80">
          <span>{formatSecs(isPlaying ? currentTime : totalDuration)}</span>
          <span className="flex items-center gap-0.5 text-[9px] font-sans">
            <Mic className="w-2.5 h-2.5" /> Voice
          </span>
        </div>
      </div>

      {/* Speed Rate Pill (1x / 1.5x / 2x) */}
      <button
        type="button"
        onClick={cycleSpeed}
        className={`px-1.5 py-0.5 rounded-full text-[9px] font-black shrink-0 transition-colors cursor-pointer ${
          isMine
            ? "bg-blue-800/80 text-blue-100 hover:bg-blue-800"
            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
        }`}
        title="Playback Speed"
      >
        {playbackRate}x
      </button>
    </div>
  );
}
