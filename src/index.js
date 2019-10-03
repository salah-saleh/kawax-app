import 'scss/index.scss';
import 'babel-polyfill';
import Kawax from 'kawax-js';
import RootReducer from 'reducers/Root';
import RootContainer from 'components/Root';
import Navigate from 'actions/Navigate';

window.onload = () => {
  Kawax.new({
    name: 'app',
    htmlRoot: 'app',
    container: RootContainer,
    reducer: RootReducer.export(),
    historyHook: Navigate.build(),
  });
};

