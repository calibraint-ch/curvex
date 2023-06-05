import "./index.scss";

const HomePage = () => {
  return (
    <div>
      <section id="hero" className="hero-section">
        <div className="hero-grid-sections d-flex">
          <div className="hero-section-left">
            <p className="hero-heading">
              Dive into the Future Of <br />
              DeFi with <span style={{ color: "yellow" }}>Bonding Curves</span>
            </p>
          </div>

          <div className="hero-section-right">
            <p className="hero-heading">section 2</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
