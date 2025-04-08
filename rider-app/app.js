const redis = require('redis');
const client = redis.createClient();

async function requestRide(riderId, location) {
    const rideRequest = {
        riderId,
        pickupLocation: location,
        requestedAt: new Date().toISOString()
    };

    await client.connect();
    await client.publish('ride-request', JSON.stringify(rideRequest));
    console.log(`Ride requested by rider ${riderId}`);
    await client.quit();
}

// Example usage:
requestRide('rider1001', { lat: 37.77, lng: -122.41 });
