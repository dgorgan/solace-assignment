import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  // Check if database is configured
  if (!process.env.DATABASE_URL) {
    return Response.json({ 
      message: "Database not configured. Using mock data instead.",
      advocates: advocateData 
    });
  }

  const records = await db.insert(advocates).values(advocateData).returning();

  return Response.json({ advocates: records });
}
