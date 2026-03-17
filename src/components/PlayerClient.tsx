"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import {
  broadcastPlayerEvent,
  onHostEvent,
} from "@/utils/realtime";
import { getTheme } from "@/utils/themes";
import { playTap, playCorrect, playWrong } from "@/utils/sounds";
import type {
  MathQuestion,
  RoomPlayer,
  RoomState,
  TeamId,
  ThemeConfig,
  TeamColors,
} from "@/types/game";

interface PlayerClientProps {
  channel: RealtimeChannel;
  player: RoomPlayer;
}

type PlayerPhase = "waiting" | "playing" | "finished";

export default function PlayerClient({ channel, player }: PlayerClientProps) {
  const [phase, setPhase] = useState<PlayerPhase>("waiting");
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [input, setInput] = useState("");
  const [isNegative, setIsNegative] = useState(false);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastResult, setLastResult] = useState<boolean | null>(null);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // Theme from room state
  const theme: ThemeConfig | null = roomState
    ? getTheme(roomState.themeId)
    : null;
  const colors: TeamColors | null = theme
    ? player.team === 1
      ? theme.team1
      : theme.team2
    : null;
  const teamIcon = theme
    ? player.team === 1
      ? theme.team1Icon
      : theme.team2Icon
    : "";

  // Listen for host events
  useEffect(() => {
    onHostEvent(channel, (event) => {
      switch (event.type) {
        case "room-state":
          setRoomState(event.state);
          break;
        case "question":
          if (event.data.playerId === player.id) {
            setQuestion(event.data.question);
            setInput("");
            setIsNegative(false);
            setLastResult(null);
          }
          break;
        case "answer-result":
          if (event.playerId === player.id) {
            if (event.correct) {
              setFlash(true);
              setTimeout(() => setFlash(false), 400);
              setStreak((s) => s + 1);
              setCorrectCount((c) => c + 1);
              setLastResult(true);
              playCorrect();
            } else {
              setShake(true);
              setTimeout(() => setShake(false), 500);
              setStreak(0);
              setLastResult(false);
              playWrong();
            }
          }
          break;
        case "game-start":
          setPhase("playing");
          setStreak(0);
          setCorrectCount(0);
          break;
        case "game-end":
          setPhase("finished");
          break;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNumber = useCallback((num: string) => {
    playTap();
    setInput((prev) => {
      if (prev.length >= 4) return prev;
      return prev + num;
    });
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
    setIsNegative(false);
  }, []);

  const handleNegativeToggle = useCallback(() => {
    setIsNegative((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!question || input === "" || phase !== "playing") return;
    const value = parseInt(input, 10);
    const answer = isNegative ? -value : value;

    broadcastPlayerEvent(channel, {
      type: "answer",
      data: {
        playerId: player.id,
        playerName: player.name,
        team: player.team,
        answer,
        questionDisplay: question.display,
      },
    });
    setInput("");
    setIsNegative(false);
  }, [channel, player, question, input, isNegative, phase]);

  const displayValue = input ? (isNegative ? `-${input}` : input) : "";
  const keypadNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  // Determine streak label
  let streakLabel: string | null = null;
  if (streak >= 5) streakLabel = "Unstoppable!";
  else if (streak >= 3) streakLabel = "Hot streak!";
  else if (streak >= 2) streakLabel = "Nice!";

  // Winner info
  const winnerTeam = roomState?.roundResult;
  const isWinner =
    winnerTeam === player.team;
  const isTie = winnerTeam === "tie";

  // Fallback colors if theme not loaded yet
  const bgColor =
    colors?.bg ||
    (player.team === 1 ? "bg-blue-600" : "bg-red-600");
  const accentColor =
    colors?.accent ||
    (player.team === 1 ? "bg-blue-700" : "bg-red-700");
  const bgLightColor =
    colors?.bgLight ||
    (player.team === 1 ? "bg-blue-500" : "bg-red-500");
  const hoverColor =
    colors?.hover ||
    (player.team === 1 ? "hover:bg-blue-400" : "hover:bg-red-400");
  const labelText = colors?.label || `Team ${player.team}`;

  // Waiting screen
  if (phase === "waiting") {
    return (
      <div
        className={`h-dvh w-full flex flex-col items-center justify-center ${bgColor} select-none p-6`}
      >
        <div className="text-center">
          <p className="text-5xl mb-4">{teamIcon || (player.team === 1 ? "🔵" : "🔴")}</p>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            {player.name}
          </h2>
          <p className="text-white/80 text-lg font-medium mb-1">
            {labelText}
          </p>
          <div className="mt-6 flex items-center gap-2 justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
            <p className="text-white/60 text-sm">
              Waiting for host to start...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Finished screen
  if (phase === "finished") {
    return (
      <div
        className={`h-dvh w-full flex flex-col items-center justify-center ${bgColor} select-none p-6`}
      >
        <div className="text-center">
          <p className="text-6xl mb-4">
            {isTie ? "🤝" : isWinner ? "🏆" : "😢"}
          </p>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            {isTie ? "It's a Tie!" : isWinner ? "You Win!" : "You Lose"}
          </h2>
          <p className="text-white/80 text-lg font-medium">
            You got {correctCount} correct
          </p>
          <div className="mt-6 flex items-center gap-2 justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
            <p className="text-white/60 text-sm">
              Waiting for next round...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen — question + keypad
  return (
    <div
      className={`h-dvh w-full flex flex-col items-center justify-between ${bgColor} select-none p-4 ${
        flash ? "animate-pulse" : ""
      }`}
    >
      {/* Header */}
      <div className="text-center w-full">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{teamIcon}</span>
          <h2 className="text-2xl font-extrabold text-white tracking-wider">
            {player.name}
          </h2>
        </div>
        <div className="flex items-center justify-center gap-3 mt-1">
          <span className={`inline-block px-3 py-0.5 rounded-full ${accentColor} text-white text-sm font-bold`}>
            {labelText}
          </span>
          <span className="text-white/80 text-sm font-bold">
            ✓ {correctCount}
          </span>
          {roomState?.timeLeft !== null && roomState?.timeLeft !== undefined && (
            <span
              className={`px-2 py-0.5 rounded text-sm font-bold tabular-nums ${
                roomState.timeLeft <= 5
                  ? "bg-red-600/60 text-red-200 animate-pulse"
                  : "bg-gray-700/60 text-white"
              }`}
            >
              {Math.floor((roomState.timeLeft ?? 0) / 60)}:
              {((roomState.timeLeft ?? 0) % 60).toString().padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      {/* Question */}
      {question ? (
        <div
          className={`w-full max-w-sm mx-auto ${
            shake ? "animate-[shake_0.5s_ease-in-out]" : ""
          }`}
        >
          <div
            className={`${accentColor} rounded-2xl p-5 text-center shadow-lg relative`}
          >
            <p className="text-lg text-white/70 font-medium mb-1">Solve:</p>
            <p className="text-5xl font-extrabold text-white">
              {question.display}
            </p>

            {/* Streak badge */}
            {streakLabel && (
              <div className="absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full bg-yellow-400 text-yellow-900 text-xs font-extrabold shadow-md animate-bounce">
                🔥 {streakLabel}
              </div>
            )}

            {/* Last result indicator */}
            {lastResult !== null && (
              <div
                className={`absolute -top-3 -left-2 px-2 py-0.5 rounded-full text-xs font-extrabold shadow-md ${
                  lastResult
                    ? "bg-green-400 text-green-900"
                    : "bg-red-400 text-red-900"
                }`}
              >
                {lastResult ? "✓ Correct!" : "✗ Wrong"}
              </div>
            )}
          </div>

          {/* Answer input */}
          <div className="mt-3 bg-white rounded-xl p-3 text-center shadow-inner">
            <p className="text-4xl font-bold text-gray-800 min-h-[2.5rem]">
              {displayValue || <span className="text-gray-300">?</span>}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-white/60 text-lg">Loading question...</div>
      )}

      {/* Keypad */}
      <div className="w-full max-w-sm mx-auto">
        <div className="grid grid-cols-3 gap-2">
          {keypadNumbers.map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className={`${bgLightColor} ${hoverColor} text-white text-3xl font-bold
                rounded-xl py-4 active:scale-95 transition-transform duration-100
                shadow-md select-none
                ${num === "0" ? "col-start-2" : ""}`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button
            onClick={handleNegativeToggle}
            className={`text-2xl font-bold rounded-xl py-4
              active:scale-95 transition-all duration-100 shadow-md select-none ${
              isNegative
                ? "bg-amber-400 text-gray-800"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            +/−
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-2xl font-bold
              rounded-xl py-4 active:scale-95 transition-transform duration-100
              shadow-md select-none"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={input === ""}
            className="bg-green-500 hover:bg-green-400 text-white text-2xl font-bold
              rounded-xl py-4 active:scale-95 transition-transform duration-100
              disabled:opacity-40 shadow-md select-none"
          >
            Go!
          </button>
        </div>
      </div>
    </div>
  );
}
