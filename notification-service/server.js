const redis = require('redis');
const subscriber = redis.createClient();

async function startNotificationService() {
	await subscriber.connect();

	await subscriber.subscribe('ride-match', (message) => {
		const match = JSON.parse(message);
		console.log(
			`[Notification Service]: 🔔 Notification:
            Rider ${match.riderId} matched with Driver ${match.driverId} at ${match.matchedAt}`,
		);
		// Here, you'd integrate real notifications (Firebase, SMS, etc.)
	});

	console.log('Notification service started...');
}

startNotificationService();
