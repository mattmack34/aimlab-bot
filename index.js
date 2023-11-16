const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

var commands = require('./commands')

const acceptableInputs = {
    accTask: ['gridshot', 'microshot'],
    accTaskMode: ['u', 'p', 's'],
    accTimePeriod: ['a', 'y', 'm', 'w']
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
        if (inputLine[1] == "score") {
            userIn = inputLine[2];
            taskIn = inputLine[3];
            taskMode = inputLine[4];
            timePeriodIn = inputLine[5];

            if ((acceptableInputs.accTask.indexOf(taskIn) > -1) && (acceptableInputs.accTimePeriod.indexOf(timePeriodIn) > -1)) {
                try {
                    fR = await commands.getScore(userIn, taskIn, taskMode, timePeriodIn);
                    message.reply('\nRank: ' + fR[0] + '\nScore: ' + fR[1] + '\nAccuracy: ' + fR[2]);
                } catch {
                    message.reply("Data not found. User could not have a score for this time period.");
                }
            } else {
                message.reply("Inputs are not acceptable. Please check them and try again. \nAdditionally, use `ab! help` for more info.");
            }
        } else if (inputLine[1] == "help") {
            message.reply(
                "This discord bot uses a webscraper to grab information from aimlabs leaderboards.\n\n" +
                "**score** help:\n" +
                "Usage: `ab! score *username *taskname *taskmode *timePeriod`\n\n" +
                "`*username`: Aimlabs username of user you want to search for\n\n" +
                "`*taskname`: Name of the task you are searching tasks for. Can be any of the following [gridshot, microshot]\n\n" + 
                "`*taskmode`: Variant of the task. `u` for Ultimate, `p` for Precision, and `s` for Speed\n\n" +
                "`*timePeriod`: The Time Period to search for. `a` for all time, `y` for the past year, `m` for the past month, and `w` for the past week\n" +
                "**Example Usage**\n" +
                "```ab! score derp gridshot u a```"
            )
        }
    }
});

client.login(token);