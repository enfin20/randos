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
    const parcours = await collection.find({
      $and: [{ pos: { $gt: Number(start) } },
      { pos: { $lte: Number(end) } },
        { pos: { $mod: [Number(freq), 0] } }],
      rando: rando
    }).sort({pos:1}).toArray();

    for (var i = 0; i < parcours.length; i++) {
      parcours[i].key = parcours[i]._id;
    }
    console.log("*************************************************************************")
    console.info("start", start)
    console.info("end", end)
    console.info("parcours.length", parcours.length)
    console.info("pos max", parcours[parcours.length-1].pos)    
    console.log("*************************************************************************")


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