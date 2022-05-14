const rp = require("request-promise");
const cheerio = require("cheerio");
const createFile = require("./utils/createFile");
const { asin, keywords_to_check } = require("./utils/config");

module.exports = async () => {
  try {
    console.log("Setting zipcode...");
    const jar = rp.jar();
    const res = await rp(
      "https://www.amazon.com/gp/delivery/ajax/address-change.html",

      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          contenttype: "application/x-www-form-urlencoded;charset=utf-8",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
          origin: "https://www.amazon.com",
          "anti-csrftoken-a2z":
            "gAn5vKfXqbXyarP6/yovq8a+mXlcyl+sFWAm9rwAAAAMAAAAAGJ8taRyYXcAAAAA",
        },
        body: JSON.stringify({
          locationType: "LOCATION_INPUT",
          zipCode: "11001",
          storeContext: "generic",
          deviceType: "web",
          pageType: "Search",
          actionSource: "glow",
          almBrandId: "undefined",
        }),
        jar,
        resolveWithFullResponse: true,
      }
    );
    console.log("Zipcode set with status code", res.statusCode);
    const keywords = keywords_to_check.split(",");
    let payload = {};
    for (var i = 0; i < keywords.length; i++) {
      const response = await rp(
        `https://www.amazon.com/s?k=${asin}+${keywords[i]}&ref=nb_sb_noss`,
        {
          jar,
        }
      );
      const $ = cheerio.load(response);
      const div = $(".s-breadcrumb").html();
      if (!div) payload[keywords[i]] = "No";
      //   const data = cheerio.load(div);
      //   const results = data("span").html();
      else payload[keywords[i]] = "Yes";
    }
    createFile(payload);
  } catch (error) {
    console.error("error runnig script", error);
  }
};
