import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

const COLLECTION = "nurseRewards";
/**
 * @param {string} nurseId - The ID of the nurse
 * @param {number} deltaPoints - Number of points to add
 * @param {string} reason - Reason for the points: "completed_visit" | "five_star_review"
 * @param {string|object} meta - Any additional data (bookingId, reviewId, etc.)
 */

export async function addPointsToNurse(
  nurseId,
  deltaPoints,
  reason,
  meta = {}
) {
  if (!nurseId || !deltaPoints) return;

  const ref = doc(db, COLLECTION, nurseId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);

    let data = snap.exists()
      ? snap.data()
      : {
          nurseId,
          totalPoints: 0,
          rewards: [], // { amount, currency, at, by, meta }
          history: [], // { delta, reason, at, meta }
          lastUpdated: serverTimestamp(),
        };

    data.totalPoints = (data.totalPoints || 0) + deltaPoints;
    data.history = data.history || [];
    data.history.push({
      delta: deltaPoints,
      reason,
      at: new Date().toISOString(),
      meta,
    });

    data.rewards = data.rewards || [];
    while (data.totalPoints >= 200) {
      data.totalPoints -= 200;
      data.rewards.push({
        amount: 200,
        currency: "EGP",
        at: new Date().toISOString(),
        by: reason,
        meta,
      });
    }

    data.lastUpdated = serverTimestamp();

    tx.set(ref, data, { merge: true });
  });
}
