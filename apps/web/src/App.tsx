import React, { useEffect, useState } from 'react';
import './assets/scss/themes.scss';
import Route from './Routes';
import fakeBackend from "./helpers/AuthType/fakeBackend";

// Activating fake backend
fakeBackend();

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <React.Fragment>
      <Route />
      {/* {loading && <div>Loading...</div>} */}
    </React.Fragment>
  );
}

export default App;
