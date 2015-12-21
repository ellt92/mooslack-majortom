var express = require('express');
var querystring = require('querystring');
var request = require('request');
var app = express();

var gitlab_url = 'http://gitlab.office.moo.com';

app.get('/gitlab_login', function(req, res) {
    var oauth = {
        client_id: '82128cc92191ea69f6ad2287faeb152b29561d460223b5920542e7feb7d3b2c2',
        redirect_uri: 'http://localhost:34560/callback',
        response_type: 'code'
    };
    res.redirect(gitlab_url + '/oauth/authorize?' + querystring.stringify(oauth));
});

app.get('/callback', function(req, res) {
    var oauth = {
        url: gitlab_url + '/oauth/token',
        form: {
            client_id: '82128cc92191ea69f6ad2287faeb152b29561d460223b5920542e7feb7d3b2c2',
            client_secret: '1b4942df6696983d5feb61e979e304a720e4d9d80c40e5930d0a2b7bf8ff322a',
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
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
