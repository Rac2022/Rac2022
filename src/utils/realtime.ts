import { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabase } from './supabase';
import type { HostEvent, PlayerEvent } from '@/types/game';

/** Generate a short 4-character room code */
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Generate a unique player ID */
export function generatePlayerId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const CHANNEL_PREFIX = 'classroom-clash-';

/**
 * Create or join a Supabase Realtime channel for a room.
 * Uses Broadcast for ephemeral messaging (no database needed).
 */
export function joinRoomChannel(roomCode: string): RealtimeChannel {
  const supabase = getSupabase();
  const channel = supabase.channel(`${CHANNEL_PREFIX}${roomCode}`, {
    config: { broadcast: { self: false } },
  });
  return channel;
}

/** Host broadcasts an event to all players in the room */
export function broadcastHostEvent(channel: RealtimeChannel, event: HostEvent) {
  channel.send({
    type: 'broadcast',
    event: 'host-event',
    payload: event,
  });
}

/** Player sends an event to the host */
export function broadcastPlayerEvent(channel: RealtimeChannel, event: PlayerEvent) {
  channel.send({
    type: 'broadcast',
    event: 'player-event',
    payload: event,
  });
}

/** Subscribe to host events (used by players) */
export function onHostEvent(
  channel: RealtimeChannel,
  callback: (event: HostEvent) => void
): void {
  channel.on('broadcast', { event: 'host-event' }, (payload) => {
    callback(payload.payload as HostEvent);
  });
}

/** Subscribe to player events (used by host) */
export function onPlayerEvent(
  channel: RealtimeChannel,
  callback: (event: PlayerEvent) => void
): void {
  channel.on('broadcast', { event: 'player-event' }, (payload) => {
    callback(payload.payload as PlayerEvent);
  });
}

/** Leave and clean up a channel */
export function leaveChannel(channel: RealtimeChannel) {
  const supabase = getSupabase();
  supabase.removeChannel(channel);
}
