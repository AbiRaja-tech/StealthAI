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
  Email as EmailIcon,
  Business as SupplierIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as ResolvedIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSupplyChainStore } from '@/store/supplyChainStore';
import { statusColors } from '@/theme';
import { DeliveryException, ExceptionStatus, Severity } from '@/types';
import { format } from 'date-fns';

const DeliveryExceptions: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    deliveryExceptions,
    loading,
    error,
    loadDeliveryExceptions,
    getFilteredDeliveryExceptions,
    setFilters,
    setSortOptions,
  } = useSupplyChainStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExceptionStatus | ''>('');
  const [severityFilter, setSeverityFilter] = useState<Severity | ''>('');

  useEffect(() => {
    loadDeliveryExceptions();
  }, [loadDeliveryExceptions]);

  useEffect(() => {
    const filters: any = {};
    if (searchTerm) filters.search = searchTerm;
    if (statusFilter) filters.status = statusFilter;
    if (severityFilter) filters.severity = severityFilter;
    setFilters(filters);
  }, [searchTerm, statusFilter, severityFilter, setFilters]);

  const handleSort = (field: string) => {
    setSortOptions({ field, direction: 'desc' });
  };

  const getStatusColor = (status: ExceptionStatus) => {
    switch (status) {
      case 'open':
        return theme.palette.warning.main;
      case 'investigating':
        return theme.palette.info.main;
      case 'resolved':
        return theme.palette.success.main;
      case 'escalated':
        return theme.palette.error.main;
      case 'closed':
        return theme.palette.grey[500];
      default:
        return theme.palette.grey[500];
    }
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
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

  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return <WarningIcon sx={{ color: statusColors.critical }} />;
      case 'high':
        return <WarningIcon sx={{ color: statusColors.delayed }} />;
      case 'medium':
        return <ScheduleIcon sx={{ color: statusColors.atRisk }} />;
      case 'low':
        return <ResolvedIcon sx={{ color: theme.palette.success.main }} />;
      default:
        return <WarningIcon />;
    }
  };

  const filteredExceptions = getFilteredDeliveryExceptions();

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
          Delivery Exceptions
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Monitor and manage delivery delays and supply chain exceptions
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
                  onChange={(e) => setStatusFilter(e.target.value as ExceptionStatus | '')}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="investigating">Investigating</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="escalated">Escalated</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={severityFilter}
                  label="Severity"
                  onChange={(e) => setSeverityFilter(e.target.value as Severity | '')}
                >
                  <MenuItem value="">All Severities</MenuItem>
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
                  setSeverityFilter('');
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
                Total Exceptions
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                {deliveryExceptions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Critical
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: statusColors.critical }}>
                {deliveryExceptions.filter(e => e.severity === 'critical').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Open
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                {deliveryExceptions.filter(e => e.status === 'open').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Resolved Today
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                {deliveryExceptions.filter(e => 
                  e.status === 'resolved' && 
                  e.resolvedDate && 
                  format(new Date(e.resolvedDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                ).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Exceptions Table */}
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
                      onClick={() => handleSort('severity')}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Severity
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSort('delayDays')}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Delay (Days)
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
                      onClick={() => handleSort('detectedDate')}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Detected
                    </Button>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExceptions.map((exception) => (
                  <TableRow key={exception.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {exception.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SupplierIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {exception.supplierName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getSeverityIcon(exception.severity)}
                        <Chip
                          label={exception.severity.toUpperCase()}
                          size="small"
                          sx={{
                            ml: 1,
                            backgroundColor: getSeverityColor(exception.severity),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: exception.delayDays > 7 ? 'error.main' : 'warning.main',
                        }}
                      >
                        {exception.delayDays} days
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(exception.expectedDate), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(exception.requiredDate), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exception.status.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(exception.status),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(exception.detectedDate), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/delivery-exceptions/${exception.id}`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {exception.emailDraft && (
                          <Tooltip title="View Email Draft">
                            <IconButton size="small">
                              <EmailIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredExceptions.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="textSecondary">
                No delivery exceptions found matching your criteria.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DeliveryExceptions; 