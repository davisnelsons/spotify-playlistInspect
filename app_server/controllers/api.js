const client_id = '--'; // Your client id
const client_secret = '--'; // Your secret
const redirect_uri = 'http://localhost:3000/authcallback';
const request = require("request");
const axios = require("axios");


module.exports = {
    getBasicData: async function(req, res) {
        var token = req.query.token;
        let username = fetchUserName(token);
        let userplaylists = fetchUsersPlaylists(token);
        let data = await Promise.all([username, userplaylists])
        data = {
            users_name: data[0].display_name,
            playlists: data[1].items
        };

        res.send(data);
    },
    getPlaylistData: async function(req, res) {
        var token = req.query.token;
        var pl_id = req.query.playlist_id;
        let playlistdata = await fetchPlaylistData(token, pl_id);
        res.send(playlistdata);
    },
    getAllSongs: async function(req, res) {
        var token = req.query.token;
        var pl_id = req.query.playlist_id;
        let firstBatch = await fetchFirstBatch(token, pl_id);
        let remainingBatchCount = getRemainingBatchCount(firstBatch)
        if(remainingBatchCount == 0) {
            res.send(firstBatch);
        }
        else
        {
           for (let i = 0; i < remainingBatchCount; i++) {
                
           } 
        }
    } 
}


async function fetchUserName(token) {
    //console.log("in fetchusername");
    
    let resp = await axios
        ({
            method: "get",
            url:"https://api.spotify.com/v1/me",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    return resp.data;
}
async function fetchUsersPlaylists(token) {
    //console.log("in fetchuserplaylists");
    let resp = await axios
        ({
            method:"get",
            url: "https://api.spotify.com/v1/me/playlists",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    return resp.data;
}

async function fetchPlaylistData(token, playlist_id) {
    let url = "https://api.spotify.com/v1/playlists/" + playlist_id;
    let resp = await axios
        ({
            method: "get",
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            params: {
                'fields': 'name, followers(total), tracks(total)'
            }
        });
    return resp.data;
}
async function fetchFirstBatch(token, playlist_id) {
    let resp = await axios.get(
        "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks",
        {
            headers:{
                'Authorization': 'Bearer ' + token
            },
            params: {
                'fields': 'items, total',
                'limit': 50
            }
        }
    )
    return resp.data;
}



function getRemainingBatchCount(firstBatch) {
    console.log(firstBatch);
    if (firstBatch.total <= 50) {
        return 0;
    } else {
        let rem =  Math.floor(firstBatch.total / 50);
        console.log(rem + " batches remaining!");
        return rem;        
    }
}