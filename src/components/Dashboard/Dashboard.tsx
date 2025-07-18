import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Alert,
  Button,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Schedule,
  Business,
  LocalShipping,
  Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSupplyChainStore } from '@/store/supplyChainStore';
import { statusColors } from '@/theme';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    dashboardMetrics,
    loading,
    error,
    getAtRiskOrders,
    getCriticalExceptions,
    loadDashboardMetrics,
  } = useSupplyChainStore();

  const atRiskOrders = getAtRiskOrders();
  const criticalExceptions = getCriticalExceptions();

  useEffect(() => {
    if (!dashboardMetrics) {
      loadDashboardMetrics();
    }
  }, [dashboardMetrics, loadDashboardMetrics]);

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

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }> = ({ title, value, subtitle, icon, color, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend.isPositive ? (
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                >
                  {trend.value}% from last week
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const StatusCard: React.FC<{
    title: string;
    count: number;
    color: string;
    icon: React.ReactNode;
    onClick?: () => void;
  }> = ({ title, count, color, icon, onClick }) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: 4 } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: 1,
              p: 0.5,
              mr: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" sx={{ fontWeight: 600, color }}>
          {count}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Supply Chain Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Real-time overview of your supply chain operations and delivery exceptions
        </Typography>
      </Box>

      {/* Critical Alerts */}
      {criticalExceptions.length > 0 && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => navigate('/delivery-exceptions')}
            >
              View All
            </Button>
          }
        >
          {criticalExceptions.length} critical delivery exception{criticalExceptions.length > 1 ? 's' : ''} require{criticalExceptions.length > 1 ? '' : 's'} immediate attention
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Orders"
            value={dashboardMetrics?.totalOrders || 0}
            subtitle="Active purchase orders"
            icon={<Business sx={{ color: 'white' }} />}
            color={theme.palette.primary.main}
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Exceptions"
            value={dashboardMetrics?.activeExceptions || 0}
            subtitle="Delivery delays detected"
            icon={<Warning sx={{ color: 'white' }} />}
            color={theme.palette.warning.main}
            trend={{ value: -8, isPositive: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="At Risk Orders"
            value={dashboardMetrics?.atRiskOrders || 0}
            subtitle="Orders requiring attention"
            icon={<Schedule sx={{ color: 'white' }} />}
            color={theme.palette.error.main}
            trend={{ value: 15, isPositive: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Resolved Today"
            value={dashboardMetrics?.resolvedToday || 0}
            subtitle="Exceptions resolved"
            icon={<CheckCircle sx={{ color: 'white' }} />}
            color={theme.palette.success.main}
            trend={{ value: 25, isPositive: true }}
          />
        </Grid>
      </Grid>

      {/* Status Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Status Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatusCard
                    title="On Time"
                    count={dashboardMetrics?.totalOrders ? dashboardMetrics.totalOrders - (dashboardMetrics.activeExceptions || 0) : 0}
                    color={statusColors.onTime}
                    icon={<CheckCircle sx={{ color: 'white' }} />}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatusCard
                    title="At Risk"
                    count={dashboardMetrics?.atRiskOrders || 0}
                    color={statusColors.atRisk}
                    icon={<Schedule sx={{ color: 'white' }} />}
                    onClick={() => navigate('/purchase-orders')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatusCard
                    title="Delayed"
                    count={dashboardMetrics?.delayedOrders || 0}
                    color={statusColors.delayed}
                    icon={<Warning sx={{ color: 'white' }} />}
                    onClick={() => navigate('/delivery-exceptions')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatusCard
                    title="Critical"
                    count={criticalExceptions.length}
                    color={statusColors.critical}
                    icon={<Warning sx={{ color: 'white' }} />}
                    onClick={() => navigate('/delivery-exceptions')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Performance Metrics
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Average Resolution Time</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {dashboardMetrics?.averageResolutionTime || 0} days
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((dashboardMetrics?.averageResolutionTime || 0) * 10, 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">On-Time Delivery Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {dashboardMetrics?.totalOrders ? 
                      Math.round(((dashboardMetrics.totalOrders - (dashboardMetrics.delayedOrders || 0)) / dashboardMetrics.totalOrders) * 100) : 0}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={dashboardMetrics?.totalOrders ? 
                    Math.round(((dashboardMetrics.totalOrders - (dashboardMetrics.delayedOrders || 0)) / dashboardMetrics.totalOrders) * 100) : 0}
                  sx={{ height: 8, borderRadius: 4 }}
                  color="success"
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Exception Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {dashboardMetrics?.totalOrders ? 
                      Math.round(((dashboardMetrics.activeExceptions || 0) / dashboardMetrics.totalOrders) * 100) : 0}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={dashboardMetrics?.totalOrders ? 
                    Math.round(((dashboardMetrics.activeExceptions || 0) / dashboardMetrics.totalOrders) * 100) : 0}
                  sx={{ height: 8, borderRadius: 4 }}
                  color="warning"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Suppliers */}
      {dashboardMetrics?.topSuppliers && dashboardMetrics.topSuppliers.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Top Performing Suppliers
            </Typography>
            <Grid container spacing={2}>
              {dashboardMetrics.topSuppliers.map((supplier) => (
                <Grid item xs={12} sm={6} md={4} key={supplier.supplierId}>
                  <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {supplier.supplierName}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Reliability Score:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {supplier.reliabilityScore}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Total Orders:
                      </Typography>
                      <Typography variant="body2">
                        {supplier.totalOrders}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="textSecondary">
                        Avg. Delay:
                      </Typography>
                      <Typography variant="body2">
                        {supplier.averageDelay} days
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Assessment />}
                onClick={() => navigate('/analytics')}
                sx={{ py: 2 }}
              >
                View Analytics
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Business />}
                onClick={() => navigate('/suppliers')}
                sx={{ py: 2 }}
              >
                Manage Suppliers
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<LocalShipping />}
                onClick={() => navigate('/purchase-orders')}
                sx={{ py: 2 }}
              >
                View Orders
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Warning />}
                onClick={() => navigate('/delivery-exceptions')}
                sx={{ py: 2 }}
              >
                Handle Exceptions
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard; 