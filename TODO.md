TODO MVP

# Main objective

- [] Change database from Sqlite to Postgresql

# DevOps

- [] DockerFile's
- [] DockerCompose
- [] Deployment (Vercel, AWS, etc...)

# Next Features

- [] Transaction History Page (last 100 transactions)

- [] Paggination in Wallet page

# Optimization

- [] Frontend should only sent as much requests to the server as really needed. When we know some action was successful on the server via the Response like selling some number of stocks, we shouldn't fetch data again if we can simply update the state via subtracting the deleted stocks from total. To detect it interact with page and check the backend logs.
- [] Some components on the frontend have to many not needed info/data, it's memory consuming especially when we add more stocks to trade.
