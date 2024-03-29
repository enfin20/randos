import { connectToDatabase } from "$lib/db";
import { Double, ObjectId } from "mongodb";

export async function get(request) {
  try {
    const start = request.query.get("debutParcours") || 1;
    const end = request.query.get("finParcours") || 5000000;
    var freq =  1
    const rando = request.query.get("rando") 
    
    filter = [
  {
    $match:
      {
        $and:[{dayCounter:{$gte:Number(start)}},{dayCounter:{$lte:Number(end)}} ],
        rando: rando,
      },
  },
  {
    $group:
      {
        _id: {
          rando: {
            rando: "$rando",
          },
        },
        NbPoints: {
          $count: {},
        }
      },
  },
    ]
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collCount = db.collection("Parcours");
    const collection = db.collection("Parcours");
    const NbPoints = await collCount.aggregate(filter).toArray();

    console.info("NbPoints", NbPoints[0].NbPoints)
    freq= Math.max(Math.round(NbPoints[0].NbPoints/20000),1)
    console.info("freq", freq)

    const parcours = await collection.find({rando: rando,
      $and: [{dayCounter: { $gte: Number(start) }},
      {dayCounter: { $lte: Number(end) }} ,{pos: { $mod: [Number(freq), 0] }}] //{ pos: { $mod: [Number(freq), 0] } }
    }).sort({ dayCounter: 1, pos: 1 }).toArray();
    console.info("length", parcours.length)
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