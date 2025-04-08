const redis = require('redis');
const client = redis.createClient();

async function simulateRideRequest(riderId) {
	const rideRequest = {
		riderId: `rider${riderId}`,
		pickupLocation: {
			lat: 37.7 + Math.random() * 0.1, // Random SF latitude
			lng: -122.5 + Math.random() * 0.1, // Random SF longitude
		},
		requestedAt: new Date().toISOString(),
	};

	await client.publish('ride-request', JSON.stringify(rideRequest));
	console.log(`[Rider App]: Ride requested by ${rideRequest.riderId}`);
}

async function runSimulation(totalRiders, intervalMs) {
	await client.connect();

	for (let i = 1; i <= totalRiders; i++) {
		simulateRideRequest(i);

		// Throttle requests slightly to avoid overwhelming the system instantly
		// if (i % 100 === 0) {
		await new Promise((resolve) => setTimeout(resolve, intervalMs));
		// }
	}

	await client.quit();
}

// Simulate 1000 riders with a 500ms delay per 100 riders
runSimulation(1000, 500);
