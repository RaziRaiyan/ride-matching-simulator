const redis = require('redis');
const client = redis.createClient();

async function updateDriverLocation(driverId, location, available=true) {
    const driverUpdate = {
        driverId,
        location,
        available,
        timestamp: new Date().toISOString()
    };

    await client.connect();
    await client.publish('location-update', JSON.stringify(driverUpdate));
    console.log(`Driver ${driverId} updated location.`);
    await client.quit();
}

// Example usage:
updateDriverLocation('driver2001', { lat: 37.78, lng: -122.40 });
