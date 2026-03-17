"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import TugArena from "./TugArena";
import ScoreBoard from "./ScoreBoard";
import VictoryOverlay from "./VictoryOverlay";
import Confetti from "./Confetti";
import { generateQuestion } from "@/utils/generateQuestion";
import { getTheme } from "@/utils/themes";
import { getPreset } from "@/utils/presets";
import { broadcastHostEvent, onPlayerEvent } from "@/utils/realtime";
import {
  playCorrect,
  playWrong,
  playPull,
  playWarning,
  playWin,
  playTie,
} from "@/utils/sounds";
import type {
  TeamId,
  GameScore,
  Streaks,
  RoundResult,
  GameSettings,
  MathQuestion,
  RoomPlayer,
  PlayerAnswer,
  RoomState,
} from "@/types/game";

const RUSH_DURATIONS: Record<string, number | null> = {
  classic: null,
  "rush-30": 30,
  "rush-60": 60,
};

interface HostBoardProps {
  channel: RealtimeChannel;
  roomCode: string;
  players: RoomPlayer[];
  settings: GameSettings;
  onEndMatch: () => void;
}

export default function HostBoard({
  channel,
  roomCode,
  players,
  settings,
  onEndMatch,
}: HostBoardProps) {
  const preset = getPreset(settings.presetId);
  const theme = getTheme(settings.themeId);
  const questionRules = preset.questionRules;
  const winZone = settings.winZone;
  const gameMode = settings.gameMode;

  // Game state
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState<GameScore>({ team1: 0, team2: 0 });
  const [streaks, setStreaks] = useState<Streaks>({ team1: 0, team2: 0 });
  const [roundResult, setRoundResult] = useState<RoundResult>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [soundEnabled] = useState(settings.soundEnabled);

  // Track which question each player has
  const playerQuestionsRef = useRef<Record<string, MathQuestion>>({});
  // Activity feed
  const [feed, setFeed] = useState<
    { id: number; name: string; correct: boolean; team: TeamId }[]
  >([]);
  const feedIdRef = useRef(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundOver = roundResult !== null;
  const roundOverRef = useRef(roundOver);
  roundOverRef.current = roundOver;

  const sfx = useCallback(
    (fn: () => void) => {
      if (soundEnabled) fn();
    },
    [soundEnabled]
  );

  // Generate and send a question to a player
  const sendQuestionToPlayer = useCallback(
    (player: RoomPlayer) => {
      const q = generateQuestion({
        difficulty: settings.difficulty,
        operatorMode: settings.operatorMode,
        rules: questionRules,
      });
      playerQuestionsRef.current[player.id] = q;
      broadcastHostEvent(channel, {
        type: "question",
        data: { playerId: player.id, question: q },
      });
    },
    [channel, settings.difficulty, settings.operatorMode, questionRules]
  );

  // Broadcast current room state
  const broadcastState = useCallback(
    (overrides?: Partial<RoomState>) => {
      const state: RoomState = {
        roomCode,
        phase: "playing",
        players,
        settings,
        position,
        score,
        streaks,
        roundResult,
        timeLeft,
        winZone,
        themeId: settings.themeId,
        presetId: settings.presetId,
        gameMode,
        ...overrides,
      };
      broadcastHostEvent(channel, { type: "room-state", state });
    },
    [
      channel,
      roomCode,
      players,
      settings,
      position,
      score,
      streaks,
      roundResult,
      timeLeft,
      winZone,
      gameMode,
    ]
  );

  // Timer management
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (seconds: number) => {
      clearTimer();
      setTimeLeft(seconds);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer]
  );

  useEffect(() => clearTimer, [clearTimer]);

  // Initialize: send questions to all players and start timer
  useEffect(() => {
    players.forEach((p) => sendQuestionToPlayer(p));
    const duration = RUSH_DURATIONS[gameMode];
    if (duration !== null) startTimer(duration);
    broadcastHostEvent(channel, { type: "game-start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warning sound at <=5 seconds
  useEffect(() => {
    if (timeLeft === null || timeLeft > 5 || timeLeft === 0 || roundOver)
      return;
    sfx(playWarning);
  }, [timeLeft, roundOver, sfx]);

  // Rush timeout
  useEffect(() => {
    if (timeLeft !== 0 || roundOver) return;
    let result: RoundResult;
    if (position < 0) {
      result = 1;
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
      sfx(playWin);
    } else if (position > 0) {
      result = 2;
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
      sfx(playWin);
    } else {
      result = "tie";
      sfx(playTie);
    }
    setRoundResult(result);
    setStreaks({ team1: 0, team2: 0 });
    broadcastHostEvent(channel, { type: "game-end", result });
  }, [timeLeft, position, roundOver, sfx, channel]);

  // Classic / Rush win zone detection
  useEffect(() => {
    if (roundOver) return;
    let result: RoundResult = null;
    if (position <= -winZone) {
      result = 1;
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
    } else if (position >= winZone) {
      result = 2;
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
    }
    if (result !== null) {
      clearTimer();
      setTimeLeft(null);
      setRoundResult(result);
      setStreaks({ team1: 0, team2: 0 });
      sfx(playWin);
      broadcastHostEvent(channel, { type: "game-end", result });
    }
  }, [position, winZone, roundOver, clearTimer, sfx, channel]);

  // Broadcast state periodically so players stay in sync
  useEffect(() => {
    const interval = setInterval(() => broadcastState(), 2000);
    return () => clearInterval(interval);
  }, [broadcastState]);

  // Handle player answers
  useEffect(() => {
    onPlayerEvent(channel, (event) => {
      if (event.type === "answer") {
        const { data } = event as { type: "answer"; data: PlayerAnswer };
        if (roundOverRef.current) return;

        const storedQ = playerQuestionsRef.current[data.playerId];
        if (!storedQ) return;

        const correct = data.answer === storedQ.answer;
        broadcastHostEvent(channel, {
          type: "answer-result",
          playerId: data.playerId,
          correct,
        });

        const teamKey = data.team === 1 ? "team1" : "team2";

        if (correct) {
          sfx(playCorrect);
          sfx(playPull);
          setStreaks((prev) => ({ ...prev, [teamKey]: prev[teamKey] + 1 }));
          setPosition((prev) =>
            data.team === 1 ? prev - 1 : prev + 1
          );
          // Send next question
          const player = players.find((p) => p.id === data.playerId);
          if (player) sendQuestionToPlayer(player);
        } else {
          sfx(playWrong);
          setStreaks((prev) => ({ ...prev, [teamKey]: 0 }));
        }

        // Add to feed
        setFeed((prev) => {
          const next = [
            {
              id: ++feedIdRef.current,
              name: data.playerName,
              correct,
              team: data.team,
            },
            ...prev,
          ];
          return next.slice(0, 12);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // New round
  const handleNewRound = useCallback(() => {
    clearTimer();
    setPosition(0);
    setRoundResult(null);
    setStreaks({ team1: 0, team2: 0 });
    setFeed([]);

    players.forEach((p) => sendQuestionToPlayer(p));

    const duration = RUSH_DURATIONS[gameMode];
    if (duration !== null) startTimer(duration);
    else setTimeLeft(null);

    broadcastHostEvent(channel, { type: "game-start" });
  }, [clearTimer, startTimer, gameMode, players, sendQuestionToPlayer, channel]);

  const handleResetScores = useCallback(() => {
    setScore({ team1: 0, team2: 0 });
    handleNewRound();
  }, [handleNewRound]);

  return (
    <div
      className={`h-dvh w-full flex flex-col ${theme.appBg} overflow-hidden select-none`}
    >
      {/* Top bar */}
      <ScoreBoard
        score={score}
        presetLabel={preset.label}
        difficulty={settings.difficulty}
        operatorMode={settings.operatorMode}
        gameMode={gameMode}
        roundResult={roundResult}
        timeLeft={timeLeft}
        theme={theme}
      />

      {/* Room code badge */}
      <div className="flex items-center justify-center gap-3 py-1 bg-gray-900/60">
        <span className="text-gray-400 text-xs font-bold uppercase">
          Room:
        </span>
        <span className="text-amber-400 font-mono font-extrabold text-lg tracking-[0.2em]">
          {roomCode}
        </span>
        <span className="text-gray-500 text-xs">
          {players.length} player{players.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Main arena */}
      <div className="flex-1 flex flex-row min-h-0">
        {/* Team 1 player list */}
        <div className="w-48 sm:w-56 bg-gray-900/50 p-3 overflow-y-auto border-r border-gray-700/50">
          <p
            className={`text-sm font-bold mb-2 ${theme.team1.scoreLabel} text-center`}
          >
            {theme.team1Icon} {theme.team1.label}
          </p>
          {players
            .filter((p) => p.team === 1)
            .map((p) => (
              <div
                key={p.id}
                className="bg-blue-900/30 rounded-lg px-2 py-1.5 mb-1 text-white text-sm font-medium truncate"
              >
                {p.name}
              </div>
            ))}
          {players.filter((p) => p.team === 1).length === 0 && (
            <p className="text-gray-600 text-xs text-center">No players</p>
          )}

          {/* Activity feed */}
          <div className="mt-4">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide mb-1">
              Activity
            </p>
            {feed
              .filter((f) => f.team === 1)
              .slice(0, 5)
              .map((f) => (
                <div
                  key={f.id}
                  className={`text-[11px] px-2 py-0.5 rounded mb-0.5 ${
                    f.correct
                      ? "bg-green-900/30 text-green-300"
                      : "bg-red-900/30 text-red-300"
                  }`}
                >
                  {f.correct ? "✓" : "✗"} {f.name}
                </div>
              ))}
          </div>
        </div>

        {/* Tug Arena */}
        <div className="flex-1 min-w-0">
          <TugArena position={position} winZone={winZone} theme={theme} />
        </div>

        {/* Team 2 player list */}
        <div className="w-48 sm:w-56 bg-gray-900/50 p-3 overflow-y-auto border-l border-gray-700/50">
          <p
            className={`text-sm font-bold mb-2 ${theme.team2.scoreLabel} text-center`}
          >
            {theme.team2Icon} {theme.team2.label}
          </p>
          {players
            .filter((p) => p.team === 2)
            .map((p) => (
              <div
                key={p.id}
                className="bg-red-900/30 rounded-lg px-2 py-1.5 mb-1 text-white text-sm font-medium truncate"
              >
                {p.name}
              </div>
            ))}
          {players.filter((p) => p.team === 2).length === 0 && (
            <p className="text-gray-600 text-xs text-center">No players</p>
          )}

          {/* Activity feed */}
          <div className="mt-4">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide mb-1">
              Activity
            </p>
            {feed
              .filter((f) => f.team === 2)
              .slice(0, 5)
              .map((f) => (
                <div
                  key={f.id}
                  className={`text-[11px] px-2 py-0.5 rounded mb-0.5 ${
                    f.correct
                      ? "bg-green-900/30 text-green-300"
                      : "bg-red-900/30 text-red-300"
                  }`}
                >
                  {f.correct ? "✓" : "✗"} {f.name}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className={`${theme.controlsBg} px-4 py-2 flex items-center justify-center gap-3 border-t border-gray-700/50`}
      >
        <button
          onClick={handleNewRound}
          className="bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-4 py-2 rounded-lg active:scale-95 transition-transform"
        >
          New Round
        </button>
        <button
          onClick={handleResetScores}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm px-4 py-2 rounded-lg active:scale-95 transition-transform"
        >
          Reset All
        </button>
        <button
          onClick={onEndMatch}
          className="bg-red-700 hover:bg-red-600 text-white font-bold text-sm px-4 py-2 rounded-lg active:scale-95 transition-transform"
        >
          End Match
        </button>
      </div>

      {/* Victory overlay */}
      {roundResult !== null && (
        <VictoryOverlay
          result={roundResult}
          onPlayAgain={handleNewRound}
          onResetScores={handleResetScores}
          theme={theme}
        />
      )}
    </div>
  );
}
