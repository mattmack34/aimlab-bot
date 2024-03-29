const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
var commands = require('./commands');

const acceptableInputs = {
    accTask: ['gridshot', 'microshot', 'detection', 'headshot', 'motionshot', 'motiontrack', 'multishot', 'switchtrack'],
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
    var inputLine = message.content.split(' ');
    if (inputLine[0] == "ab!") {
        if (inputLine[1] == "score") {
            //Gets score with given inputs
            try {
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
            } catch (tryError) {
                message.reply("Error in bot : " + tryError);
            }
        } else if (inputLine[1] == "add") {
            //Add a given user to the list
            try {
                userIn = inputLine[2];
                nameIn = inputLine[3];
                fR = await commands.addToList(userIn, nameIn);
                if (fR == 0) {
                    message.reply("Username is already in the list");
                } else if (fR == 1) {
                    message.reply("Username added to list");
                }
            } catch (tryError) {
                message.reply("Error in bot : " + tryError);
            } 
        } else if (inputLine[1] == "rm") {
            //Remove a given user from the list
            try {
                userIn = inputLine[2];
                fR = await commands.removeFromList(userIn);
                if (fR == 0) {
                    message.reply("Username not found in list");
                } else if (fR == 1) {
                    message.reply("Username removed from all instances in list");
                }
            } catch (tryError) {
                message.reply("Error in bot : " + tryError);
            }
        } else if (inputLine[1] == "scoreboard") {
            //Creates a scoreboard of a given task
            try {
                taskIn = inputLine[2];
                taskMode = inputLine[3];
                timePeriodIn = inputLine[4];
                if ((acceptableInputs.accTask.indexOf(taskIn) > -1) && (acceptableInputs.accTimePeriod.indexOf(timePeriodIn) > -1)) {
                    try {
                        message.reply("Fetching all values...");
                        fR = await commands.createScoreboard(taskIn, taskMode, timePeriodIn);
                        message.reply("```" + fR + "```");
                    } catch (tryError) {
                        message.reply("Error in bot : " + tryError);
                    }
                } else {
                    message.reply("Inputs are not acceptable. Please check them and try again. \nAdditionally, use `ab! help` for more info.");
                }
            } catch (tryError) {
                message.reply("Error in bot : " + tryError);
            }
        } else if (inputLine[1] == "help") {
            //Help function: Gives user help with bot functions
            message.reply(
                "This discord bot uses a webscraper to grab information from aimlabs leaderboards.\n\n" +
                "**score** help:\n" +
                "Usage: `ab! score *username *taskname *taskmode *timePeriod`\n\n" +
                "`*username`: Aimlabs username of user you want to search for\n\n" +
                "`*taskname`: Name of the task you are searching tasks for. Can be any of the following `[gridshot, microshot, detection, headshot, motionshot, motiontrack, multishot, switchtrack]`\n\n" + 
                "`*taskmode`: Variant of the task. `u` for Ultimate, `p` for Precision, and `s` for Speed\n\n" +
                "`*timePeriod`: The Time Period to search for. `a` for all time, `y` for the past year, `m` for the past month, and `w` for the past week\n" +
                "**Example Usage**\n" +
                "```ab! score derp gridshot u a```" +
                "\n\n" +

                "**scoreboard** help:\n" +
                "Usage: `ab! scoreboard *taskname *taskmode *timePeriod`\n\n" +
                "`*taskname`: Name of the task you are searching tasks for. Can be any of the following `[gridshot, microshot, detection, headshot, motionshot, motiontrack, multishot, switchtrack]`\n\n" + 
                "`*taskmode`: Variant of the task. `u` for Ultimate, `p` for Precision, and `s` for Speed\n\n" +
                "`*timePeriod`: The Time Period to search for. `a` for all time, `y` for the past year, `m` for the past month, and `w` for the past week\n" +
                "**Example Usage**\n" +
                "```ab! scoreboard gridshot u a```" + 
                "\n\n" + 

                "**add** help:\n" +
                "Usage: `ab! add *username *actualName`\n\n" +
                "`*username`: Aimlabs username of user you want to add to list`\n\n" + 
                "`*actualName`: Actual (or just display for list) name of user\n\n" +
                "**Example Usage**\n" +
                "```ab! add derp Jack```" +
                "\n\n" + 

                "**rm** help:\n" +
                "Usage: `ab! rm *username`\n\n" +
                "`*username`: Aimlabs username of user you want to remove from the list`\n\n" + 
                "**Example Usage**\n" +
                "```ab! rm derp```"
            );
        }
    }
});

client.login(token);