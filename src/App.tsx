import { useState, useEffect } from "react";
import { BrowserRouter } from 'react-router-dom';
import IndexRoute from './router';
import style from './app.module.css';
import Toast from './components/toast';
import "./i18n";
import LoadingOverlay from "./components/LoadingOverlay";
import { initGlobalLoader } from "./utils/functions/http-request";

const App = () => {
  const [loading, setLoading] = useState(false);

   useEffect(() => {
    initGlobalLoader(setLoading);
  }, []);

  return (
    <div className={style.container}>
      {loading && <LoadingOverlay />}
      <BrowserRouter>
        <IndexRoute />
        <Toast />
      </BrowserRouter>
    </div>
  );
};

export default App;
