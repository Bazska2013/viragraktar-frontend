import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from './store'
import {TamaguiProvider} from "@tamagui/core";
import {config} from "./tamagui.config.ts";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
          <TamaguiProvider config={config} defaultTheme="light">
              <App/>
          </TamaguiProvider>
      </Provider>
  </StrictMode>,
)
