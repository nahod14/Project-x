import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';

interface PriceAlertDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (targetPrice: number, condition: 'below' | 'above') => Promise<void>;
  currentPrice: number;
  itemName: string;
}

const PriceAlertDialog = ({ open, onClose, onSubmit, currentPrice, itemName }: PriceAlertDialogProps) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'below' | 'above'>('below');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const price = parseFloat(targetPrice);

    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (condition === 'below' && price >= currentPrice) {
      setError('Target price must be below current price');
      return;
    }

    if (condition === 'above' && price <= currentPrice) {
      setError('Target price must be above current price');
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(price, condition);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set alert');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Set Price Alert for {itemName}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Current Price: ${currentPrice.toFixed(2)}
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Alert When Price Is</InputLabel>
            <Select
              value={condition}
              label="Alert When Price Is"
              onChange={(e) => setCondition(e.target.value as 'below' | 'above')}
            >
              <MenuItem value="below">Below Target Price</MenuItem>
              <MenuItem value="above">Above Target Price</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Target Price"
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            error={!!error}
            helperText={error}
            InputProps={{
              startAdornment: '$',
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? 'Setting Alert...' : 'Set Alert'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PriceAlertDialog; 