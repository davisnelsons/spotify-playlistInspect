const querystring = require("querystring");
const client_id = 'b283c50de4d142e2b3163ca0d67de760'; // Your client id
const client_secret = 'f69729701dd4454d886aa8e15af7e8a2'; // Your secret
const redirect_uri = 'http://localhost:3000/authcallback';
var request = require("request");
var axios = require("axios");
var session;


//TODO: convert all requests to axios requests
module.exports = {
    index: function(req, res) {
        session = req.session;
        res.render("index", {title: "Express"});
    },
    authenticate: function(req, res) {
        res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            redirect_uri: redirect_uri
        }));
    },
    authCallback: function(req, res) {
        var code = req.query.code;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        var token;
        session = req.session;
        request.post(authOptions, function(error, response, body) {
            token = body.access_token; 
            // save token as session var
            session.token = token;
            request.get("http://localhost:3000/api/basicdata?"+
            querystring.stringify({
                token: token
            }), function(error, response, body) {
                body = JSON.parse(body);
                //console.log(body);
                res.render("playlists", {users_name: body.users_name, playlists: body.playlists});
            })
        })
        
    },
    analyzePlaylist: async function(req, res) {
        var token = req.session.token;
        var playlist_id = req.params.playlist_id;
        let playlist_data = await axios.get("http://localhost:3000/api/playlistdata", {
            params: {
                token: token,
                playlist_id: playlist_id
            }
        });
        playlist_data = playlist_data.data;

        let all_songs = await axios.get(
            "http://localhost:3000/api/allsongs", {
                params: {
                    token: token,
                    playlist_id: playlist_id
                }
            }
        );
        all_songs = all_songs.data;
        res.render("analyze", {playlist_data: playlist_data});
    }

}
