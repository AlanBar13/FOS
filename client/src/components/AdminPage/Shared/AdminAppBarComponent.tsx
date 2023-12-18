import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface AdminAppBarComponentProps {
    title: string
    backUrl?: string | null
}
export default function AdminAppBarComponent({ title, backUrl }: AdminAppBarComponentProps){
    const navigate = useNavigate();

    return (
        <AppBar position='static' style={{background: "#2E3B55", marginBottom: '1rem'}}>
            <Toolbar variant='dense'>
                {backUrl ? (
                    <IconButton sx={{color: 'white'}} onClick={() => navigate(backUrl)}>
                        <ArrowBackIcon />
                    </IconButton>
                ) : null}
                <Typography variant="h4" style={{marginBottom: '1rem', marginTop: '1rem'}}>{title}</Typography>
            </Toolbar>
        </AppBar>
    )
}