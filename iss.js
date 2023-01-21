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

const fetchISSFlyOverTimes = function (coordinates, callback) {
const url = `https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;

   request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
     }
      const passes = JSON.parse(body).response;
      callback(null, passes);
  });
};


  
// -------
  const nextISSTimesForMyLocation = function(callback) {
    fetchMyIP((error, ip) => {
    
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};
// -------

module.exports = {
  fetchMyIP,
  fetchCoordsByIP, 
  fetchISSFlyOverTimes, 
  nextISSTimesForMyLocation, 
};


