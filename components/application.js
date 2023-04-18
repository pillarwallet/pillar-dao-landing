import React, { useEffect, useState } from "react";
import { useFormFields, useMailChimpForm } from "use-mailchimp-form";
const Application = () => {

  const mailchimpURL = "https://pillarproject.us14.list-manage.com/subscribe/post?u=0056162978ccced9e0e2e2939&amp;id=a32643eea2&amp;f_id=00edc2e1f0";
  const { loading, error, success, message, handleSubmit } = useMailChimpForm( mailchimpURL);
  const { fields, handleFieldChange } = useFormFields({EMAIL: ""});

  return (
    <>
      <section className="application" id="application">
        <div className="container">
          <div className="application__headline">
            <h2>All Staked Funds Will Be Locked for 52 Weeks <span>Claim and unstake will be available at the end of this period</span></h2>
          </div>

          <div className="application__form">
              <div className="application__form__detail">
                <h3>PillarDAO staking will be open for 1&nbsp;month</h3>
                <p>Submit your email address & we'll notify you as soon as it begins, so you don't miss out</p>
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    handleSubmit(fields);
                  }}
                >
                  <input
                    id="EMAIL"
                    autoFocus
                    type="email"
                    placeholder="E-mail"
                    value={fields.EMAIL}
                    onChange={handleFieldChange}
                  />
                  <button>Subscribe</button>
                </form>
                {loading && "Submitting"}
                {error && message}
                {success && message}
              </div>
          </div>

          {/* 
          <div className="application__wrapper">
            <div></div>
            <div></div>
          </div> 
          */}

        </div>
      </section>
    </>
  );
};

export default Application;
