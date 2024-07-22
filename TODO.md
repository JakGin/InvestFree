TODO MVP

# Main objective

- [x] on Dashboard display how up or down in Total person is
- [x] Wallet Stock UI + backend
      Info to show BASE:

  - [x] Name + Symbol
  - [x] N of shares
  - [x] Current Change
  - [x] Current benefit/loss on this stock with the currently owned shares
  - [x] N of units to sell
  - [x] Empty Wallet view
  - [x] Sell feedback

- [x] Top Players

- [] Account

  - [x] Change username
  - [x] Change email
  - [] Change password

- [] Change database from Sqlite to Postgresql

# DevOps

- [] DockerFile's
- [] DockerCompose
- [] Deployment (Vercel, AWS, etc...)

# Next Features

- [] Transaction History Page (last 100 transactions)

- [] Paggination in Wallet page

# Optimization

- [] Make the user's stock profit caculate only based on the StocksOwned table. Some new fields in that table are needed, but it is possible to do that. Transaction table is then not needed if we don't support "history of transactions"
- [] Frontend should only sent as much requests to the server as really needed. When we know some action was successful on the server via the Response like selling some number of stocks, we shouldn't fetch data again if we can simply update the state via subtracting the deleted stocks from total. To detect it interact with page and check the backend logs.
- [] On the backend don't write Stocks Info from Api to the file. Intead save it in the variable so that it can be access much fater. Make this data a dictionary that can be searched by stockSymbol.
- [] Some components on the frontend have to many not needed info/data, it's memory consuming especially when we add more stocks to trade.
