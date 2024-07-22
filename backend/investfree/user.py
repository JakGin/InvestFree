import json

from .models import User, StockOwnership, Transaction
from .utils import GlobalState


def get_user_stocks(user: User) -> tuple[list, float]:
    """
    Returns a tuple where first argument is list of user's stocks in this format:
    [
        {
            "stockSymbol": str,
            "stockName": str,
            "quantity": int,
            "lastClosePrice": float,
            "lastPriceChange": float,
            "lastPriceChangePercentage": float,
            "profit": float
        },
        ...
    ]
    and second argument the money in stocks.
    """
    stocks_owned = StockOwnership.objects.filter(user=user)

    with open("investfree/stock_data.json", "r") as json_file:
        api_stocks = json.load(json_file)

    money_in_stocks = 0
    stocks_owned_list = []
    for stock in stocks_owned:
        current_close_price = 0
        current_open_price = 0

        api_stock = api_stocks[stock.stock_symbol]
        current_close_price = api_stock["close_price"]
        current_open_price = api_stock["open_price"] 

        money_in_stocks += current_close_price * stock.quantity

        # Update profit
        stock_profit = (
            stock.quantity * (current_close_price - stock.last_unit_price)
        ) + stock.profit

        stocks_owned_list.append(
            {
                "stockSymbol": stock.stock_symbol,
                "stockName": stock.stock_name,
                "quantity": stock.quantity,
                "lastClosePrice": current_close_price,
                "lastPriceChange": current_close_price - current_open_price,
                "lastPriceChangePercentage": (
                    (current_close_price - current_open_price) / current_open_price
                )
                * 100,
                "profit": stock_profit,
            }
        )

    return stocks_owned_list, money_in_stocks
