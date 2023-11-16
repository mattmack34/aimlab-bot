const cheerio = require("cheerio");
const puppeteer = require('puppeteer');


module.exports = {
    async getScore(user, task, timePeriod) {

        link = 'https://aimlabs.com/leaderboards?username=' + user + '&taskId=' + task + '&period=' + timePeriod;

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