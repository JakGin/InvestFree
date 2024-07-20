TODO MVP

# Main objective

- [x] on Dashboard display how up or down in Total person is
- [] Wallet Stock UI + backend
  Info to show BASE:

  - [x] Name + Symbol
  - [x] N of shares
  - [x] Current Change
  - [x] Current benefit/loss on this stock with the currently owned shares
  - [x] N of units to sell
  - [] Sell consent

- [] Top players

  - [] player name
  - [] overall sum (wallet + account)

- [] Account

  - [] Change username
  - [] Change email
  - [] Change password

- [] Paggination in Wallet page

# DevOps

- [] DockerFile's
- [] DockerCompose

# Optimization

- [] Frontend should only sent as much requests to the server as really needed. When we know some action was successful on the server via the Response like selling some number of stocks, we shouldn't fetch data again if we can simply update the state via subtracting the deleted stocks from total. To detect it interact with page and check the backend logs.
- [] On the backend don't write Stocks Info from Api to the file. Intead save it in the variable so that it can be access much fater. Make this data a dictionary that can be searched by stockSymbol.
- [] Some components on the frontend have to many not needed info/data, it's memory consuming especially when we add more stocks to trade.
