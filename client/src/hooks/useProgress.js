import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../features/auth/AuthContext';

/**
 * useProgress Hook
 * Centralizes the logic for saving progress and synchronizing global state.
 * 
 * Usage:
 * const { finishActivity, saving, error } = useProgress();
 * await finishActivity('p1_phishing_detect', 'module', 100);
 */
export const useProgress = () => {
    const { token, refreshUser, addXp, completeNode } = useContext(AuthContext);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const finishActivity = useCallback(async (activityId, type = 'module', score = 100) => {
        setSaving(true);
        setError(null);

        console.log(`[useProgress] Finishing Activity: ${activityId} (${type})`);

        try {
            // 1. Optimistic Update (Immediate Feedback)
            // We tell the UI "It's done" so the user sees green immediately.
            completeNode(activityId);

            // 2. Persist to Backend
            // If we are logged in, save it for real.
            if (token) {
                const res = await fetch('/api/training/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify({
                        phaseId: activityId,
                        scenarioId: type === 'scenario' ? activityId : undefined,
                        type: type,
                        score: score,
                        passed: true
                    })
                });

                if (!res.ok) {
                    throw new Error("Failed to save progress to server");
                }

                console.log("[useProgress] Server Save Success. Syncing Profile...");

                // 3. CRITICAL: Force Global Sync
                // We reload the user profile to get the official "Certification Status"
                // This triggers the AuthContext sync loop which recalculates Total XP and unlocks nodes.
                await refreshUser();

            } else {
                console.warn("[useProgress] No token found. Progress is local-only.");
            }

            return true;

        } catch (err) {
            console.error("[useProgress] Error:", err);
            setError(err.message);
            // Even on error, we keep the local optimistic update so the user isn't blocked.
            return false;
        } finally {
            setSaving(false);
        }
    }, [token, refreshUser, completeNode]);

    return { finishActivity, saving, error };
};
