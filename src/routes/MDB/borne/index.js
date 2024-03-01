import { connectToDatabase } from "$lib/db";
import { Double, ObjectId } from "mongodb";

export async function get(request) {
  try {
    console.info("borne")
    const rando = request.query.get("rando") 
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Parcours");
 
    const parc = await collection.find({rando: rando}).sort({ dayCounter: 1, pos: 1 }).toArray();
        
    console.info("parc", parc.length)
    let dayCounter = 1
    let currentBorne =0
    for (var i = 0; i < parc.length; i++) {
      if (parc[i].dayCounter === dayCounter) {
        currentBorne += parc[i].dist
        parc[i].borne = Math.round(currentBorne / 1000, 0)
      } else {
        dayCounter++
        currentBorne = 0
        parc[i].borne=0
      }
      console.info("result", i, parc[i].dayCounter, parc[i].borne)

          await collection.updateOne(
      { dayCounter: parc[i].dayCounter, rando:parc[i].rando, pos: parc[i].pos },
      {
        $set: {
          borne:parc[i].borne
        },
      }
    );
    }
    return {
      status: 200,
      body: {
        parc,
      },
    };
  } catch (err) {
    console.info("err", err)
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