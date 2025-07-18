import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
} from '@mui/material';
import { useSupplyChainStore } from '@/store/supplyChainStore';

const Analytics: React.FC = () => {
  const theme = useTheme();
  const { dashboardMetrics } = useSupplyChainStore();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Analytics
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Comprehensive analytics and performance insights for your supply chain operations
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Performance Overview
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Key performance indicators and trends for supply chain operations.
              </Typography>
              {/* Chart placeholder - would integrate with Recharts */}
              <Box
                sx={{
                  height: 300,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Performance Chart (Recharts Integration)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Exception Trends
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Delivery exception patterns and resolution trends over time.
              </Typography>
              {/* Chart placeholder */}
              <Box
                sx={{
                  height: 300,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Exception Trends Chart
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Supplier Performance Analysis
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Detailed analysis of supplier performance and reliability metrics.
              </Typography>
              {/* Chart placeholder */}
              <Box
                sx={{
                  height: 400,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Supplier Performance Dashboard
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 