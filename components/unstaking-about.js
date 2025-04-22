import Link from 'next/link';

const StakingAbout = () => {
  return (
    <>
      <section className="swap_about" id="about">
        <div className="container">
          <div className="swap__statement">
            <div className="swap__statement__detail">
              <h3>
                Option 1: PillarDAO
                <br />
                Cross-Chain assistance
              </h3>
              <p>
                PillarDAO will be happy to assist you to cross-chain PLR / WETH back to the Ethereum mainnet.  Click <a href="https://forms.gle/Ln77v4M9hwqAb3F77" target="_blank" rel="noopener noreferrer">here</a> for more information.
              </p>
              <a
                href="https://forms.gle/Ln77v4M9hwqAb3F77"
                target="_blank"
                rel="noopener noreferrer"
                className="swap__button"
              >
                Submit your request
              </a>
            </div>
            <div className="swap__statement__detail">
              <h3>
                Option 2: Polygon’s
                <br />
                official bridge*
              </h3>
              <p>
              Use Polygon’s official bridge by following this link: <a href="https://portal.polygon.technology/bridge" target="_blank" rel="noopener noreferrer">https://portal.polygon.technology/bridge</a>
              </p>
              <h4>*Please be advised that utilizing bridging services may result in additional gas costs.</h4>
            </div>
          </div>
          <div className="swap_about_info_content">
            <p>Need help? Contact PillarDAO on <a href="https://discord.gg/t39xKhzSPb" target="_blank" rel="noopener noreferrer">Discord</a>. <br />Follow <a href="https://x.com/pillar_dao" target="_blank" rel="noopener noreferrer">PillarDAO on X</a> to stay updated on all activities and opportunities for DAO participants & PLR token holders!</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingAbout;
