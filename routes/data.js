const express = require('express');
const router = express.Router();
const Data = require('../models/data');

// Get all data
router.get('/', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new data
router.post('/', async (req, res) => {
    const { data, type } = req.body;

    try {
        let existingData = await Data.findOne({ data });

        if (existingData) {
            if (existingData.transactions.length === 0) {
                // If it's the first time, add welcome message with timestamp
                existingData.transactions.push({ data, type, message: "Welcome!", timestamp: new Date().toLocaleString("en-US", { timeZone: "GMT" }) });
                await existingData.save();
                res.status(200).json({ message: "Welcome!", data: existingData });

                // Output "Welcome" message to frontend
                console.log("Welcome message sent to frontend");
            } else if (existingData.transactions.length === 1 && existingData.transactions[0].message === "Welcome!") {
                // If it's the second time, add goodbye message with timestamp and store full transaction array
                existingData.transactions.push({ data, type, message: "Goodbye!", timestamp: new Date().toLocaleString("en-US", { timeZone: "GMT" }) });
                const fullTransaction = existingData.transactions.slice(); // Make a copy of transactions array
                existingData.transactions = []; // Reset transactions array
                await existingData.save();
                res.status(200).json({ message: "Goodbye!", fullTransaction });

                // Output "Goodbye" message to frontend
                console.log("Goodbye message sent to frontend");
            } else {
                // If it's not the second time, return an error message
                res.status(400).json({ message: "Data already exists and has been processed." });
            }
        } else {
            // If data doesn't exist, create new document and add welcome message with timestamp
            const newData = new Data({ data, type, transactions: [{ data, type, message: "Welcome!", timestamp: new Date().toLocaleString("en-US", { timeZone: "GMT" }) }] });
            await newData.save();
            res.status(201).json({ message: "Welcome!", data: newData });

            // Output "Welcome" message to frontend
            console.log("Welcome message sent to frontend");
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
