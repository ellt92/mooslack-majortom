var express = require('express');
var querystring = require('querystring');
var request = require('request');
var app = express();

var gitlab_url = 'http://gitlab.office.moo.com';

var my_client_id;
var my_secret_id;

app.get('/gitlab_login', function(req, res) {
    var oauth = {
        client_id: my_client_id,
        redirect_uri: 'http://localhost:34560/callback',
        response_type: 'code'
    };
    res.redirect(gitlab_url + '/oauth/authorize?' + querystring.stringify(oauth));
});

app.get('/callback', function(req, res) {
    var oauth = {
        url: gitlab_url + '/oauth/token',
        form: {
            client_id: my_client_id,
            client_secret: my_secret_id,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:34560/callback'
        }
    };
    request.post(oauth, function(error, response, body) {
        var access_token = JSON.parse(body).access_token;
        require('./bot')(access_token);
        res.send('completed!');
    });
});

//finally start the application
var server = app.listen(34560, function() {

    my_client_id = process.argv[2];
    my_secret_id = process.argv[3];

    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
