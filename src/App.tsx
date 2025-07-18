import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';

// Theme and Store
import { defaultTheme } from '@/theme';
import { useSupplyChainStore } from '@/store/supplyChainStore';

// Components
import Layout from '@/components/Layout/Layout';
import Dashboard from '@/components/Dashboard/Dashboard';
import PurchaseOrders from '@/components/PurchaseOrders/PurchaseOrders';
import DeliveryExceptions from '@/components/DeliveryExceptions/DeliveryExceptions';
import ExceptionDetail from '@/components/DeliveryExceptions/ExceptionDetail';
import Suppliers from '@/components/Suppliers/Suppliers';
import Analytics from '@/components/Analytics/Analytics';
import DelayMitigation from '@/components/DelayMitigation/DelayMitigation';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { 
    loadPurchaseOrders, 
    loadDeliveryExceptions, 
    loadSuppliers, 
    loadDashboardMetrics 
  } = useSupplyChainStore();

  // Load initial data on app startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Promise.all([
          loadDashboardMetrics(),
          loadPurchaseOrders(),
          loadDeliveryExceptions(),
          loadSuppliers(),
        ]);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [loadDashboardMetrics, loadPurchaseOrders, loadDeliveryExceptions, loadSuppliers]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Router>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/purchase-orders" element={<PurchaseOrders />} />
                  <Route path="/delivery-exceptions" element={<DeliveryExceptions />} />
                  <Route path="/delivery-exceptions/:id" element={<ExceptionDetail />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/delay-mitigation" element={<DelayMitigation />} />
                </Routes>
              </Layout>
            </Box>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 