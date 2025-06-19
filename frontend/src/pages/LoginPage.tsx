import { Container, Box, Typography } from '@mui/material';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Welcome Back
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
}; 