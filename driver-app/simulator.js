// driver-app/simulator.js
const redis = require('redis');
const client = redis.createClient({ url: 'redis://localhost:6379' });

async function updateDriverLocation(driverId) {
	const driverUpdate = {
		driverId: `driver${driverId}`,
		location: {
			lat: 37.7 + Math.random() * 0.1,
			lng: -122.5 + Math.random() * 0.1,
		},
		available: true,
		timestamp: new Date().toISOString(),
	};

	await client.publish('location-update', JSON.stringify(driverUpdate));
	console.log(`[Driver App]: Location updated by ${driverUpdate.driverId}`);
}

async function runDriverSimulation(totalDrivers, intervalMs) {
	await client.connect();
	try {
		// for (let update = 1; update <= updatesPerDriver; update++) {
		while (true) {
			for (let driverId = 1; driverId <= totalDrivers; driverId++) {
				await updateDriverLocation(driverId);
			}
			// console.log(`Completed update round ${update}`);
			await new Promise((resolve) => setTimeout(resolve, intervalMs));
		}
		// }
	} catch (err) {
		console.error('Error in runDriverSimulation:', err);
	} finally {
		await client.quit();
	}
}

// Simulate 100 drivers location updates with a 2s interval between updates
// Run the simulation for 50 updates
runDriverSimulation(100, 2000);
