import React, { useState } from "react";

// Define constants for view states
const VIEW_STATES = {
  MINIMIZED: "minimized",
  NORMAL: "normal",
  FULLSCREEN: "fullscreen",
};

export function Compose() {
  // State for managing the view state
  const [viewState, setViewState] = useState(VIEW_STATES.NORMAL);

  // State for managing email, subject, and message inputs
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Function to handle switching between view states
  const switchViewState = (newState) => {
    setViewState(newState);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Email: ${email}, Subject: ${subject}, Message: ${message}`);
    // Here you can handle the submission of the form, for example, send the email.
  };

  // JSX rendering based on the view state
  let composeContent;
  switch (viewState) {
    case VIEW_STATES.MINIMIZED:
      composeContent = (
        <button onClick={() => switchViewState(VIEW_STATES.NORMAL)}>
          Expand
        </button>
      );
      break;
    case VIEW_STATES.FULLSCREEN:
      composeContent = (
        <>
          <form onSubmit={handleSubmit}>
            {/* Input fields for email, subject, and message */}
          </form>
          <button onClick={() => switchViewState(VIEW_STATES.NORMAL)}>
            Minimize
          </button>
        </>
      );
      break;
    case VIEW_STATES.NORMAL:
    default:
      composeContent = (
        <form onSubmit={handleSubmit}>
          {/* Input fields for email, subject, and message */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <input type="submit" value="Send" />
          <button onClick={() => switchViewState(VIEW_STATES.MINIMIZED)}>
            Minimize
          </button>
          <button onClick={() => switchViewState(VIEW_STATES.FULLSCREEN)}>
            Fullscreen
          </button>
        </form>
      );
      break;
  }

  return composeContent;
}
