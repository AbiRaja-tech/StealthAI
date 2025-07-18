import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Warning as WarningIcon,
  CheckCircle as OnTimeIcon,
  Schedule as AtRiskIcon,
  Business as SupplierIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSupplyChainStore } from '@/store/supplyChainStore';
import { statusColors } from '@/theme';
import { PurchaseOrder, OrderStatus, Priority } from '@/types';
import { format } from 'date-fns';

const PurchaseOrders: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    purchaseOrders,
    loading,
    error,
    loadPurchaseOrders,
    getFilteredPurchaseOrders,
    getAtRiskOrders,
    setFilters,
    setSortOptions,
  } = useSupplyChainStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');

  useEffect(() => {
    loadPurchaseOrders();
  }, [loadPurchaseOrders]);

  useEffect(() => {
    const filters: any = {};
    if (searchTerm) filters.search = searchTerm;
    if (statusFilter) filters.status = statusFilter;
    if (priorityFilter) filters.priority = priorityFilter;
    setFilters(filters);
  }, [searchTerm, statusFilter, priorityFilter, setFilters]);

  const handleSort = (field: string) => {
    setSortOptions({ field, direction: 'desc' });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return theme.palette.grey[500];
      case 'confirmed':
        return theme.palette.info.main;
      case 'in-production':
        return theme.palette.warning.main;
      case 'shipped':
        return theme.palette.primary.main;
      case 'delivered':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical':
        return statusColors.critical;
      case 'high':
        return statusColors.delayed;
      case 'medium':
        return statusColors.atRisk;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getDeliveryStatus = (order: PurchaseOrder) => {
    const today = new Date();
    const expectedDate = new Date(order.expectedDate);
    const requiredDate = new Date(order.requiredDate);
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    if (order.status === 'delivered') {
      return { status: 'on-time', icon: <OnTimeIcon />, color: statusColors.onTime };
    }

    if (expectedDate <= threeDaysFromNow) {
      return { status: 'at-risk', icon: <AtRiskIcon />, color: statusColors.atRisk };
    }

    if (expectedDate > requiredDate) {
      return { status: 'delayed', icon: <WarningIcon />, color: statusColors.delayed };
    }

    return { status: 'on-time', icon: <OnTimeIcon />, color: statusColors.onTime };
  };

  const filteredOrders = getFilteredPurchaseOrders();
  const atRiskOrders = getAtRiskOrders();

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

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Purchase Orders
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Monitor and manage all active purchase orders with real-time status tracking
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by order number or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="in-production">In Production</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPriorityFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Orders
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                {purchaseOrders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                At Risk
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: statusColors.atRisk }}>
                {atRiskOrders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                In Production
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                {purchaseOrders.filter(o => o.status === 'in-production').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Delivered This Week
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                {purchaseOrders.filter(o => 
                  o.status === 'delivered' && 
                  new Date(o.expectedDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Button
                      onClick={() => handleSort('orderNumber')}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Order Number
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSort('supplierName')}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Supplier
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSort('totalAmount')}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Total Amount
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSort('priority')}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Priority
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSort('status')}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Status
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSort('expectedDate')}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Expected Date
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSort('requiredDate')}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Required Date
                    </Button>
                  </TableCell>
                  <TableCell>Delivery Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => {
                  const deliveryStatus = getDeliveryStatus(order);
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SupplierIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {order.supplierName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {order.currency} {order.totalAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.priority.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(order.priority),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status.replace('-', ' ').toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(order.status),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(order.expectedDate), 'MMM dd, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(order.requiredDate), 'MMM dd, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {deliveryStatus.icon}
                          <Chip
                            label={deliveryStatus.status.toUpperCase()}
                            size="small"
                            sx={{
                              ml: 1,
                              backgroundColor: deliveryStatus.color,
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredOrders.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="textSecondary">
                No purchase orders found matching your criteria.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PurchaseOrders; 