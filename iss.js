const request = require("request");

const fetchMyIP = function (callback) {
  const urlIp = "https://api.ipify.org?format=json";

  request(urlIp, function (error, response, body) {
    if (error) {
      return callback(error, null);
    }
     if (response.statusCode !== 200) {
       const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
       callback(Error(msg), null);
       return;
     }
    
    const ip = JSON.parse(body);
    // console.log("data: ", data);
    // console.log("response", response)
    return callback(null, ip.ip);
    
  });
};



const fetchCoordsByIP = function (ip, callback) {
  const urlLatLong = `https://ipwho.is/${ip}`
  
  request(urlLatLong, function (error, response, body) {
    if (error) {
      return callback(error, null);
    }
    const siteInfo = JSON.parse(body);
    // console.log("siteInfo:🔥 ", siteInfo)
    console.log("siteInfo.message", siteInfo.message);

    if (!siteInfo.success) {
      const message = `Success status was ${siteInfo.success}. Server message says ${siteInfo.message} when fetching for IP ${siteInfo.ip}`;
      callback(Error(message), null);
    }
    const { latitude, longitude } = siteInfo;
    callback(null, { latitude, longitude });
  });
}
module.exports = {
  fetchMyIP,
  fetchCoordsByIP, 
};

// IPv4
// $ curl 'https://api.ipify.org?format=json'
// {"ip":"207.194.245.106"}
// console.error("error:", error); // Print the error if one occurred
// console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
// console.log("body:", body); // Print the HTML for the Google homepage.

 // if non-200 status, assume server error
