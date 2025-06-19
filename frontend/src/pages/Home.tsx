import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GoogleSignIn from '../components/GoogleSignIn';

const Home = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Price Tracker
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Track prices, set alerts, and never miss a deal again. Our powerful price tracking
          system helps you make informed purchasing decisions.
        </Typography>
        
        {/* Google Signup CTA */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mt: 4, 
            mb: 3,
            textAlign: 'center',
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Get Started in Seconds
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sign up with Google to start tracking prices instantly
          </Typography>
          <GoogleSignIn text="Sign up with Google" />
        </Paper>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/register"
            size="large"
            sx={{ minWidth: 140 }}
          >
            Create Account
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to="/login"
            size="large"
            sx={{ minWidth: 140 }}
          >
            Sign In
          </Button>
        </Box>
      </Container>

      <Container sx={{ py: 8 }} maxWidth="md">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'stretch'
        }}>
          <Box sx={{ flex: 1 }}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                🔍 Track Prices
              </Typography>
              <Typography color="text.secondary">
                Monitor prices across multiple retailers and get notified when prices drop.
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                🔔 Set Alerts
              </Typography>
              <Typography color="text.secondary">
                Create custom price alerts and never miss a deal on your favorite products.
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                💰 Save Money
              </Typography>
              <Typography color="text.secondary">
                Make informed purchasing decisions and save money on every purchase.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 