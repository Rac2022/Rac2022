"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GameLobby from "./GameLobby";
import GameBoard from "./GameBoard";
import PracticeMode from "./PracticeMode";
import TeacherSetup from "./TeacherSetup";
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from "@/utils/storage";
import { parseUrlConfig, hasUrlConfig } from "@/utils/urlConfig";
import { getPreset } from "@/utils/presets";
import { loadProfile, saveProfile, DEFAULT_PROFILE } from "@/utils/profile";
import { calculateBattleRewards, calculatePracticeRewards } from "@/utils/rewards";
import { checkNewBadges } from "@/utils/unlocks";
import { getTodayChallenge, loadDailyProgress, updateDailyProgress } from "@/utils/dailyChallenge";
import type {
  GameSettings,
  PlayerProfile,
  RoundCompleteData,
  RoundRewards,
  PracticeResult,
  DailyChallenge,
  DailyChallengeState,
} from "@/types/game";

type Screen = "lobby" | "battle" | "practice";

export default function GameApp() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [setupOpen, setSetupOpen] = useState(false);
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(() => getTodayChallenge());
  const [dailyProgress, setDailyProgress] = useState<DailyChallengeState>(() => ({
    date: "", current: 0, completed: false,
  }));
  const initialized = useRef(false);

  // Initialize settings + profile from storage + URL override
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let s = loadSettings();

    // URL params override stored settings
    if (hasUrlConfig()) {
      const urlOverrides = parseUrlConfig(window.location.search);
      s = { ...s, ...urlOverrides };

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

      if (urlOverrides.customQuestionsText === "__custom__") {
        s.customQuestionsText = loadSettings().customQuestionsText || "";
      }
    }

    setSettings(s);
    setProfile(loadProfile());
    setDailyChallenge(getTodayChallenge());
    setDailyProgress(loadDailyProgress());
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
    setScreen("battle");
  }, [settings]);

  const handleQuickStart = useCallback(() => {
    setSetupOpen(false);
    setScreen("battle");
  }, []);

  const handleStartPractice = useCallback(() => {
    setSetupOpen(false);
    setScreen("practice");
  }, []);

  const handleBackToLobby = useCallback(() => {
    // Refresh daily progress when returning
    setDailyProgress(loadDailyProgress());
    setScreen("lobby");
  }, []);

  const handleOpenSetup = useCallback(() => {
    setSetupOpen(true);
  }, []);

  const handleCloseSetup = useCallback(() => {
    setSetupOpen(false);
  }, []);

  // Battle round complete — update profile + daily challenge
  const handleRoundComplete = useCallback(
    (data: RoundCompleteData, rewards: RoundRewards) => {
      setProfile((prev) => {
        const updated: PlayerProfile = {
          ...prev,
          totalXp: prev.totalXp + rewards.xp,
          totalStars: prev.totalStars + rewards.stars,
          roundsPlayed: prev.roundsPlayed + 1,
          roundsWon: data.won ? prev.roundsWon + 1 : prev.roundsWon,
          longestStreak: Math.max(prev.longestStreak, data.maxStreak),
          rushRoundsCompleted: data.isRush ? prev.rushRoundsCompleted + 1 : prev.rushRoundsCompleted,
          unlockedBadges: [
            ...prev.unlockedBadges,
            ...rewards.newBadges
              .map((b) => b.id)
              .filter((id) => !prev.unlockedBadges.includes(id)),
          ],
          dailyChallengesCompleted: prev.dailyChallengesCompleted,
          practiceCorrect: prev.practiceCorrect,
        };
        saveProfile(updated);
        return updated;
      });

      // Update daily challenge
      const challenge = getTodayChallenge();
      const { state: newDailyState, justCompleted } = updateDailyProgress(challenge, {
        correctCount: data.correctCount,
        maxStreak: data.maxStreak,
        won: data.won,
        isRush: data.isRush,
      });
      setDailyProgress(newDailyState);

      if (justCompleted) {
        // Award daily challenge bonus
        setProfile((prev) => {
          const updated: PlayerProfile = {
            ...prev,
            totalXp: prev.totalXp + challenge.reward.xp,
            totalStars: prev.totalStars + challenge.reward.stars,
            dailyChallengesCompleted: prev.dailyChallengesCompleted + 1,
          };
          saveProfile(updated);
          return updated;
        });
      }
    },
    []
  );

  // Practice session complete
  const handlePracticeFinish = useCallback(
    (result: PracticeResult) => {
      setProfile((prev) => {
        const rewards = calculatePracticeRewards(result, prev);
        const updated: PlayerProfile = {
          ...prev,
          totalXp: prev.totalXp + rewards.xp,
          totalStars: prev.totalStars + rewards.stars,
          practiceCorrect: prev.practiceCorrect + result.correctCount,
          longestStreak: Math.max(prev.longestStreak, result.maxStreak),
          unlockedBadges: [
            ...prev.unlockedBadges,
            ...rewards.newBadges
              .map((b) => b.id)
              .filter((id) => !prev.unlockedBadges.includes(id)),
          ],
        };
        saveProfile(updated);
        return updated;
      });

      // Update daily challenge for practice
      const challenge = getTodayChallenge();
      const { state: newDailyState, justCompleted } = updateDailyProgress(challenge, {
        practiceCorrect: result.correctCount,
      });
      setDailyProgress(newDailyState);

      if (justCompleted) {
        setProfile((prev) => {
          const updated: PlayerProfile = {
            ...prev,
            totalXp: prev.totalXp + challenge.reward.xp,
            totalStars: prev.totalStars + challenge.reward.stars,
            dailyChallengesCompleted: prev.dailyChallengesCompleted + 1,
          };
          saveProfile(updated);
          return updated;
        });
      }
    },
    []
  );

  return (
    <>
      {screen === "lobby" && (
        <GameLobby
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onStartGame={handleStartGame}
          onQuickStart={handleQuickStart}
          onOpenSetup={handleOpenSetup}
          onStartPractice={handleStartPractice}
          profile={profile}
          dailyChallenge={dailyChallenge}
          dailyProgress={dailyProgress}
        />
      )}

      {screen === "battle" && (
        <GameBoard
          initialSettings={settings}
          profile={profile}
          onBackToLobby={handleBackToLobby}
          onSettingsChanged={handleSettingsChange}
          onRoundComplete={handleRoundComplete}
        />
      )}

      {screen === "practice" && (
        <PracticeMode
          settings={settings}
          onFinish={handlePracticeFinish}
          onBackToLobby={handleBackToLobby}
          soundEnabled={settings.soundEnabled}
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
