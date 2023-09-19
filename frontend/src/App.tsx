import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count => count + 1)
  }

  useEffect(() => {
    async function getUsers() {
      console.log(`${import.meta.env.VITE_API_URL}stocks`)
      // const response = await fetch(`${import.meta.env.VITE_API_URL}stocks/`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     "symbol": "AAPL",
      //     "name": "Apple Inc",
      //     "price": 100.00,
      //   })
      // })
      const response = await fetch(`${import.meta.env.VITE_API_URL}stocks/`)
      const data = await response.json()
      console.log(data)
      // const data = await response.json()
      // console.log(data)
      // console.log(await response.json())
    }

    getUsers()
  }, [])

  return (
    <>
      <h1>This is app.tsx</h1>
      <h2>{count}</h2>
      <button onClick={handleClick}>Click</button>
    </>
  )
}

export default App
