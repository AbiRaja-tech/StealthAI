export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  leadTime: number; // in days
  reliability: number; // 0-100
  rating: number; // 1-5
  specialties: string[];
  location: string;
  isPreferred: boolean;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  orderDate: Date;
  requiredDate: Date;
  expectedDate: Date;
  status: OrderStatus;
  priority: Priority;
  category: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryException {
  id: string;
  purchaseOrderId: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  exceptionType: ExceptionType;
  severity: Severity;
  detectedDate: Date;
  expectedDate: Date;
  requiredDate: Date;
  delayDays: number;
  reason?: string;
  status: ExceptionStatus;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedDate?: Date;
  alternativeSuppliers?: Supplier[];
  emailDraft?: EmailDraft;
}

export interface EmailDraft {
  id: string;
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: File[];
  isUrgent: boolean;
  template: EmailTemplate;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: 'delay' | 'follow-up' | 'escalation' | 'general';
}

export interface DashboardMetrics {
  totalOrders: number;
  activeExceptions: number;
  atRiskOrders: number;
  delayedOrders: number;
  resolvedToday: number;
  averageResolutionTime: number;
  topSuppliers: SupplierPerformance[];
}

export interface SupplierPerformance {
  supplierId: string;
  supplierName: string;
  totalOrders: number;
  onTimeDeliveries: number;
  delayedDeliveries: number;
  averageDelay: number;
  reliabilityScore: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  assignedTo?: string;
  dueDate?: Date;
  completedDate?: Date;
  notes?: string;
}

export interface ExceptionWorkflow {
  id: string;
  exceptionId: string;
  steps: WorkflowStep[];
  currentStep: number;
  status: 'active' | 'completed' | 'escalated';
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'in-production' | 'shipped' | 'delivered' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ExceptionType = 'delivery-delay' | 'quality-issue' | 'quantity-mismatch' | 'supplier-unresponsive';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ExceptionStatus = 'open' | 'investigating' | 'resolved' | 'escalated' | 'closed';

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  status?: OrderStatus | ExceptionStatus;
  priority?: Priority;
  severity?: Severity;
  supplierId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
} 