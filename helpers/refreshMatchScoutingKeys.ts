import { MatchScout, matchScoutingUploads } from "@/data/schema";
import fetchFromCosmos from "./fetchFromCosmos";
import { db } from "@/data/db";

export default async () => {
  // Retrieve the URL and key from env.
  const masterKey = process.env.EXPO_PUBLIC_AZURE_KEY as string;
  const account = process.env.EXPO_PUBLIC_AZURE_ACCOUNT as string;

  // Cache Scouted Match Uploads from Cosmos.
  try {
    const results = await fetchFromCosmos<MatchScout>(
      masterKey,
      account,
      "crescendo",
      "match"
    );

    if (results === undefined) return;

    results.forEach(async (session) => {
      try {
        await db
          .insert(matchScoutingUploads)
          .values({
            id: session.id,
            refreshDate: new Date().toISOString(),
          })
          .onConflictDoUpdate({
            target: matchScoutingUploads.id,
            set: {
              refreshDate: new Date().toISOString(),
            },
          });
      } catch (error) {
        console.error("Error saving Match Scouting Uploads:", session);
        console.error(error);
      }
    });
  } catch (error) {
    console.error("Error saving Match Scouting Uploads:", error);
  }
};
