import React, { useEffect, useState } from "react";
import { useFormFields, useMailChimpForm } from "use-mailchimp-form";
const StakingApplication = () => {

  const mailchimpURL = "https://pillarproject.us14.list-manage.com/subscribe/post?u=0056162978ccced9e0e2e2939&amp;id=a32643eea2&amp;f_id=00edc2e1f0";
  const { loading, error, success, message, handleSubmit } = useMailChimpForm( mailchimpURL);
  const { fields, handleFieldChange } = useFormFields({EMAIL: ""});

  return (
    <>
      <section className="staking_application" id="application">
        <div className="container">
          <div className="staking_application__headline">
            <h2>All Staked Funds Will Be Locked for 52&nbsp;Weeks. <span>ETH Rewards will be available after the locked period&nbsp;ends.</span></h2>
          </div>

          <div className="staking_application__form">
              <div className="staking_application__form__detail">
                <h3>PLR staking will be open for 1&nbsp;month</h3>
                <p>Sign up for access & we'll notify you as&nbsp;soon&nbsp;as&nbsp;it begins.</p>
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    handleSubmit(fields);
                  }}
                >
                  <input
                    id="EMAIL"
                    type="email"
                    placeholder="E-mail"
                    value={fields.EMAIL}
                    onChange={handleFieldChange}
                  />
                  <button>Sign up</button>
                </form>
                {loading && "Submitting"}
                {error && message}
                {success && message}
              </div>
          </div>

          {/* 
          <div className="staking_application__wrapper">
            <div></div>
            <div></div>
          </div> 
          */}

        </div>
      </section>
    </>
  );
};

export default StakingApplication;
