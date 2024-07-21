import json

from investfree.models import User, StockOwnership, Transaction


def user_stock_profit(
    user: User, stock: StockOwnership, current_close_price: float
) -> float:
    transactions = Transaction.objects.filter(
        user=user, stock_symbol=stock.stock_symbol
    ).order_by("-date")

    profit = 0.0
    count_shares = 0
    user_shares = stock.quantity

    for transaction in transactions:
        if transaction.type == "buy":
            count_shares += transaction.quantity
            if count_shares >= user_shares:
                units = transaction.quantity - (count_shares - user_shares)
                profit += units * (current_close_price - transaction.unit_price)
                if stock.stock_symbol == "AMZN": 
                    print("current close price:", current_close_price)
                    print("transaction unit price:", transaction.unit_price)
                return profit
            else:
                units = transaction.quantity
                profit += units * (current_close_price - transaction.unit_price)

    return profit


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
        data = json.load(json_file)
        stocks_from_api: list = data["results"]

    money_in_stocks = 0
    stocks_owned_list = []
    for stock in stocks_owned:
        current_close_price = 0
        current_open_price = 0

        for stock_api in stocks_from_api:
            if stock_api["T"] == stock.stock_symbol:
                current_close_price = stock_api["c"]
                current_open_price = stock_api["o"]
                break

        money_in_stocks += current_close_price * stock.quantity

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
                "profit": user_stock_profit(user, stock, current_close_price),
            }
        )

    return stocks_owned_list, money_in_stocks
