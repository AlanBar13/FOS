import { useNavigate } from 'react-router-dom';
import {Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ErrorPage(){
    const navigate = useNavigate();

    const navigateToHome = () => {
        return navigate("/", { replace: true })
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: 'primary',
            }}
        >
            <Typography variant="h1" style={{ color: 'black' }}>
                404
            </Typography>
            <Box>
                <Typography variant="h6" style={{ color: 'black' }}>
                    La pagina que estas buscando no existe
                </Typography>
                <Button variant="contained" onClick={navigateToHome}>Regresar a Home</Button>
            </Box>
        </Box>
    )
}