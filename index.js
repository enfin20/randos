import { connectToDatabase } from "$lib/db";
import { Double, ObjectId } from "mongodb";

export async function get(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Expenses");
    const expenses = await collection.find().sort({ _id: -1 }).toArray();
    for (var i = 0; i < expenses.length; i++) {
      expenses[i].key = expenses[i]._id;
    }

    return {
      status: 200,
      body: {
        expenses,
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
  // intégration d'une nouvelle expense
  const expense = JSON.parse(request.body);
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Expenses");

    let t = await collection.insertOne({
      month: expense.month,
      amount: Double(expense.amount),
      description: expense.description,
      category: expense.category,
    });

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
  const expense = JSON.parse(request.body);
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Expenses");
    await collection.updateOne(
      { _id: ObjectId(expense.key) },
      {
        $set: {
          month: expense.month,
          amount: Double(expense.amount),
          description: expense.description,
          category: expense.category,
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
    const collection = db.collection("Expenses");
    const expense = JSON.parse(request.body);
    if (expense.key != "ALL") {
      await collection.deleteOne({ _id: ObjectId(expense.key) });
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
