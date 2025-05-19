import { ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from './App';
import './index.css';
import ErrorBoundary from './pages/error/ErrorBoundary';
import { persistor, store } from './redux/store';
import THEME from './theme';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ErrorBoundary>
    <MantineProvider>
      <ThemeProvider theme={THEME}>
        <PersistGate persistor={persistor} loading={null}>
          <Provider store={store}>
            <App />
          </Provider>
        </PersistGate>
      </ThemeProvider>
    </MantineProvider>
  </ErrorBoundary>
)