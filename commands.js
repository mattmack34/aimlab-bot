const cheerio = require("cheerio");
const puppeteer = require('puppeteer');


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
    }
};