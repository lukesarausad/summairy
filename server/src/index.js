import { getSummary, displayHistory } from './routes.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// const express = require('express');
// const cors = require('cors');


const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.post('/searchSummary', getSummary);

// app.get('/lastResponse', getLast);

app.get('/getHistory', displayHistory);

// app.post('/searchSummary', (req, res) => {
//   res.send({
//     originalArticle: "Hello",
//     summary: "Summary",
//     url: "url.com"
// });
// });

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
