// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyzerRoutes = require('./routes/analyzerRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', analyzerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
