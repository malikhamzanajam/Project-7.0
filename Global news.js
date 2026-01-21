
import readline from "readline";

// Your NewsAPI key
const API_KEY = "13f10394d1ef449c8f6771fbf8208d5b";

// Categories dictionary
const categories = {
    "1": "business",
    "2": "economy",
    "3": "health",
    "4": "technology",
    "5": "wars",
    "6": "others"
};

// Function to wrap text
function wrapText(text, width = 100) {
    if (!text) return "";
    const regex = new RegExp(`(.{1,${width}})(\\s|$)`, "g");
    const matches = text.match(regex);
    return matches ? matches.join("\n") : text;
}

// Function to fetch news using fetch (built-in in Node.js v18+)
async function fetchNews({ category = null, query = null, pageSize = 50 }) {
    if (category === "others") query = "news";

    let url = query
        ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=${pageSize}&apiKey=${API_KEY}`
        : `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=${pageSize}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const news = await response.json();

        if (news.status !== "ok") {
            console.log("\n❌ Failed to fetch news\n");
            return;
        }

        const articles = news.articles || [];

        if (!articles.length) {
            console.log("\n⚠️ There is no news for this event now\n");
            return;
        }

        const title = query || `${category.toUpperCase()} NEWS`;
        console.log(`\n📰 ${title}\n${"-".repeat(50)}`);

        articles.forEach((article, index) => {
            const desc = article.description || article.title || "No description";
            console.log(`${index + 1}. ${wrapText(desc)}`);
            console.log(`   Source: ${article.source.name}`);
            console.log(`   URL: ${article.url}\n`);
        });
    } catch (err) {
        console.log("\n❌ Internet or API error\n");
    }
}

// Main loop
async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function question(prompt) {
        return new Promise(resolve => rl.question(prompt, resolve));
    }

    while (true) {
        console.log("\n==============================");
        console.log("       🌍 WORLD NEWS APP 🌍");
        console.log("==============================");
        console.log("1. World News");
        console.log("2. Exit");

        const choice = (await question("\nEnter your choice (1-2): ")).trim();

        if (choice === "2") {
            console.log("\n👋 Thank you for using the World News App");
            break;
        } else if (choice === "1") {
            console.log("\nSelect Category:");
            for (const [key, value] of Object.entries(categories)) {
                console.log(`${key}. ${value.charAt(0).toUpperCase() + value.slice(1)}`);
            }

            const catChoice = (await question("Enter choice (1-6): ")).trim();

            if (!categories[catChoice]) {
                console.log("\n❌ Invalid category");
                continue;
            }

            const selectedCategory = categories[catChoice];
            console.log(`\nFetching Global ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} news...\n`);
            await fetchNews({ category: selectedCategory, query: selectedCategory, pageSize: 50 });
        } else {
            console.log("\n❌ Invalid choice. Please select 1 or 2.");
        }
    }

    rl.close();
}

main();

