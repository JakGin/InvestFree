import threading
import json
import time
import os
import csv
import requests

from datetime import datetime, timedelta

from django.apps import AppConfig
from django.conf import settings
from dotenv import load_dotenv

from .utils import GlobalState


load_dotenv()


def fetch_stock_data():
    """
    Fetch stock data from the Polygon API and save it to a JSON file every 24
    hours. If the data is not available from today, it will try they data from yesterday, the day before yesterday, and so on, up to 5 days back.
    API documentation: https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date
    """
    if settings.DEBUG:
        print("Debug mode is on, skipping stock data fetch.")
        return

    while True:
        max_days_back = 5
        current_data = None
        today = datetime.today()

        for _ in range(max_days_back):
            formatted_date = today.strftime("%Y-%m-%d")
            api_url = f"https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/{formatted_date}?adjusted=true&apiKey={os.getenv('POLYGON_STOCK_API_KEY')}"

            try:
                response = requests.get(api_url)

                if response.status_code == 200:
                    if current_data is None:
                        current_data = response.json()
                        if current_data["queryCount"] == 0:
                            print(
                                f"No stock data available for {formatted_date}. Trying previous day."
                            )
                            current_data = None
                else:
                    print(
                        f"Failed to fetch stock data for {formatted_date}. Status code: {response.status_code}"
                    )
            except Exception as e:
                print(f"An error occurred: {e}")

            if current_data is not None:
                break

            # Go back one day
            today -= timedelta(days=1)

        # if current_data is None or previous_data is None:
        if current_data is None:
            print("Failed to fetch stock data after 5 attempts.")
        else:
            stocks = current_data["results"]

            with open("investfree/symbol_name_mapping.csv") as csv_file:
                reader = csv.reader(csv_file)
                symbol_name_mapping = {row[0]: row[1] for row in reader}
                api_stocks = {
                    stock["T"]: {
                        "name": symbol_name_mapping[stock["T"]],
                        "close_price": stock["c"],
                        "open_price": stock["o"],
                        "high": stock["h"],
                        "low": stock["l"],
                        "timestamp": stock["t"],
                    }
                    for stock in stocks
                    if stock["T"] in symbol_name_mapping
                }

                sorted_api_stocks = {key: api_stocks[key] for key in sorted(api_stocks)}

            try:
                with open("investfree/stock_data.json", "w") as json_file:
                    json.dump(sorted_api_stocks, json_file)
            except Exception as e:
                print(f"An error occurred: {e}")
            else:
                print("Successfully fetched stock data.")

        # Wait for 24 hours (86400 seconds)
        time.sleep(86400 / 4)


class InvestfreeConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "investfree"

    def ready(self):
        thread = threading.Thread(target=fetch_stock_data, daemon=True)
        thread.start()
