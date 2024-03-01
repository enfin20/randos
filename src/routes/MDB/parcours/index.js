import { connectToDatabase } from "$lib/db";
import { Double, ObjectId } from "mongodb";

export async function get(request) {
  try {
    const start = request.query.get("debutParcours") || 1;
    const end = request.query.get("finParcours") || 5000000;
    var freq =  1
    const rando = request.query.get("rando") 
    var parcours = []

    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Parcours");
 
    const parc = await collection.find({rando: rando,
      $and: [{ dayCounter: { $gte: Number(start) } },
      { dayCounter: { $lte: Number(end) } } ] //{ pos: { $mod: [Number(freq), 0] } }
    }).sort({ dayCounter: 1, pos: 1 }).toArray();
        
    console.info("parc", parc.length)
    freq= Math.max(Math.round(parc.length/20000),1)
    console.info("freq", freq)
   for (var i = 0; i < parc.length; i++) {
      if (i > 0) {
        parc[i].distCumul = parc[i - 1].distCumul + Number(parc[i].dist || 0);
      } else {
        parc[0].distCumul = Number(parc[0].dist || 0);
      }
      if (i % freq === 0 || parc[i].rupture) {
        parcours.push(parc[i])
      }
    }
    console.info("parcours", parcours.length)
    console.info("distmax",parcours[parcours.length-1].distCumul)
    return {
      status: 200,
      body: {
        parcours,
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