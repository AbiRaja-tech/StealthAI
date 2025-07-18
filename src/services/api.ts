import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  PurchaseOrder, 
  DeliveryException, 
  Supplier, 
  DashboardMetrics,
  EmailTemplate,
  ExceptionWorkflow,
  ApiResponse,
  PaginatedResponse,
  FilterOptions,
  SortOptions
} from '@/types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Class
export class SupplyChainApiService {
  // Purchase Orders
  static async getPurchaseOrders(
    filters?: FilterOptions,
    sort?: SortOptions,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<PurchaseOrder>> {
    const response = await apiClient.get('/purchase-orders', {
      params: { filters, sort, page, limit }
    });
    return response.data;
  }

  static async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.get(`/purchase-orders/${id}`);
    return response.data;
  }

  static async updatePurchaseOrder(id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const response = await apiClient.put(`/purchase-orders/${id}`, data);
    return response.data;
  }

  // Delivery Exceptions
  static async getDeliveryExceptions(
    filters?: FilterOptions,
    sort?: SortOptions,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<DeliveryException>> {
    const response = await apiClient.get('/delivery-exceptions', {
      params: { filters, sort, page, limit }
    });
    return response.data;
  }

  static async getDeliveryExceptionById(id: string): Promise<DeliveryException> {
    const response = await apiClient.get(`/delivery-exceptions/${id}`);
    return response.data;
  }

  static async createDeliveryException(data: Omit<DeliveryException, 'id'>): Promise<DeliveryException> {
    const response = await apiClient.post('/delivery-exceptions', data);
    return response.data;
  }

  static async updateDeliveryException(id: string, data: Partial<DeliveryException>): Promise<DeliveryException> {
    const response = await apiClient.put(`/delivery-exceptions/${id}`, data);
    return response.data;
  }

  static async resolveDeliveryException(id: string, resolutionNotes: string): Promise<DeliveryException> {
    const response = await apiClient.patch(`/delivery-exceptions/${id}/resolve`, { resolutionNotes });
    return response.data;
  }

  // Suppliers
  static async getSuppliers(): Promise<Supplier[]> {
    const response = await apiClient.get('/suppliers');
    return response.data;
  }

  static async getSupplierById(id: string): Promise<Supplier> {
    const response = await apiClient.get(`/suppliers/${id}`);
    return response.data;
  }

  static async getAlternativeSuppliers(
    currentSupplierId: string, 
    category: string
  ): Promise<Supplier[]> {
    const response = await apiClient.get('/suppliers/alternatives', {
      params: { currentSupplierId, category }
    });
    return response.data;
  }

  // Dashboard
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data;
  }

  // Email Templates
  static async getEmailTemplates(): Promise<EmailTemplate[]> {
    const response = await apiClient.get('/email-templates');
    return response.data;
  }

  static async getEmailTemplateById(id: string): Promise<EmailTemplate> {
    const response = await apiClient.get(`/email-templates/${id}`);
    return response.data;
  }

  // Email Drafts
  static async createEmailDraft(exceptionId: string, templateId: string, data: any): Promise<any> {
    const response = await apiClient.post(`/delivery-exceptions/${exceptionId}/email-draft`, {
      templateId,
      ...data
    });
    return response.data;
  }

  static async sendEmail(exceptionId: string, emailData: any): Promise<any> {
    const response = await apiClient.post(`/delivery-exceptions/${exceptionId}/send-email`, emailData);
    return response.data;
  }

  // Workflows
  static async getExceptionWorkflow(exceptionId: string): Promise<ExceptionWorkflow> {
    const response = await apiClient.get(`/delivery-exceptions/${exceptionId}/workflow`);
    return response.data;
  }

  static async updateWorkflowStep(
    exceptionId: string, 
    stepId: string, 
    data: Partial<any>
  ): Promise<ExceptionWorkflow> {
    const response = await apiClient.put(`/delivery-exceptions/${exceptionId}/workflow/steps/${stepId}`, data);
    return response.data;
  }

  // Analytics
  static async getAnalytics(dateRange: { start: Date; end: Date }): Promise<any> {
    const response = await apiClient.get('/analytics', { params: dateRange });
    return response.data;
  }

  // Notifications
  static async getNotifications(): Promise<any[]> {
    const response = await apiClient.get('/notifications');
    return response.data;
  }

  static async markNotificationAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  }
}

// Error handling utilities
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return new ApiError(
      error.response.status,
      error.response.data?.message || 'An error occurred',
      error.response.data?.code
    );
  }
  return new ApiError(500, 'Network error occurred');
};

// Export default instance
export default SupplyChainApiService; 