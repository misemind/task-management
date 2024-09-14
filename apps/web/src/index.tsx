import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";
import * as Sentry from "@sentry/react";
const store = configureStore({ reducer: rootReducer, devTools: true });

async function startWorkerAndRenderApp() {
  // if (process.env.NODE_ENV === 'development') {
  //   const { worker } = require('./api/setupMocks');
  //   await worker.start({
  //     serviceWorker: {
  //       url: '/mockServiceWorker.js',
  //     },
  //   });
  // }



Sentry.init({
  dsn: "https://4d397f3e11bcb27334fe78f740c5bc89@o4507808793821184.ingest.us.sentry.io/4507808796442624",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});


  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <Provider store={store}>
      <React.Fragment>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <App />
        </BrowserRouter>
      </React.Fragment>
    </Provider>
  );
}

startWorkerAndRenderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
