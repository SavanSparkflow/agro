import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { PermissionProvider } from './context/PermissionContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <PermissionProvider>
          <App />
        </PermissionProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
