import { Box, Button, Divider, Typography } from '@mui/material';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { useAuthContext } from '../contexts/AuthContext';

export const SocialAuth: React.FC = () => {
  const { loginWithGoogle, loginWithGitHub } = useAuthContext();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      await loginWithGitHub();
    } catch (error) {
      console.error('GitHub login failed:', error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Or continue with
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          fullWidth
        >
          Google
        </Button>

        <Button
          variant="outlined"
          startIcon={<GitHubIcon />}
          onClick={handleGitHubLogin}
          fullWidth
        >
          GitHub
        </Button>
      </Box>
    </Box>
  );
}; 