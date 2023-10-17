import ButtonLink from "../components/ButtonLink";

function Home() {
  return (
    <div className="Home--container">
      <h1>
        Invest in market stocks for free in a real world mirroring simulation
      </h1>
      <img src="/src/img/bitcoin.png" alt="bitcoin" />
      <h2>
        This is text. This is text. This is text. This is text. This is text
      </h2>
      <img src="/src/img/dollars.png" alt="dollars" />
      <br />
      <div className="Home--quote">
        <p>
          &ldquo;It&apos;s not how much money you make, but how much money you keep, how
          hard it works for you, and how many generations you keep it for&rdquo;— Robert Kiyosaki
        </p>
      </div>
      <br />
      <ButtonLink to="/register" text="Start Investing" size="bg" />
    </div>
  );
}

export default Home;
