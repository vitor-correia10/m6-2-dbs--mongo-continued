'use strict';

const { MongoClient } = require('mongodb');
const assert = require('assert');
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

const getSeats = async (req, res) => {
    try {
        const client = await MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db('m6-2-mongo');
        const seats = await db.collection('seats').find().toArray();
        const response = {};

        seats.forEach((seat) => {
            response[seat._id] = seat;
        });

        res.status(201).json({
            seats: response,
            numOfRows: NUM_OF_ROWS,
            seatsPerRow: SEATS_PER_ROW,
        });

        client.close();
    } catch (err) {
        res.status(404).json({ status: 404, data: "Not Found" });
    }
};

const bookSeat = async (req, res) => {
    const client = await MongoClient(MONGO_URI, options);
    const { seatId, fullName, email, creditCard, expiration } = req.body;

    if (!fullName || !email || !creditCard || !expiration) {
        return res.status(400).json({
            status: 400,
            message: "Please provide all informations!",
        });
    }

    try {
        await client.connect();
        const db = client.db('m6-2-mongo');

        const query = { _id: seatId };
        const newValues = { $set: { isBooked: true, fullName, email } };

        const u = await db.collection("seats").updateOne(query, newValues);
        assert.strictEqual(1, u.matchedCount);
        assert.strictEqual(1, u.modifiedCount);

        res.status(200).json({
            status: 200,
            success: true,
        });

        client.close();
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }

};

module.exports = { getSeats, bookSeat };
