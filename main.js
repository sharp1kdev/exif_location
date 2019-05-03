const fs = require("fs");
const ExifImage = require("exif").ExifImage;
const dateFormat = require("dateformat");

let images = fs.readdirSync("img");

images.forEach(img => {
  try {
    new ExifImage({ image: "img/" + img }, (error, data) => {
      if (error) throw error;
      else {
        normalyzeData(img, data);
      }
    });
  } catch (error) {}
});

// Reading exif data, if lat & lon exists - logging them
function normalyzeData(filename, data) {
  if (data.gps.GPSLatitude && data.gps.GPSLongitude) {
    let lat = data.gps.GPSLatitude;
    let latDir = data.gps.GPSLatitudeRef;
    let lon = data.gps.GPSLongitude;
    let lonDir = data.gps.GPSLontitudeRef;

    let ddLat = ConvertDMSToDD(lat[0], lat[1], lat[2], latDir);
    let ddLon = ConvertDMSToDD(lon[0], lon[1], lon[2], lonDir);

    writeToFile(filename + " => " + ddLat + ", " + ddLon);
  }
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  }

  // Returning decimal degrees limited to seven points
  return dd.toFixed(7);
}

function writeToFile(line) {
  let timeStamp = dateFormat(new Date(), "dd.mm.yyyy h:MM:ss");
  fs.appendFileSync("out.txt", "[" + timeStamp + "] " + line + "\r\n");
}
