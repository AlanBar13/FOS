import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

interface PaymentComponentProps {
    method: string
    setMethod: (value: string) => void
    email: string
    setEmail: (value: string) => void
}

export default function PaymentComponent({ method, setMethod, email, setEmail }: PaymentComponentProps) {
    const handleMethodChange = (event: SelectChangeEvent) => {
        setMethod(event.target.value)
    }

    return (
        <>
            <Typography>Revise que el monto sea correcto antes de continuar</Typography>
            <br />
            <FormControl fullWidth>
                <InputLabel id="payment-method">Seleccione metodo de pago:</InputLabel>
                <Select labelId='payment-method' label="Seleccione metodo de pago:" value={method} onChange={handleMethodChange}>
                    <MenuItem value={""}>Elije una opcion...</MenuItem>
                    <MenuItem value={"card"}>Tarjeta</MenuItem>
                    <MenuItem value={"cash"}>Efectivo</MenuItem>
                    <MenuItem value={"transfer"}>Transferencia</MenuItem>
                </Select>
                <br />
                <TextField label="Correo electronico" value={email} onChange={e => setEmail(e.target.value)} helperText="Dejar vacio si no queire que se envie recibo al correo"></TextField>
            </FormControl>
        </>
    )
}