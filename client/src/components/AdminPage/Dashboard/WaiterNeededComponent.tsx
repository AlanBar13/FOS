import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { NeedWaiterRequest } from "../../../models/SocketModels";

interface WaiterNeededComponentProps {
    request: NeedWaiterRequest
    seen: (id: string) => void
}

export default function WaiterNeededComponent({ request, seen }: WaiterNeededComponentProps) {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} gutterBottom>
                    Mesa #{request.tableId} Orden #{request.orderId}
                </Typography>
                <Typography variant="h5" component="div">
                    {request.message}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    fullWidth
                    color="warning"
                    onClick={() => seen(request.id)}
                >
                    Marcar como visto
                </Button>
            </CardActions>
        </Card>
    )
}