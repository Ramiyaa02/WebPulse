const express = require('express');
const { analyzeWebsite, exportReport } = require('../controllers/analyzerController');

const router = express.Router();

router.post('/analyze', analyzeWebsite);
router.post('/export', exportReport);

module.exports = router;
