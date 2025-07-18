import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Email as EmailIcon,
  Business as SupplierIcon,
  Schedule as ScheduleIcon,
  CheckCircle as ResolvedIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupplyChainStore } from '@/store/supplyChainStore';
import { statusColors } from '@/theme';
import { format } from 'date-fns';

const ExceptionDetail: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    deliveryExceptions,
    loading,
    error,
    loadDeliveryExceptions,
    resolveDeliveryException,
  } = useSupplyChainStore();

  const [resolutionNotes, setResolutionNotes] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    loadDeliveryExceptions();
  }, [loadDeliveryExceptions]);

  const exception = deliveryExceptions.find(e => e.id === id);

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

  if (!exception) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Exception not found
      </Alert>
    );
  }

  const handleResolve = async () => {
    if (resolutionNotes.trim()) {
      await resolveDeliveryException(exception.id, resolutionNotes);
      navigate('/delivery-exceptions');
    }
  };

  const steps = [
    {
      label: 'Exception Detected',
      description: `Delivery delay detected for order ${exception.orderNumber}`,
      completed: true,
    },
    {
      label: 'Supplier Contacted',
      description: 'Initial communication with supplier initiated',
      completed: exception.status !== 'open',
    },
    {
      label: 'Resolution Plan',
      description: 'Resolution strategy implemented',
      completed: exception.status === 'resolved',
    },
    {
      label: 'Exception Resolved',
      description: 'Delivery exception successfully resolved',
      completed: exception.status === 'resolved',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/delivery-exceptions')}
          sx={{ mb: 2 }}
        >
          ← Back to Exceptions
        </Button>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Exception Details
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage and resolve delivery exception for order {exception.orderNumber}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Exception Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Exception Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Order Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {exception.orderNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Supplier
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {exception.supplierName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Severity
                  </Typography>
                  <Chip
                    label={exception.severity.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getSeverityColor(exception.severity),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={exception.status.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(exception.status),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Delay Days
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'error.main' }}>
                    {exception.delayDays} days
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Detected Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(exception.detectedDate), 'MMM dd, yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Expected Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(exception.expectedDate), 'MMM dd, yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Required Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(exception.requiredDate), 'MMM dd, yyyy')}
                  </Typography>
                </Grid>
                {exception.reason && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Reason for Delay
                    </Typography>
                    <Typography variant="body1">
                      {exception.reason}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Workflow Steps */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Resolution Workflow
              </Typography>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="textSecondary">
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<EmailIcon />}
                  fullWidth
                >
                  Send Email to Supplier
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SupplierIcon />}
                  fullWidth
                >
                  View Alternative Suppliers
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  fullWidth
                >
                  Update Expected Date
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Resolution */}
          {exception.status !== 'resolved' && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Resolve Exception
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter resolution notes..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ResolvedIcon />}
                  fullWidth
                  onClick={handleResolve}
                  disabled={!resolutionNotes.trim()}
                >
                  Mark as Resolved
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Alternative Suppliers */}
          {exception.alternativeSuppliers && exception.alternativeSuppliers.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Alternative Suppliers
                </Typography>
                {exception.alternativeSuppliers.map((supplier) => (
                  <Box key={supplier.id} sx={{ mb: 2, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {supplier.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Lead Time: {supplier.leadTime} days
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Reliability: {supplier.reliability}%
                    </Typography>
                    <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                      Contact Supplier
                    </Button>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper functions
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return statusColors.critical;
    case 'high':
      return statusColors.delayed;
    case 'medium':
      return statusColors.atRisk;
    case 'low':
      return '#2e7d32';
    default:
      return '#757575';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return '#ed6c02';
    case 'investigating':
      return '#0288d1';
    case 'resolved':
      return '#2e7d32';
    case 'escalated':
      return '#d32f2f';
    case 'closed':
      return '#757575';
    default:
      return '#757575';
  }
};

export default ExceptionDetail; 