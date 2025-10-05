const HomeHero = () => {

  const scrollToGovernor = () => {
    const governorSection = document.getElementById('governor');
    if (governorSection) {
      governorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="home_hero" id="home">
        <div className="container">
          <div className="home_hero__headline">
            <h1>PillarDAO</h1>
            <p>You own it. You run it. You make the decentralized multichain future a reality</p>
            <a onClick={scrollToGovernor} style={{ cursor: 'pointer' }}>Get a Membership NFT</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeHero;
