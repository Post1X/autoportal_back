import Cities from "../schemas/CitiesSchema";

export async function checkIfInside(spotCoordinates) {

    let newRadius = distanceInKmBetweenEarthCoordinates(spotCoordinates[0], spotCoordinates[1], center.lat, center.lng);
    console.log(newRadius)
    if (newRadius < radius) {
        console.log('inside')
    } else if (newRadius > radius) {
        console.log('outside')
    } else {
        console.log('on the circle')
    }

}

export async function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;
    var dLat = await degreesToRadians(lat2 - lat1);
    var dLon = await degreesToRadians(lon2 - lon1);
    lat1 = await degreesToRadians(lat1);
    lat2 = await degreesToRadians(lat2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

export async function findNearestCities(centerLongitude, centerLatitude, maxDistance) {
    const distance = await Cities.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [centerLongitude, centerLatitude]
                },
                distanceField: "distance",
                maxDistance: maxDistance * 1000,
                spherical: true
            }
        }
    ]);
    return distance;
}
