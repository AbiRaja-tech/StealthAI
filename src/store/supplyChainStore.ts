import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  PurchaseOrder, 
  DeliveryException, 
  Supplier, 
  DashboardMetrics,
  FilterOptions,
  SortOptions
} from '@/types';
import { 
  mockPurchaseOrders, 
  mockDeliveryExceptions, 
  mockSuppliers, 
  mockDashboardMetrics 
} from '@/services/mockData';

interface SupplyChainState {
  // Data
  purchaseOrders: PurchaseOrder[];
  deliveryExceptions: DeliveryException[];
  suppliers: Supplier[];
  dashboardMetrics: DashboardMetrics | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  selectedException: DeliveryException | null;
  selectedOrder: PurchaseOrder | null;
  
  // Filters and Pagination
  filters: FilterOptions;
  sortOptions: SortOptions;
  currentPage: number;
  itemsPerPage: number;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedException: (exception: DeliveryException | null) => void;
  setSelectedOrder: (order: PurchaseOrder | null) => void;
  
  // Data Actions
  loadPurchaseOrders: () => Promise<void>;
  loadDeliveryExceptions: () => Promise<void>;
  loadSuppliers: () => Promise<void>;
  loadDashboardMetrics: () => Promise<void>;
  
  // CRUD Operations
  updatePurchaseOrder: (id: string, data: Partial<PurchaseOrder>) => Promise<void>;
  updateDeliveryException: (id: string, data: Partial<DeliveryException>) => Promise<void>;
  resolveDeliveryException: (id: string, resolutionNotes: string) => Promise<void>;
  
  // Filter and Sort
  setFilters: (filters: FilterOptions) => void;
  setSortOptions: (sort: SortOptions) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  
  // Computed Values
  getFilteredPurchaseOrders: () => PurchaseOrder[];
  getFilteredDeliveryExceptions: () => DeliveryException[];
  getAtRiskOrders: () => PurchaseOrder[];
  getCriticalExceptions: () => DeliveryException[];
}

export const useSupplyChainStore = create<SupplyChainState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        purchaseOrders: [],
        deliveryExceptions: [],
        suppliers: [],
        dashboardMetrics: null,
        loading: false,
        error: null,
        selectedException: null,
        selectedOrder: null,
        filters: {},
        sortOptions: { field: 'detectedDate', direction: 'desc' },
        currentPage: 1,
        itemsPerPage: 20,

        // UI Actions
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setSelectedException: (exception) => set({ selectedException: exception }),
        setSelectedOrder: (order) => set({ selectedOrder: order }),

        // Data Loading Actions
        loadPurchaseOrders: async () => {
          set({ loading: true, error: null });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            set({ purchaseOrders: mockPurchaseOrders });
          } catch (error) {
            set({ error: 'Failed to load purchase orders' });
          } finally {
            set({ loading: false });
          }
        },

        loadDeliveryExceptions: async () => {
          set({ loading: true, error: null });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            set({ deliveryExceptions: mockDeliveryExceptions });
          } catch (error) {
            set({ error: 'Failed to load delivery exceptions' });
          } finally {
            set({ loading: false });
          }
        },

        loadSuppliers: async () => {
          set({ loading: true, error: null });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ suppliers: mockSuppliers });
          } catch (error) {
            set({ error: 'Failed to load suppliers' });
          } finally {
            set({ loading: false });
          }
        },

        loadDashboardMetrics: async () => {
          set({ loading: true, error: null });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            set({ dashboardMetrics: mockDashboardMetrics });
          } catch (error) {
            set({ error: 'Failed to load dashboard metrics' });
          } finally {
            set({ loading: false });
          }
        },

        // CRUD Operations
        updatePurchaseOrder: async (id, data) => {
          set({ loading: true, error: null });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            const { purchaseOrders } = get();
            const updatedOrders = purchaseOrders.map(order =>
              order.id === id ? { ...order, ...data } : order
            );
            set({ purchaseOrders: updatedOrders });
          } catch (error) {
            set({ error: 'Failed to update purchase order' });
          } finally {
            set({ loading: false });
          }
        },

        updateDeliveryException: async (id, data) => {
          set({ loading: true, error: null });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            const { deliveryExceptions } = get();
            const updatedExceptions = deliveryExceptions.map(exception =>
              exception.id === id ? { ...exception, ...data } : exception
            );
            set({ deliveryExceptions: updatedExceptions });
          } catch (error) {
            set({ error: 'Failed to update delivery exception' });
          } finally {
            set({ loading: false });
          }
        },

        resolveDeliveryException: async (id, resolutionNotes) => {
          set({ loading: true, error: null });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            const { deliveryExceptions } = get();
            const updatedExceptions = deliveryExceptions.map(exception =>
              exception.id === id 
                ? { 
                    ...exception, 
                    status: 'resolved' as const,
                    resolutionNotes,
                    resolvedDate: new Date()
                  } 
                : exception
            );
            set({ deliveryExceptions: updatedExceptions });
          } catch (error) {
            set({ error: 'Failed to resolve delivery exception' });
          } finally {
            set({ loading: false });
          }
        },

        // Filter and Sort Actions
        setFilters: (filters) => set({ filters, currentPage: 1 }),
        setSortOptions: (sortOptions) => set({ sortOptions }),
        setCurrentPage: (currentPage) => set({ currentPage }),
        setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),

        // Computed Values
        getFilteredPurchaseOrders: () => {
          const { purchaseOrders, filters, sortOptions } = get();
          let filtered = [...purchaseOrders];

          // Apply filters
          if (filters.status) {
            filtered = filtered.filter(order => order.status === filters.status);
          }
          if (filters.priority) {
            filtered = filtered.filter(order => order.priority === filters.priority);
          }
          if (filters.supplierId) {
            filtered = filtered.filter(order => order.supplierId === filters.supplierId);
          }
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(order =>
              order.orderNumber.toLowerCase().includes(searchLower) ||
              order.supplierName.toLowerCase().includes(searchLower)
            );
          }

          // Apply sorting
          filtered.sort((a, b) => {
            const aValue = a[sortOptions.field as keyof PurchaseOrder];
            const bValue = b[sortOptions.field as keyof PurchaseOrder];
            
            if (sortOptions.direction === 'asc') {
              return (aValue ?? 0) > (bValue ?? 0) ? 1 : -1;
            } else {
              return (aValue ?? 0) < (bValue ?? 0) ? 1 : -1;
            }
          });

          return filtered;
        },

        getFilteredDeliveryExceptions: () => {
          const { deliveryExceptions, filters, sortOptions } = get();
          let filtered = [...deliveryExceptions];

          // Apply filters
          if (filters.status) {
            filtered = filtered.filter(exception => exception.status === filters.status);
          }
          if (filters.severity) {
            filtered = filtered.filter(exception => exception.severity === filters.severity);
          }
          if (filters.supplierId) {
            filtered = filtered.filter(exception => exception.supplierId === filters.supplierId);
          }
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(exception =>
              exception.orderNumber.toLowerCase().includes(searchLower) ||
              exception.supplierName.toLowerCase().includes(searchLower)
            );
          }

          // Apply sorting
          filtered.sort((a, b) => {
            const aValue = a[sortOptions.field as keyof DeliveryException];
            const bValue = b[sortOptions.field as keyof DeliveryException];
            
            if (sortOptions.direction === 'asc') {
              return (aValue ?? 0) > (bValue ?? 0) ? 1 : -1;
            } else {
              return (aValue ?? 0) < (bValue ?? 0) ? 1 : -1;
            }
          });

          return filtered;
        },

        getAtRiskOrders: () => {
          const { purchaseOrders } = get();
          const today = new Date();
          const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
          
          return purchaseOrders.filter(order => {
            const expectedDate = new Date(order.expectedDate);
            const requiredDate = new Date(order.requiredDate);
            
            // Order is at risk if expected date is within 3 days of required date
            return expectedDate <= threeDaysFromNow && order.status !== 'delivered';
          });
        },

        getCriticalExceptions: () => {
          const { deliveryExceptions } = get();
          return deliveryExceptions.filter(exception => 
            exception.severity === 'critical' && exception.status !== 'resolved'
          );
        },
      }),
      {
        name: 'supply-chain-store',
        partialize: (state) => ({
          filters: state.filters,
          sortOptions: state.sortOptions,
          currentPage: state.currentPage,
          itemsPerPage: state.itemsPerPage,
        }),
      }
    ),
    {
      name: 'supply-chain-store',
    }
  )
); 