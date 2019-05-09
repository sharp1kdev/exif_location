const fs = require("fs");
const ExifImage = require("exif").ExifImage;
const dateFormat = require("dateformat");
const images = fs.readdirSync("img");

// Looping through images in `img` folder
images.forEach(img => {
    try {
        new ExifImage({image: "img/" + img}, (error, data) => {
            if (error) throw error;
            else {
                getExifInfo(img, data);
            }
        });
    } catch (error) {
    }
});

// Reading exif data,
// if lat & lon exists - formatting them to needed format
function getExifInfo(filename, data) {
    if (data.gps.GPSLatitude && data.gps.GPSLongitude) {

        // parsing additional info from filename
        // itemName_params_id_loc_....

        let info = filename.split("_");
        let itemName = info[0];
        let params = info[1];
        let id = info[2];
        let loc = info[3];


        let lat = data.gps.GPSLatitude;
        let latDir = data.gps.GPSLatitudeRef;
        let lon = data.gps.GPSLongitude;
        let lonDir = data.gps.GPSLontitudeRef;

        let ddLat = convertDMSToDD(lat[0], lat[1], lat[2], latDir);
        let ddLon = convertDMSToDD(lon[0], lon[1], lon[2], lonDir);

        writeToFile(filename + " => " + itemName + "@" + params + "@" + id + "@" + ddLat + "@" + ddLon + "@" + loc);
    }
}

// converting Degrees Minutes Seconds to Decimal Degrees
function convertDMSToDD(degrees, minutes, seconds, direction) {
    let dd = degrees + minutes / 60 + seconds / (60 * 60);

    if (direction === "S" || direction === "W") {
        dd = dd * -1;
    }

    // Returning decimal degrees limited to seven points
    return dd.toFixed(7);
}

// saving to output file
function writeToFile(line) {
    let timeStamp = dateFormat(new Date(), "dd.mm.yyyy h:MM:ss");
    fs.appendFileSync("out.txt", "[" + timeStamp + "] " + line + "\r\n");
}
