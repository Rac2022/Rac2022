"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GameLobby from "./GameLobby";
import GameBoard from "./GameBoard";
import TeacherSetup from "./TeacherSetup";
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from "@/utils/storage";
import { parseUrlConfig, hasUrlConfig } from "@/utils/urlConfig";
import { getPreset } from "@/utils/presets";
import type { GameSettings } from "@/types/game";

export default function GameApp() {
  const [screen, setScreen] = useState<"lobby" | "playing">("lobby");
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [setupOpen, setSetupOpen] = useState(false);
  const initialized = useRef(false);

  // Initialize settings from storage + URL override
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let s = loadSettings();

    // URL params override stored settings
    if (hasUrlConfig()) {
      const urlOverrides = parseUrlConfig(window.location.search);
      s = { ...s, ...urlOverrides };

      // If URL specified a preset, apply its derived settings
      if (urlOverrides.presetId) {
        const p = getPreset(urlOverrides.presetId);
        s = {
          ...s,
          difficulty: p.difficulty,
          operatorMode: p.operatorMode,
          gameMode: p.gameMode,
          winZone: p.winZone,
          themeId: urlOverrides.themeId ?? p.themeId,
        };
      }

      // If custom flag came from URL but no stored custom questions, clear the flag
      if (urlOverrides.customQuestionsText === "__custom__") {
        s.customQuestionsText = loadSettings().customQuestionsText || "";
      }
    }

    setSettings(s);
  }, []);

  // Persist settings on change
  useEffect(() => {
    if (initialized.current) {
      saveSettings(settings);
    }
  }, [settings]);

  const handleSettingsChange = useCallback((s: GameSettings) => {
    setSettings(s);
  }, []);

  const handleStartGame = useCallback(() => {
    saveSettings(settings);
    setSetupOpen(false);
    setScreen("playing");
  }, [settings]);

  const handleQuickStart = useCallback(() => {
    // Use whatever is currently saved — just start
    setSetupOpen(false);
    setScreen("playing");
  }, []);

  const handleBackToLobby = useCallback(() => {
    setScreen("lobby");
  }, []);

  const handleOpenSetup = useCallback(() => {
    setSetupOpen(true);
  }, []);

  const handleCloseSetup = useCallback(() => {
    setSetupOpen(false);
  }, []);

  return (
    <>
      {screen === "lobby" ? (
        <GameLobby
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onStartGame={handleStartGame}
          onQuickStart={handleQuickStart}
          onOpenSetup={handleOpenSetup}
        />
      ) : (
        <GameBoard
          initialSettings={settings}
          onBackToLobby={handleBackToLobby}
          onSettingsChanged={handleSettingsChange}
        />
      )}

      <TeacherSetup
        open={setupOpen}
        onClose={handleCloseSetup}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </>
  );
}
