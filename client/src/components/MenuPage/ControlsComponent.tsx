import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

interface ControlsComponentProps {
  value: number;
  operation: (type: string) => void;
}

export default function ControlsComponent({
  value = 1,
  operation,
}: ControlsComponentProps) {
  return (
    <ButtonGroup variant="outlined" aria-label="outlined button group">
      <Button onClick={() => operation("-")}>-</Button>
      <Button sx={{ color: "black !important" }} disabled>
        {value}
      </Button>
      <Button onClick={() => operation("+")}>+</Button>
    </ButtonGroup>
  );
}
