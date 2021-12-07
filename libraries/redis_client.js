const rdsClient = require('redis').createClient();
rdsClient.on("error", function (error) {
  console.error(error);
});

module.exports = rdsClient;