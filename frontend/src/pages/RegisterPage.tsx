import { Container, Box, Typography } from '@mui/material';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage = () => {
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
          Create Account
        </Typography>
        <RegisterForm />
      </Box>
    </Container>
  );
}; 