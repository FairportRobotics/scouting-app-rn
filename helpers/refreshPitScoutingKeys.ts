import { PitScoutingSession, pitScoutingUploads } from "@/data/schema";
import fetchFromCosmos from "./fetchFromCosmos";
import { db } from "@/data/db";

export default async () => {
  // Retrieve the URL and key from env.
  const masterKey = process.env.EXPO_PUBLIC_AZURE_KEY as string;
  const account = process.env.EXPO_PUBLIC_AZURE_ACCOUNT as string;

  // Cache Scouted Match Uploads from Cosmos.
  try {
    const results = await fetchFromCosmos<PitScoutingSession>(
      masterKey,
      account,
      "crescendo",
      "pit"
    );

    if (results === undefined) return;

    results.forEach(async (session) => {
      try {
        await db
          .insert(pitScoutingUploads)
          .values({
            id: session.id,
            refreshDate: new Date().toISOString(),
          })
          .onConflictDoUpdate({
            target: pitScoutingUploads.id,
            set: {
              refreshDate: new Date().toISOString(),
            },
          });
      } catch (error) {
        console.error("Error saving Pit Scouting Uploads:", session);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving Pit Scouting Uploads:", error);
  }
};
