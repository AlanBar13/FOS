import AppBar from '@mui/material/AppBar';
import {Box} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Tooltip from '@mui/material/Tooltip';

interface AppBarComponentProps {
    companyName: string
    hideCart?: boolean
    toggleCart?: () => void
}

export default function AppBarComponent({ companyName = "--", hideCart = false, toggleCart }: AppBarComponentProps) {
    return (
        <AppBar position="sticky" style={{background: "#2E3B55"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        variant="h5"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {companyName}
                    </Typography>

                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {companyName}
                    </Typography>

                    {!hideCart ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Abrir carrito">
                                <IconButton sx={{ p: 0 }} color='secondary' onClick={toggleCart}>
                                    <ShoppingCartIcon  />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    ) : (
                        <></>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    )
}