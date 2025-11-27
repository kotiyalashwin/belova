export function generateRandomString(length = 12) {
	const dateTime = new Date().toISOString().replace(/[-:.TZ]/g, "");

	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let randomPart = "";
	for (let i = 0; i < length; i++) {
		randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return dateTime + randomPart;
}


