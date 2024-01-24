import { connectToDatabase } from "$lib/db";

export async function get(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Randos");
    const randos = await collection.find().sort({ year: -1 }).toArray();

    return {
      status: 200,
      body: {
        randos,
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
