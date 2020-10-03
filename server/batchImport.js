const { MongoClient } = require('mongodb');
const assert = require('assert');

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Code that is generating the seats.
// ----------------------------------
const seats = [];
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
    for (let s = 1; s < 13; s++) {
        seats.push({
            _id: `${row[r]}-${s}`,
            price: 225,
            isBooked: false,
        });
    }
}

const batchImport = async () => {
    try {
        const client = await MongoClient(MONGO_URI, options);
        await client.connect();

        const db = client.db('m6-2-mongo');

        const r = await db.collection("seats").insertMany(seats);
        assert.strictEqual(seats.length, r.insertedCount);

        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

batchImport();