import { connectToDatabase } from "$lib/db";
import { ObjectId } from "mongodb";

export async function get(request) {
  try {
    const s = request.query.get("sort") || 1;
    const map = request.query.get("map") || ""
    const rando = request.query.get("rando") 
    var filter = new Object()
    // spécifique pour permettre l'affichage de la carte quand le parcours n'est pas terminé
    if (map === "ok") {
      filter = {cumul:{$gt:0}, rando:rando}
    }else{filter = {rando:rando}}
    var sort = new Object();
    sort = {day: Number(s)};
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Roadbook");
    const roadbook = await collection.find(filter).sort(sort).toArray();
    for (var i = 0; i < roadbook.length; i++) {
      if (roadbook[i].dayCounter === undefined) {
        roadbook[i].dayCounter = i+1
      }
    }
    return {
      status: 200,
      body: {
        roadbook,
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
  // intégration d'un nouveau jour
  try {
    const roadbook = JSON.parse(request.body);
    console.info("insert", roadbook)
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Roadbook");

    let t = await collection.insertOne(roadbook);

    return {
      status: 200,
      body: {
        insertedId: t.insertedId.toString(),
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

export async function put(request) {
  try {
    const roadbook = JSON.parse(request.body);
    console.info("update", roadbook)
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Roadbook");

    await collection.updateOne(
      { dayCounter: roadbook.dayCounter },
      {
        $set: {
          day:roadbook.day,
          start: roadbook.start,
          end: roadbook.end,
          weather: roadbook.weather,
          difficulty: roadbook.difficulty,
          night: roadbook.night,
          landscape: roadbook.landscape,
          mood: roadbook.mood,
          detail: roadbook.detail,
          summary: roadbook.summary,
          dayCounter:roadbook.dayCounter,
          debutParcours: roadbook.debutParcours,
          finParcours: roadbook.finParcours,
          dist: roadbook.dist,
          eleNeg:roadbook.eleNeg,
          elePos: roadbook.elePos,
          stepsAnne: roadbook.stepsAnne,
          stepsOlivier: roadbook.stepsOlivier,
          cumul:roadbook.cumul,
          rando: roadbook.rando,
          debutParcoursLat: roadbook.debutParcoursLat,
          debutParcoursLng: roadbook.debutParcoursLng,
          finParcoursLat: roadbook.finParcoursLat,
          finParcoursLng:roadbook.finParcoursLng
        },
      }
    );

    return {
      status: 200,
      body: {
        message: "Success",
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

export async function del(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Roadbook");
    const roadbook = JSON.parse(request.body);

    if (roadbook.key != "ALL") {
      await collection.deleteOne({ day: roadbook.key });
    } else {
      await collection.deleteMany();
    }

    return {
      status: 200,
      body: {
        message: "Success",
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
