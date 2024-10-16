// Default Office Location (latitude, longitude)
const officeLat =  17.4484;  // Example latitude for Melbourne, adjust as needed
const officeLon = 78.3830;  // Example longitude for Melbourne, adjust as needed
const distanceThreshold = 500;  // 500 meters

// Function to calculate distance between two locations using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
}

// Function to fetch user's location by IP address
async function getUserLocation() {
    const response = await fetch('https://ipinfo.io?token=43e1137f8c2858');  // Use your ipinfo.io API token here
    const data = await response.json();
    const [lat, lon] = data.loc.split(',');
    return { lat: parseFloat(lat), lon: parseFloat(lon), address: data.city + ', ' + data.region + ', ' + data.country };
}

// Main function to check distance and show pop-up or redirect
async function checkLocation() {
    const userLocation = await getUserLocation();
    const distance = calculateDistance(officeLat, officeLon, userLocation.lat, userLocation.lon);

    if (distance > distanceThreshold) {
        // Show pop-up
        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');
        popupMessage.innerText = `You are far away from the office. Your current location is ${userLocation.address}, and the distance is ${distance.toFixed(2)} meters.`;
        popup.style.display = 'block';

        // Close pop-up functionality
        document.getElementById('close-popup').addEventListener('click', () => {
            popup.style.display = 'none';
        });
    } else {
        // Redirect to PowerApps link
        window.location.href = 'https://apps.powerapps.com/play/e/default-c09afb75-1cf8-46ca-9c5e-0a01bfbd86f2/a/da6abc26-4882-4681-89e0-709dba447700?tenantId=c09afb75-1cf8-46ca-9c5e-0a01bfbd86f2&hint=857d0959-b069-46c2-96f9-3fbf3f1d5fc6&sourcetime=1729052168205&source=portal';
    }
}

// Run the check when the page loads
checkLocation();
