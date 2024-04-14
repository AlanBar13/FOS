import { ReactNode } from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface DialogComponentProps {
  isOpen: boolean;
  title: string;
  maxWidth?: DialogProps["maxWidth"];
  children: ReactNode;
  enableActions?: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
}

export default function DialogComponent({
  isOpen,
  title,
  maxWidth = "md",
  children,
  enableActions = true,
  onCancel,
  onConfirm,
}: DialogComponentProps) {
  return (
    <Dialog fullWidth maxWidth={maxWidth} open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onCancel}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>{children}</DialogContent>
      {enableActions ? (
        <DialogActions>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button onClick={onConfirm}>Confirmar</Button>
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
