import { connectToDatabase } from "$lib/db";

export async function get(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Categories");
    const categories = await collection.find().sort({ category: 1 }).toArray();
    for (var i = 0; i < categories.length; i++) {
      categories[i].key = categories[i].category;
    }

    return {
      status: 200,
      body: {
        categories,
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
  const categories = JSON.parse(request.body);
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Categories");

    let t = await collection.insertOne({
      category: categories.category,
      type: categories.type,
    });

    return {
      status: 200,
      body: {
        message: categories.category,
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
    const collection = db.collection("Categories");
    await collection.updateOne(
      { category: category.key },
      {
        $set: {
          category: category.category,
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
    const collection = db.collection("Categories");
    const category = JSON.parse(request.body);
    if (category.key != "ALL") {
      await collection.deleteOne({ category: category.key });
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
