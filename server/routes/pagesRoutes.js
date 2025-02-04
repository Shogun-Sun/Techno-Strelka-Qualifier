const express = require('express');
const router = express.Router();
const path = require('path');

const pagesPath = path.join(__dirname, '..', '..', 'public', 'pages');

router.get('/', (req, res) => {
    res.sendFile(path.join(pagesPath, 'index.html'));
})

module.exports = router;