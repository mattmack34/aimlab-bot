const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

var commands = require('./commands')

const acceptableInputs = {
    accTask: ['gridshot', 'microshot'],
    accTimePeriod: ['all', 'year', 'month', 'week']
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async message => {
    //console.log(message);
    var inputLine = message.content.split(' ');
    if (inputLine[0] == "ab!") {
        userIn = inputLine[1];
        taskIn = inputLine[2];
        timePeriodIn = inputLine[3];

        if ((acceptableInputs.accTask.indexOf(taskIn) > -1) && (acceptableInputs.accTimePeriod.indexOf(timePeriodIn) > -1)) {
            try {
                fR = await commands.getScore(userIn, taskIn, timePeriodIn);
                message.reply('Username: ' + userIn + '\nRank: ' + fR[0] + '\nScore: ' + fR[1] + '\nAccuracy: ' + fR[2]);
            } catch {
                message.reply("ERROR | Check inputs; otherwise, error in bot");
            }
        } else {
            message.reply("Inputs are not acceptable. Please check them and try again.");
        }
    }
});

client.login(token);