import { connectToDatabase } from "$lib/db";

export async function get(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Types");
    const categoryTypes = await collection.find().sort({ type: 1 }).toArray();
    for (var i = 0; i < categoryTypes.length; i++) {
      categoryTypes[i].key = categoryTypes[i].type;
    }

    return {
      status: 200,
      body: {
        categoryTypes,
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
  // intégration d'une nouvelle category
  const categoryTypes = JSON.parse(request.body);
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Types");

    let t = await collection.insertOne({ type: categoryTypes });

    return {
      status: 200,
      body: {
        message: categoryTypes.type,
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
  const category = JSON.parse(request.body);
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Types");
    await collection.updateOne(
      { type: category.key },
      {
        $set: {
          type: category.type,
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
    const collection = db.collection("Types");
    const category = JSON.parse(request.body);
    if (category.key != "ALL") {
      await collection.deleteOne({ type: category.key });
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
