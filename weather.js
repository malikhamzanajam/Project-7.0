const https = require('https');
const readline = require('readline');

// ---------------- Readline for user input ----------------
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ---------------- Weather Function ----------------
function getWeather(city) {
    console.log(`\nFetching weather for ${city}...`);

    const cityEncoded = city.replace(/ /g, '%20');
    const url = `https://wttr.in/${cityEncoded}?format=j1`;

    https.get(url, (res) => {
        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);

                if (!jsonData.current_condition) {
                    console.log("City not found. Please try again.\n");
                    return askCity();
                }

                const current = jsonData.current_condition[0];
                const tempC = parseInt(current.temp_C);
                const tempMin = tempC - 3;
                const tempMax = tempC + 3;

                console.log(`--- Weather in ${city} ---`);
                console.log(`Detected Temperature: ${tempC}°C`);
                console.log(`Temperature Range: ${tempMin}°C – ${tempMax}°C`);
                console.log(`Weather: ${current.weatherDesc[0].value}`);
                console.log(`Humidity: ${current.humidity}%`);
                console.log(`Wind: ${current.windspeedKmph} km/h`);

                // Add full city weather link
                console.log(`Full weather link: https://wttr.in/${cityEncoded}\n`);

                askCity(); // ask again

            } catch (e) {
                console.log("Error fetching weather. Check city name or internet connection.");
                console.log("Error:", e);
                askCity();
            }
        });

    }).on('error', (err) => {
        console.log("Request error:", err.message);
        askCity();
    });
}

// ---------------- Ask User for City ----------------
function askCity() {
    rl.question("Enter city name (or type 'exit' to quit): ", (city) => {
        if (city.toLowerCase() === 'exit') {
            console.log("Exiting Weather Assistant...");
            rl.close();
            return;
        }
        getWeather(city);
    });
}

// ---------------- Start Program ----------------
console.log("=== Weather Assistant ===");
askCity();
