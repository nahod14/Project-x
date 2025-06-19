import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { Delete as DeleteIcon, Notifications as NotificationsIcon } from '@mui/icons-material';

interface TrackedItemProps {
  name: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: Array<{ date: string; price: number }>;
  onDelete: () => void;
  onSetAlert: () => void;
}

const TrackedItem = ({ name, currentPrice, originalPrice, priceHistory, onDelete, onSetAlert }: TrackedItemProps) => {
  const priceChange = ((currentPrice - originalPrice) / originalPrice) * 100;
  const isPriceDrop = priceChange < 0;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            {name}
          </Typography>
          <Box>
            <IconButton onClick={onSetAlert} size="small" sx={{ mr: 1 }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton onClick={onDelete} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div" sx={{ mr: 2 }}>
            ${currentPrice.toFixed(2)}
          </Typography>
          <Chip
            label={`${isPriceDrop ? '↓' : '↑'} ${Math.abs(priceChange).toFixed(1)}%`}
            color={isPriceDrop ? 'success' : 'error'}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          Original Price: ${originalPrice.toFixed(2)}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Last Updated: {priceHistory[priceHistory.length - 1]?.date || 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TrackedItem; 