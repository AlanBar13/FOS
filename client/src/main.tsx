import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AlertProvider } from "./hooks/useAlert";
import { CurrentOrderProvider } from "./hooks/useCurrentOrder";
import ApiProvider from "./hooks/ApiProvider";
import AuthProvider from "./hooks/AuthProvider";
import NotifactionProvider from "./hooks/NotificationProvider";
import router from "./router";
import theme from "./utils/theme";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <AlertProvider>
      <NotifactionProvider>
        <ApiProvider>
          <CurrentOrderProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </CurrentOrderProvider>
        </ApiProvider>
      </NotifactionProvider>
    </AlertProvider>
  </ThemeProvider>,
);
