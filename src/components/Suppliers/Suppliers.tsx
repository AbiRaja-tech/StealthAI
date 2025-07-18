import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useSupplyChainStore } from '@/store/supplyChainStore';

const Suppliers: React.FC = () => {
  const theme = useTheme();
  const {
    suppliers,
    loading,
    error,
    loadSuppliers,
  } = useSupplyChainStore();

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const SupplierCard: React.FC<{ supplier: any }> = ({ supplier }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {supplier.name}
          </Typography>
          {supplier.isPreferred && (
            <Chip
              label="Preferred"
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {supplier.location}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <StarIcon sx={{ mr: 1, color: 'gold', fontSize: 16 }} />
            <Typography variant="body2">
              Rating: {supplier.rating}/5
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ScheduleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
            <Typography variant="body2">
              Lead Time: {supplier.leadTime} days
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ mr: 1, color: 'success.main', fontSize: 16 }} />
            <Typography variant="body2">
              Reliability: {supplier.reliability}%
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Specialties:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {supplier.specialties.map((specialty: string, index: number) => (
              <Chip
                key={index}
                label={specialty}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
        
        <Typography variant="body2" color="textSecondary">
          {supplier.email}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {supplier.phone}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Suppliers
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage supplier relationships and monitor performance metrics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {suppliers.map((supplier) => (
          <Grid item xs={12} sm={6} md={4} key={supplier.id}>
            <SupplierCard supplier={supplier} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Suppliers; 