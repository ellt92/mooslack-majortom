var Botkit = require('botkit');
var request = require('request');
var schedule = require('node-schedule');
var controller = Botkit.slackbot();
var bot = controller.spawn({
    incoming_webhook: { url: 'https://hooks.slack.com/services/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' },
    token: 'xoxb-17122193508-xFeXpH97cJllkvsdTOJbnTMn'
});

bot.startRTM(function(err, bot, payload) {
    if(err) throw new Error('Could not connect to Slack');
});

function stringContains(first, second) {
    if (first.indexOf(second) != -1) {
        return true;
    } else {
        return false;
    }
}

module.exports = function(access_token) {
    controller.on('direct_mention', function(bot, message) {
        if (stringContains(message.text, 'test')) {
            var oauth = {
                url: 'http://gitlab.office.moo.com/api/v3/projects/create%2Fbuildhub/merge_requests?state=opened',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            };
            request.get(oauth, function(error, response, body) {
                bot.reply(message, 'test: ' + body);
            });
        } else {
            bot.reply(message, 'I heard you mention me!\nThe access_token is: ' + access_token);
        }
    });
    schedule.scheduleJob('55 9 * * 1-5', function() {
        var oauth = {
            url: 'http://gitlab.office.moo.com/api/v3/projects/create%2Fbuildhub/repository/branches/master',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        };
        request.get(oauth, function(error, response, body) {
            var branch = body;

            var commit_date  = new Date(JSON.parse(branch).commit.committed_date);
            var date = new Date();
            var seconds = (date.getTime() - commit_date.getTime())/1000;
            var lapsed_time = Math.floor(seconds / 86400) + ' days, ' + Math.floor(seconds / 3600 % 24)  + ' hours and ' + Math.floor(seconds / 60 % 60) + ' minutes';
            var time_since_buildhub_master_updated = 'It\'s been ' + lapsed_time +  ' since the master branch of buildhub was updated';

            bot.sendWebhook({
                text:'Morning, this is Major Tom to ground control. I\m pretty new so I don\'t have much to say, but I do have a single stat for the design-templates team:\n\n ' + time_since_buildhub_master_updated,
            }, function(err, response) {
            });
        });
    });
};


