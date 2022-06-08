var express = require('express');
var router = express.Router();
var controllerMain = require("../controllers/main");

/* GET home page. */
router.get("/", controllerMain.index);

router.get("/authenticate", controllerMain.authenticate)

router.get("/authcallback", controllerMain.authCallback);

router.get("/analyze/:playlist_id", controllerMain.analyzePlaylist);

module.exports = router;
