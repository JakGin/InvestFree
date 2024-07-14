import ButtonLink from "../components/ButtonLink"

function Home() {
  return (
    <div className="Home--container">
      <h1>
        Invest in market stocks for free in a real world mirroring simulation
      </h1>
      <img src="/src/img/bitcoin.png" alt="bitcoin" />
      <h2>It&rsquo;s simple, effortless, fun and free!</h2>
      <img src="/src/img/dollars.png" alt="dollars" />
      <br />
      <div className="Home--quotes-outer">
        <div className="Home--quotes">
          <div className="Home--quote">
            <p>
              &ldquo;It&apos;s not how much money you make, but how much money
              you keep, how hard it works for you, and how many generations you
              keep it for&rdquo;
            </p>
            <div className="Home--quote-author">Robert Kiyosaki</div>
          </div>

          <div className="Home--quote">
            <p>
              &ldquo;Compound interest is the eighth wonder of the world; he who
              understands it, earns it, he who doesn’t pays it&rdquo;
            </p>
            <div className="Home--quote-author">Albert Einstein</div>
          </div>

          <div className="Home--quote">
            <p>&ldquo;The biggest risk of all, is not taking one&rdquo;</p>
            <div className="Home--quote-author">Mellody Hobson</div>
          </div>
        </div>
      </div>
      <br />
      <ButtonLink to="/register" text="Start Investing" size="bg" />
    </div>
  )
}

export default Home
