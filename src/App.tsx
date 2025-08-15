import { BrowserRouter } from 'react-router-dom';
import IndexRoute from './router';
import style from './app.module.css';
import Toast from './components/toast';

const App = () => {
  return (
    <div className={style.container}>
      <BrowserRouter>
        <IndexRoute />
        <Toast />
      </BrowserRouter>
    </div>
  );
};

export default App;
