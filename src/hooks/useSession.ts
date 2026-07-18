import { useState, useEffect, useCallback, useRef } from "react";
import { StudySession, SessionState, EnergyCheckIn } from "../lib/types";
import * as storage from "../lib/storage";

const CHECK_IN_INTERVAL_MS = 45 * 60 * 1000;
const TICK_MS = 1000;

export function useSession() {
  const [session, setSession] = useState<StudySession | null>(() => storage.getActiveSession());
  const [elapsed, setElapsed] = useState(0);
  const [studyElapsed, setStudyElapsed] = useState(0);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [needsInitialCheckIn, setNeedsInitialCheckIn] = useState(false);
  const tickRef = useRef<number | null>(null);

  const recalcElapsed = useCallback((s: StudySession) => {
    const now = Date.now();
    const total = now - s.startedAt;
    setElapsed(total);

    let study = 0;
    for (const h of s.stateHistory) {
      if (h.state === "study") {
        const end = h.endedAt ?? now;
        study += end - h.startedAt;
      }
    }
    setStudyElapsed(study);

    if (s.energyCheckIns.length > 0) {
      const last = s.energyCheckIns[s.energyCheckIns.length - 1].timestamp;
      if (now - last >= CHECK_IN_INTERVAL_MS && s.currentState === "study") {
        setShowCheckIn(true);
      }
    } else {
      if (total >= CHECK_IN_INTERVAL_MS && s.currentState === "study") {
        setShowCheckIn(true);
      }
    }
  }, []);

  useEffect(() => {
    if (session && !session.endedAt) {
      tickRef.current = window.setInterval(() => {
        const fresh = storage.getActiveSession();
        if (fresh) {
          setSession(fresh);
          recalcElapsed(fresh);
        }
      }, TICK_MS);
    }

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [session?.id, session?.endedAt, recalcElapsed]);

  useEffect(() => {
    if (session && !session.endedAt) {
      recalcElapsed(session);
    }
  }, [session, recalcElapsed]);

  const requestStartSession = useCallback(() => {
    setNeedsInitialCheckIn(true);
  }, []);

  const confirmStartSession = useCallback((level: EnergyCheckIn["level"]) => {
    const s = storage.startSessionWithCheckIn(level);
    setSession(s);
    setElapsed(0);
    setStudyElapsed(0);
    setShowCheckIn(false);
    setNeedsInitialCheckIn(false);
  }, []);

  const cancelStartSession = useCallback(() => {
    setNeedsInitialCheckIn(false);
  }, []);

  const toggleState = useCallback(() => {
    if (!session) return;
    const updated = storage.toggleSessionState(session.id);
    if (updated) {
      setSession(updated);
      recalcElapsed(updated);
    }
  }, [session, recalcElapsed]);

  const pauseSession = useCallback(() => {
    if (!session) return;
    const updated = storage.pauseSession(session.id);
    if (updated) {
      setSession(updated);
      recalcElapsed(updated);
    }
  }, [session, recalcElapsed]);

  const endSession = useCallback(() => {
    if (!session) return;
    storage.endSession(session.id);
    setSession(null);
    setElapsed(0);
    setStudyElapsed(0);
    setShowCheckIn(false);
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, [session]);

  const addCheckIn = useCallback(
    (level: EnergyCheckIn["level"]) => {
      if (!session) return;
      storage.addEnergyCheckIn(session.id, level);
      const updated = storage.getActiveSession();
      if (updated) {
        setSession(updated);
      }
      setShowCheckIn(false);
    },
    [session]
  );

  const dismissCheckIn = useCallback(() => {
    setShowCheckIn(false);
  }, []);

  return {
    session,
    elapsed,
    studyElapsed,
    currentState: session?.currentState ?? null,
    showCheckIn,
    needsInitialCheckIn,
    requestStartSession,
    confirmStartSession,
    cancelStartSession,
    toggleState,
    pauseSession,
    endSession,
    addCheckIn,
    dismissCheckIn,
  };
}
