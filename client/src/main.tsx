import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles'
import { AlertProvider } from './hooks/useAlert'
import router from './router'
import theme from './utils/theme'
import "./App.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
