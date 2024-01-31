import { connectToDatabase } from "$lib/db";
import { Double, ObjectId } from "mongodb";

export async function get(request) {
  try {
    const start = request.query.get("debutParcours") || 1;
    const end = request.query.get("finParcours") || 5000000;
    const freq = request.query.get("freq") || 1
    const rando = request.query.get("rando") 

    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Parcours");
    const parcours = await collection.find({rando: rando,
      $and: [{ pos: { $gt: Number(start) } },
      { pos: { $lte: Number(end) } },
        { pos: { $mod: [Number(freq), 0] } }]
          }).sort({pos:1}).toArray();

    return {
      status: 200,
      body: {
        parcours,
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

export async function post(request) {
  // intégration d'un nouveau parcours du jour
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Parcours");
    const parcours = JSON.parse(request.body);
 
    let t = await collection.insertMany(parcours);

    return {
      status: 200,
      body: {
        insertedId: "OK",
      },
    };
  } catch (err) {
    console.info("err", err.message)
    return {
      status: 500,
      body: {
        erreur: err.message,
      },
    };
  }
}