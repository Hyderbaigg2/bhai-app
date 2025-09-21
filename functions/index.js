const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();

const app = express();

// Example API endpoint
app.get("/hello", (req, res) => {
  res.status(200).send({ message: "Hello from the API!" });
});

// Add more routes here in the future, for example:
// app.post("/cashfree-webhook", (req, res) => { ... });

// Expose Express API as a single Cloud Function.
exports.api = functions.https.onRequest(app);
