import React from "react";
import Link from "next/link";
import logoPillar from "../assets/images/logo-pillar.png";

const HomeProducts = () => {
  return (
    <>
      <section className="home_products" id="products">
        <div className="container">
          <div className="home_products__detail">
            <h2><span>PillarDAO</span> Products</h2>
            <div className="home_products__detail__list">
              <a href="https://www.pillar.fi/?utm_source=pillar_website&utm_medium=page&utm_campaign=pillar_dao" target="_blank" rel="noopener noreferrer">
                <img src={logoPillar} alt="Pillar" title="Pillar" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeProducts;
