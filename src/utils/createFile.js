// file system module to perform file operations
const fs = require("fs");

module.exports = (data) => {
  var jsonContent = JSON.stringify(data);

  fs.writeFile("output.json", jsonContent, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("Data saved to output.json!");
  });
  return;
};
