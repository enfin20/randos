import { connectToDatabase } from "$lib/db";

export async function get(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Thesaurus");
    const thesaurus = await collection.find().toArray();

    return {
      status: 200,
      body: {
        thesaurus,
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
  try {
    const thesaurus = JSON.parse(request.body);
    console.info("insert", thesaurus)
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Thesaurus");

    let t = await collection.insertOne(thesaurus);

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
    const thesaurus = JSON.parse(request.body);
    console.info("thesaurus", thesaurus)
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Thesaurus");

    await collection.updateOne(
      { word: thesaurus.word },
      {
        $set: {
          shortcut:thesaurus.shortcut
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
