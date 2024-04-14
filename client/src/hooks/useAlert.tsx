import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  SyntheticEvent,
} from "react";
import Snackbar from "@mui/material/Snackbar";
import { AlertColor } from "@mui/material/Alert";
import AlertComponent from "../components/Shared/AlertComponent";

interface AlertContextType {
  showAlert: (newMessage: string, newSeverity: AlertColor) => void;
}

export const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const showAlert = (
    newMessage: string,
    newSeverity: AlertColor = "success",
  ) => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };

  const handleClose = (_?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <AlertComponent severity={severity}>{message}</AlertComponent>
      </Snackbar>
    </AlertContext.Provider>
  );
};
