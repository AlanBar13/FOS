import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles'
import { AlertProvider } from './hooks/useAlert'
import { CurrentOrderProvider } from './hooks/useCurrentOrder';
import { UserProvider } from './hooks/useUser';
import router from './router'
import theme from './utils/theme'
import "./App.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
      <UserProvider>
        <AlertProvider>
          <CurrentOrderProvider>
              <RouterProvider router={router} />
          </CurrentOrderProvider>
        </AlertProvider>
      </UserProvider>
    </ThemeProvider>,
)
