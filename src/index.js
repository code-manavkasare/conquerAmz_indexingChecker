require("dotenv").config();
const script = require("./script");
const cron = require("node-cron");
const { interval } = require("./utils/config");

console.log("The script will run every minute");
cron.schedule(interval, () => {
  script();
});
