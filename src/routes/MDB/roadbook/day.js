import { connectToDatabase } from "$lib/db";
import { ObjectId } from "mongodb";

export async function get(request) {
  try {
    const dayCounter = request.query.get("dayCounter");
    console.log("dayCounter", dayCounter)
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Roadbook");
    const r_day = await collection.findOne({ dayCounter: Number(dayCounter) });
    return {
      status: 200,
      body: {
        r_day,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        erreur: err.message,
      },
    };
  }
}
