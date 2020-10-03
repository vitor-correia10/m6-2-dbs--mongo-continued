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

module.exports = { getSeats };
