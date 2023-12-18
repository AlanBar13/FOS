import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface AdminAppBarComponentProps {
    title: string
}
export default function AdminAppBarComponent({ title }: AdminAppBarComponentProps){
    return (
        <AppBar position='static' style={{background: "#2E3B55", marginBottom: '1rem'}}>
            <Toolbar variant='dense'>
                <Typography variant="h4" style={{marginBottom: '1rem', marginTop: '1rem'}}>{title}</Typography>
            </Toolbar>
        </AppBar>
    )
}