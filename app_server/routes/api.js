var express = require('express');
var router = express.Router();
var controllerAPI = require("../controllers/api");

/* GET users listing. */
router.get('/basicdata', controllerAPI.getBasicData);
router.get("/playlistdata", controllerAPI.getPlaylistData);
router.get("/allsongs", controllerAPI.getAllSongs);

module.exports = router;
