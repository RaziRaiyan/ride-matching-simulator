const redis = require('redis');

const subscriber = redis.createClient();
const publisher = redis.createClient();

let drivers = {}; // Simple in-memory driver location storage

async function startMatchingService() {
	await subscriber.connect();
	await publisher.connect();

	await subscriber.subscribe('location-update', (message) => {
		const data = JSON.parse(message);
		if (data.available) {
			drivers[data.driverId] = data.location;
			console.log(
				`[Ride Matching Service]: Driver ${data.driverId} location updated.`,
			);
		} else {
			delete drivers[data.driverId];
		}
	});

	await subscriber.subscribe('ride-request', async (message) => {
		const request = JSON.parse(message);
		console.log(
			`[Ride Matching Service]: Received ride request from rider ${request.riderId}`,
		);

		// Simple nearest-driver matching (dummy implementation)
		let nearestDriverId = null;
		let nearestDistance = Infinity;

		for (let [driverId, location] of Object.entries(drivers)) {
			const dist = getDistance(request.pickupLocation, location);
			if (dist < nearestDistance) {
				nearestDistance = dist;
				nearestDriverId = driverId;
			}
		}

		if (nearestDriverId) {
			const matchEvent = {
				riderId: request.riderId,
				driverId: nearestDriverId,
				matchedAt: new Date().toISOString(),
			};
			await publisher.publish('ride-match', JSON.stringify(matchEvent));
			console.log(
				`[Ride Matching Service]: Matched rider ${request.riderId} with driver ${nearestDriverId}`,
			);

			// Once matched, temporarily mark driver unavailable
			delete drivers[nearestDriverId];
		} else {
			console.log('[Ride Matching Service]: No drivers available currently.');
		}
	});

	console.log('[Ride Matching Service]: Matching service started...');
}

function getDistance(loc1, loc2) {
	return Math.sqrt((loc1.lat - loc2.lat) ** 2 + (loc1.lng - loc2.lng) ** 2);
}

startMatchingService();
