import urllib.request
import json
import textwrap

API_KEY = "13f10394d1ef449c8f6771fbf8208d5b"  # Your NewsAPI key

# Categories dictionary
categories = {
    "1": "business",
    "2": "economy",
    "3": "health",
    "4": "technology",
    "5": "wars",
    "6": "others"
}

# Function to fetch news
def fetch_news(category=None, query=None, page_size=50):
    if category == "others":
        query = "news"

    if query:
        url = f"https://newsapi.org/v2/everything?q={query}&language=en&pageSize={page_size}&apiKey={API_KEY}"
    else:
        url = f"https://newsapi.org/v2/top-headlines?category={category}&pageSize={page_size}&apiKey={API_KEY}"

    try:
        with urllib.request.urlopen(url) as response:
            data = response.read()

        news = json.loads(data)

        if news.get("status") != "ok":
            print("\n❌ Failed to fetch news\n")
            return

        articles = news.get("articles", [])

        if not articles:
            print("\n⚠️ There is no news for this event now\n")
            return

        title = query if query else f"{category.upper()} NEWS"
        print(f"\n📰 {title}\n" + "-" * 50)

        for i, article in enumerate(articles, start=1):
            desc = article.get("description") or article.get("title") or "No description"
            wrapped_desc = "\n".join(textwrap.wrap(desc, width=100))

            print(f"{i}. {wrapped_desc}")
            print(f"   Source: {article['source']['name']}")
            print(f"   URL: {article['url']}\n")

    except:
        print("\n❌ Internet or API error\n")

# Main loop
def main():
    while True:
        print("\n==============================")
        print("       🌍 WORLD NEWS APP 🌍")
        print("==============================")
        print("1. World News")
        print("2. Exit")

        choice = input("\nEnter your choice (1-2): ").strip()

        if choice == "2":
            print("\n👋 Thank you for using the World News App")
            break

        elif choice == "1":
            print("\nSelect Category:")
            for key, value in categories.items():
                print(f"{key}. {value.title()}")

            cat_choice = input("Enter choice (1-6): ").strip()

            if cat_choice not in categories:
                print("\n❌ Invalid category")
                continue

            selected_category = categories[cat_choice]
            print(f"\nFetching Global {selected_category.title()} news...\n")
            fetch_news(category=selected_category, query=selected_category, page_size=50)

        else:
            print("\n❌ Invalid choice. Please select 1 or 2.")

if __name__ == "__main__":
    main()
