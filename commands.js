const cheerio = require("cheerio");
const puppeteer = require('puppeteer');
const fs = require('fs');
const Table = require('easy-table');

module.exports = {
    async getScore(user, task, taskMode, timePeriod) {
        if (taskMode == 'u') {
            taskMode = '0';
        } else if (taskMode == 'p') {
            taskMode = '1';
        } else if (taskMode == 's') {
            taskMode = '2';
        }

        if (timePeriod == 'a') {
            timePeriod = 'all';
        } else if (timePeriod == 'y') {
            timePeriod = 'year';
        } else if (timePeriod == 'm') {
            timePeriod = 'month';
        } else if (timePeriod == 'w') {
            timePeriod = 'week';
        }

        link = 'https://aimlabs.com/leaderboards?username=' + user + '&taskId=' + task + '&period=' + timePeriod + '&taskMode=' + taskMode;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link, {waitUntil: "networkidle0"});
        const pageHTML = await page.content();
        await browser.close();
        var $ = cheerio.load(pageHTML);
        rank = $('td')[0].children[1].children[0].data;
        score = $('td')[2].children[1].children[0].data;
        accuracy = $('td')[6].children[1].children[0].data;
        return [rank, score, accuracy];
    },

    async addToList(userName, actualName) {
        var curFileJSON = fs.readFileSync('leaderboard-list.json');
        var fileDataObject = JSON.parse(curFileJSON);
        a = JSON.stringify(fileDataObject);
        if (a.indexOf(userName) >= 0) {
            return 0;
        } else {
            let newObject = {
                aimlabsUserName: userName,
                name: actualName
            };    
            fileDataObject.userList.push(newObject);
            var newData = JSON.stringify(fileDataObject);
            fs.writeFile('leaderboard-list.json', newData, err => {
                if(err) throw err;
            });
            return 1;
        }
    },
    
    async removeFromList(userName) {
        var curFileJSON = fs.readFileSync('leaderboard-list.json');
        var fileDataObject = JSON.parse(curFileJSON);
        a = JSON.stringify(fileDataObject);
        if (a.indexOf(userName) >= 0) {
            for (user in fileDataObject.userList) {
                if (fileDataObject.userList[user].aimlabsUserName == userName) {
                    var deletedItem = fileDataObject.userList.splice(user, 1);
                }
            }
            var changedData = JSON.stringify(fileDataObject);
            fs.writeFile('leaderboard-list.json', changedData, err => {
                if(err) throw err;
            });
            return 1;
        } else {
            return 0;
        }
    },

    async createScoreboard(task, taskMode, timePeriod) {
        var curFileJSON = fs.readFileSync('leaderboard-list.json');
        var fileDataObject = JSON.parse(curFileJSON);
        tempArr = [];
        for (user in fileDataObject.userList) {
            [tempOverallRank, tempHighScore, tempAccuracy] = await this.getScore(fileDataObject.userList[user].aimlabsUserName, task, taskMode, timePeriod);
            tempArr.push({
                username: fileDataObject.userList[user].aimlabsUserName, 
                score: tempHighScore, 
                accuracy: tempAccuracy, 
                ovrRank: tempOverallRank
            });
        }

        tempArr.sort((a, b) => (
            parseInt(a.ovrRank, 10) > parseInt(b.ovrRank, 10) ? 1 : parseInt(b.ovrRank, 10) > parseInt(a.ovrRank, 10) ? -1 : 0));

        var t = new Table;
        tempArr.forEach(function(product) {
            t.cell('Overall Rank', product.ovrRank),
            t.cell('Username', product.username),
            t.cell('Score', product.score),
            t.cell('Accuracy', accuracy),
            t.newRow()
        });

        //console.log(t.toString());
        return (t.toString());

    }
};