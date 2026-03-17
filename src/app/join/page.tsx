"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import PlayerClient from "@/components/PlayerClient";
import {
  generatePlayerId,
  joinRoomChannel,
  broadcastPlayerEvent,
  onHostEvent,
  leaveChannel,
} from "@/utils/realtime";
import type { RoomPlayer, TeamId } from "@/types/game";

type JoinPhase = "enter-code" | "enter-name" | "connected";

export default function JoinPage() {
  const [phase, setPhase] = useState<JoinPhase>("enter-code");
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [player, setPlayer] = useState<RoomPlayer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const playerIdRef = useRef(generatePlayerId());

  // Check for code in URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setRoomCode(code.toUpperCase());
      setPhase("enter-name");
    }
  }, []);

  const handleJoinRoom = useCallback(() => {
    const code = roomCode.trim().toUpperCase();
    if (code.length < 4) {
      setError("Enter a 4-character room code");
      return;
    }
    setRoomCode(code);
    setError(null);
    setPhase("enter-name");
  }, [roomCode]);

  const handleConnect = useCallback(() => {
    const name = playerName.trim();
    if (!name) {
      setError("Enter your name");
      return;
    }
    setError(null);
    setConnecting(true);

    try {
      const channel = joinRoomChannel(roomCode);
      channelRef.current = channel;

      // Auto-assign team: alternate based on odd/even
      const team: TeamId = Math.random() < 0.5 ? 1 : 2;
      const newPlayer: RoomPlayer = {
        id: playerIdRef.current,
        name,
        team,
        connected: true,
      };

      // Listen for host events to detect team reassignment
      onHostEvent(channel, (event) => {
        if (event.type === "room-state") {
          const me = event.state.players.find(
            (p) => p.id === playerIdRef.current
          );
          if (me) {
            setPlayer((prev) =>
              prev && prev.team !== me.team ? { ...prev, team: me.team } : prev
            );
          }
        }
      });

      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setPlayer(newPlayer);
          broadcastPlayerEvent(channel, { type: "join", player: newPlayer });
          setPhase("connected");
          setConnecting(false);
        } else if (status === "CHANNEL_ERROR") {
          setError("Failed to connect. Check the room code and try again.");
          setConnecting(false);
        }
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Connection failed. Multiplayer may not be configured."
      );
      setConnecting(false);
    }
  }, [roomCode, playerName]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        broadcastPlayerEvent(channelRef.current, {
          type: "leave",
          playerId: playerIdRef.current,
        });
        leaveChannel(channelRef.current);
      }
    };
  }, []);

  // Enter code screen
  if (phase === "enter-code") {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 select-none p-6">
        <div className="text-center mb-8">
          <p className="text-5xl mb-3">🎮</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Join a Match
          </h1>
          <p className="text-gray-400 mt-1">
            Enter the room code from the host screen
          </p>
        </div>

        <div className="w-full max-w-xs">
          <input
            type="text"
            value={roomCode}
            onChange={(e) =>
              setRoomCode(e.target.value.toUpperCase().slice(0, 4))
            }
            placeholder="ABCD"
            maxLength={4}
            className="w-full text-center text-4xl font-extrabold font-mono tracking-[0.3em]
              bg-gray-800 text-amber-400 rounded-2xl px-6 py-5 border-2 border-gray-700
              focus:border-amber-500 focus:outline-none placeholder:text-gray-600"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
          />
          {error && (
            <p className="text-red-400 text-sm text-center mt-2">{error}</p>
          )}
          <button
            onClick={handleJoinRoom}
            disabled={roomCode.length < 4}
            className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-gray-900 font-extrabold text-xl
              px-8 py-4 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-amber-500/30
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full mt-3 text-gray-400 hover:text-white text-sm font-medium py-2
              rounded-lg hover:bg-gray-800 transition-colors active:scale-95"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Enter name screen
  if (phase === "enter-name") {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 select-none p-6">
        <div className="text-center mb-8">
          <p className="text-5xl mb-3">✏️</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            What&apos;s Your Name?
          </h1>
          <p className="text-gray-400 mt-1">
            Room: <span className="text-amber-400 font-mono font-bold tracking-wider">{roomCode}</span>
          </p>
        </div>

        <div className="w-full max-w-xs">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value.slice(0, 15))}
            placeholder="Your name"
            maxLength={15}
            className="w-full text-center text-2xl font-bold
              bg-gray-800 text-white rounded-2xl px-6 py-5 border-2 border-gray-700
              focus:border-amber-500 focus:outline-none placeholder:text-gray-500"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
          />
          {error && (
            <p className="text-red-400 text-sm text-center mt-2">{error}</p>
          )}
          <button
            onClick={handleConnect}
            disabled={connecting || !playerName.trim()}
            className="w-full mt-4 bg-green-500 hover:bg-green-400 text-gray-900 font-extrabold text-xl
              px-8 py-4 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-green-500/30
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {connecting ? "Connecting..." : "Join Game!"}
          </button>
          <button
            onClick={() => {
              setPhase("enter-code");
              setError(null);
            }}
            className="w-full mt-3 text-gray-400 hover:text-white text-sm font-medium py-2
              rounded-lg hover:bg-gray-800 transition-colors active:scale-95"
          >
            Change Room Code
          </button>
        </div>
      </div>
    );
  }

  // Connected — show PlayerClient
  if (!channelRef.current || !player) return null;

  return <PlayerClient channel={channelRef.current} player={player} />;
}
