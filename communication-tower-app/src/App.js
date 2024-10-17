import React from 'react';
import { Provider } from 'react-redux';
import MapComponent from './components/Map';
import store from './store';
import './styles.css';

const App = () => {
    return (
        <Provider store={store}>
            <MapComponent />
        </Provider>
    );
};

export default App;
