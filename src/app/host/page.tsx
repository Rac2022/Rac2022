"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import HostLobby from "@/components/HostLobby";
import HostBoard from "@/components/HostBoard";
import {
  generateRoomCode,
  joinRoomChannel,
  onPlayerEvent,
  broadcastHostEvent,
  leaveChannel,
} from "@/utils/realtime";
import { loadSettings, DEFAULT_SETTINGS } from "@/utils/storage";
import type { RoomPlayer, GameSettings, TeamId } from "@/types/game";

type HostPhase = "lobby" | "playing";

export default function HostPage() {
  const [phase, setPhase] = useState<HostPhase>("lobby");
  const [roomCode] = useState(() => generateRoomCode());
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const initialized = useRef(false);

  // Load saved settings
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      setSettings(loadSettings());
    } catch {
      // use defaults
    }
  }, []);

  // Set up channel
  useEffect(() => {
    let channel: RealtimeChannel;
    try {
      channel = joinRoomChannel(roomCode);
      channelRef.current = channel;

      onPlayerEvent(channel, (event) => {
        if (event.type === "join") {
          setPlayers((prev) => {
            if (prev.find((p) => p.id === event.player.id)) return prev;
            return [...prev, event.player];
          });
        } else if (event.type === "leave") {
          setPlayers((prev) => prev.filter((p) => p.id !== event.playerId));
        }
      });

      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          // Ready
        } else if (status === "CHANNEL_ERROR") {
          setError("Failed to connect to room. Check your Supabase config.");
        }
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to initialize multiplayer. Check .env.local."
      );
    }

    return () => {
      if (channelRef.current) {
        leaveChannel(channelRef.current);
      }
    };
  }, [roomCode]);

  const handleSwapTeam = useCallback(
    (playerId: string, newTeam: TeamId) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, team: newTeam } : p))
      );
      // Broadcast updated state so players see their team change
      if (channelRef.current) {
        const updatedPlayers = players.map((p) =>
          p.id === playerId ? { ...p, team: newTeam } : p
        );
        broadcastHostEvent(channelRef.current, {
          type: "room-state",
          state: {
            roomCode,
            phase: "waiting",
            players: updatedPlayers,
            settings,
            position: 0,
            score: { team1: 0, team2: 0 },
            streaks: { team1: 0, team2: 0 },
            roundResult: null,
            timeLeft: null,
            winZone: settings.winZone,
            themeId: settings.themeId,
            presetId: settings.presetId,
            gameMode: settings.gameMode,
          },
        });
      }
    },
    [players, roomCode, settings]
  );

  const handleStartMatch = useCallback(() => {
    setPhase("playing");
  }, []);

  const handleEndMatch = useCallback(() => {
    setPhase("lobby");
  }, []);

  const handleClose = useCallback(() => {
    window.location.href = "/";
  }, []);

  // Error screen
  if (error) {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center bg-gray-900 text-white p-6">
        <p className="text-5xl mb-4">⚠️</p>
        <h1 className="text-2xl font-bold mb-2">Connection Error</h1>
        <p className="text-gray-400 text-center max-w-md mb-6">{error}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform"
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  if (phase === "lobby") {
    return (
      <HostLobby
        roomCode={roomCode}
        players={players}
        settings={settings}
        onSettingsChange={setSettings}
        onSwapTeam={handleSwapTeam}
        onStartMatch={handleStartMatch}
        onClose={handleClose}
      />
    );
  }

  if (!channelRef.current) return null;

  return (
    <HostBoard
      channel={channelRef.current}
      roomCode={roomCode}
      players={players}
      settings={settings}
      onEndMatch={handleEndMatch}
    />
  );
}
