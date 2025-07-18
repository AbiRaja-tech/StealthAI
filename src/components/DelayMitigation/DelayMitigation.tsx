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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Grid,
  Alert,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import {
  DelayMitigationService,
  sampleDelayTriggers,
  MitigationRecommendation,
  DelayTrigger,
  runDelayMitigationDemo,
  demoEmailParsing
} from '../../services/delayMitigationService';

interface DelayMitigationProps {
  // Props for future integration
}

const DelayMitigation: React.FC<DelayMitigationProps> = () => {
  const [recommendations, setRecommendations] = useState<MitigationRecommendation[]>([]);
  const [emailContent, setEmailContent] = useState('');
  const [parsedTrigger, setParsedTrigger] = useState<DelayTrigger | null>(null);
  const [emailRecommendation, setEmailRecommendation] = useState<MitigationRecommendation | null>(null);

  useEffect(() => {
    // Load initial recommendations
    const initialRecommendations = DelayMitigationService.processDelayTriggers(sampleDelayTriggers);
    setRecommendations(initialRecommendations);
  }, []);

  const handleRefreshRecommendations = () => {
    const updatedRecommendations = DelayMitigationService.processDelayTriggers(sampleDelayTriggers);
    setRecommendations(updatedRecommendations);
  };

  const handleEmailParse = () => {
    if (emailContent.trim()) {
      const trigger = DelayMitigationService.parseEmailContent(emailContent);
      setParsedTrigger(trigger);
      
      if (trigger) {
        const recommendation = DelayMitigationService.analyzeDelay(trigger);
        setEmailRecommendation(recommendation);
      } else {
        setEmailRecommendation(null);
      }
    }
  };

  const getSeverityColor = (delayDays: number, inventoryDays: number) => {
    if (delayDays > inventoryDays) return 'error';
    if (delayDays > inventoryDays - 2) return 'warning';
    return 'success';
  };

  const getMitigationTypeColor = (type: string) => {
    switch (type) {
      case 'air-freight': return 'error';
      case 'alternate-sourcing': return 'warning';
      case 'inventory-buffer': return 'success';
      case 'production-adjustment': return 'info';
      case 'dynamic-rerouting': return 'primary';
      default: return 'default';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 75) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Delivery Delay Mitigation
      </Typography>
      
      {/* Email Parser Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <EmailIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Email Delay Trigger Parser
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                label="Paste email content here"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="SKU: ECU-101&#10;Supplier: AlphaElectronics&#10;ETA: 2024-02-15&#10;Delay: 7 days&#10;Reason: Port congestion&#10;Inventory: 2 days remaining"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                onClick={handleEmailParse}
                disabled={!emailContent.trim()}
                sx={{ mb: 2 }}
                fullWidth
              >
                Parse Email
              </Button>
              
              {parsedTrigger && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Email parsed successfully!
                </Alert>
              )}
              
              {emailRecommendation && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Recommendation for {emailRecommendation.sku}
                    </Typography>
                    <Chip
                      label={emailRecommendation.recommendedAction.type.replace('-', ' ').toUpperCase()}
                      color={getMitigationTypeColor(emailRecommendation.recommendedAction.type) as any}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {emailRecommendation.recommendedAction.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confidence: {emailRecommendation.recommendedAction.confidence}%
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recommendations Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Delay Mitigation Recommendations
            </Typography>
            <Tooltip title="Refresh recommendations">
              <IconButton onClick={handleRefreshRecommendations}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Delay (Days)</TableCell>
                  <TableCell>Inventory (Days)</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Mitigation Method</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recommendations.map((rec, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {rec.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>{rec.supplierName}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${rec.delayDays} days`}
                        color={getSeverityColor(rec.delayDays, rec.inventoryDaysRemaining) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{rec.inventoryDaysRemaining}</TableCell>
                    <TableCell>
                      {rec.delayDays > rec.inventoryDaysRemaining ? (
                        <Chip icon={<ErrorIcon />} label="Critical" color="error" size="small" />
                      ) : rec.delayDays > rec.inventoryDaysRemaining - 2 ? (
                        <Chip icon={<WarningIcon />} label="Warning" color="warning" size="small" />
                      ) : (
                        <Chip icon={<CheckCircleIcon />} label="Safe" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rec.recommendedAction.type.replace('-', ' ').toUpperCase()}
                        color={getMitigationTypeColor(rec.recommendedAction.type) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {rec.recommendedAction.action}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${rec.recommendedAction.confidence}%`}
                        color={getConfidenceColor(rec.recommendedAction.confidence) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>${rec.recommendedAction.estimatedCost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Analysis
          </Typography>
          
          {recommendations.map((rec, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    {rec.sku} - {rec.supplierName}
                  </Typography>
                  <Chip
                    label={rec.recommendedAction.type.replace('-', ' ').toUpperCase()}
                    color={getMitigationTypeColor(rec.recommendedAction.type) as any}
                    size="small"
                    sx={{ mr: 2 }}
                  />
                  <Chip
                    label={`${rec.recommendedAction.confidence}%`}
                    color={getConfidenceColor(rec.recommendedAction.confidence) as any}
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Delay Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Delay:</strong> {rec.delayDays} days ({rec.reason})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Inventory:</strong> {rec.inventoryDaysRemaining} days remaining
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Original ETA:</strong> {rec.recommendedAction.estimatedTime} days
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Recommended Action
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Method:</strong> {rec.recommendedAction.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Action:</strong> {rec.recommendedAction.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Cost:</strong> ${rec.recommendedAction.estimatedCost}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Time:</strong> {rec.recommendedAction.estimatedTime} days
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rec.analysis}
                    </Typography>
                  </Grid>
                  
                  {rec.alternativeActions && rec.alternativeActions.length > 0 && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Alternative Actions
                      </Typography>
                      {rec.alternativeActions.map((alt, altIndex) => (
                        <Box key={altIndex} sx={{ mb: 1 }}>
                          <Chip
                            label={alt.type.replace('-', ' ').toUpperCase()}
                            color={getMitigationTypeColor(alt.type) as any}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary" component="span">
                            {alt.description} ({alt.confidence}% confidence)
                          </Typography>
                        </Box>
                      ))}
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DelayMitigation; 