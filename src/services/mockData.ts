import { 
  PurchaseOrder, 
  DeliveryException, 
  Supplier, 
  DashboardMetrics,
  EmailTemplate,
  ExceptionWorkflow,
  WorkflowStep
} from '@/types';
import { addDays, subDays, format } from 'date-fns';

// Mock Suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-001',
    name: 'Global Electronics Corp',
    email: 'orders@globalelectronics.com',
    phone: '+1-555-0101',
    leadTime: 14,
    reliability: 95,
    rating: 4.8,
    specialties: ['Electronics', 'Components'],
    location: 'San Jose, CA',
    isPreferred: true
  },
  {
    id: 'supplier-002',
    name: 'Precision Manufacturing Ltd',
    email: 'sales@precisionmfg.com',
    phone: '+1-555-0102',
    leadTime: 21,
    reliability: 88,
    rating: 4.2,
    specialties: ['Machining', 'Metal Parts'],
    location: 'Detroit, MI',
    isPreferred: true
  },
  {
    id: 'supplier-003',
    name: 'FastTrack Logistics',
    email: 'dispatch@fasttrack.com',
    phone: '+1-555-0103',
    leadTime: 7,
    reliability: 92,
    rating: 4.5,
    specialties: ['Logistics', 'Express Delivery'],
    location: 'Chicago, IL',
    isPreferred: false
  },
  {
    id: 'supplier-004',
    name: 'Quality Components Inc',
    email: 'orders@qualitycomp.com',
    phone: '+1-555-0104',
    leadTime: 18,
    reliability: 85,
    rating: 4.0,
    specialties: ['Plastics', 'Injection Molding'],
    location: 'Houston, TX',
    isPreferred: false
  },
  {
    id: 'supplier-005',
    name: 'Reliable Parts Co',
    email: 'sales@reliableparts.com',
    phone: '+1-555-0105',
    leadTime: 12,
    reliability: 97,
    rating: 4.9,
    specialties: ['Bearings', 'Mechanical Parts'],
    location: 'Cleveland, OH',
    isPreferred: true
  }
];

// Mock Purchase Orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    orderNumber: 'PO-2024-001',
    supplierId: 'supplier-001',
    supplierName: 'Global Electronics Corp',
    items: [
      {
        id: 'item-001',
        sku: 'ELEC-001',
        description: 'Microcontroller Unit (MCU)',
        quantity: 500,
        unitPrice: 12.50,
        totalPrice: 6250.00
      }
    ],
    totalAmount: 6250.00,
    currency: 'USD',
    orderDate: subDays(new Date(), 30),
    requiredDate: addDays(new Date(), 5),
    expectedDate: addDays(new Date(), 3),
    status: 'confirmed',
    priority: 'high',
    category: 'Electronics'
  },
  {
    id: 'po-002',
    orderNumber: 'PO-2024-002',
    supplierId: 'supplier-002',
    supplierName: 'Precision Manufacturing Ltd',
    items: [
      {
        id: 'item-002',
        sku: 'MECH-001',
        description: 'Aluminum Housing Components',
        quantity: 200,
        unitPrice: 45.00,
        totalPrice: 9000.00
      }
    ],
    totalAmount: 9000.00,
    currency: 'USD',
    orderDate: subDays(new Date(), 25),
    requiredDate: addDays(new Date(), 2),
    expectedDate: addDays(new Date(), 8),
    status: 'in-production',
    priority: 'critical',
    category: 'Mechanical'
  },
  {
    id: 'po-003',
    orderNumber: 'PO-2024-003',
    supplierId: 'supplier-003',
    supplierName: 'FastTrack Logistics',
    items: [
      {
        id: 'item-003',
        sku: 'LOG-001',
        description: 'Express Shipping Services',
        quantity: 1,
        unitPrice: 2500.00,
        totalPrice: 2500.00
      }
    ],
    totalAmount: 2500.00,
    currency: 'USD',
    orderDate: subDays(new Date(), 20),
    requiredDate: addDays(new Date(), 1),
    expectedDate: addDays(new Date(), 1),
    status: 'shipped',
    priority: 'medium',
    category: 'Logistics'
  },
  {
    id: 'po-004',
    orderNumber: 'PO-2024-004',
    supplierId: 'supplier-004',
    supplierName: 'Quality Components Inc',
    items: [
      {
        id: 'item-004',
        sku: 'PLASTIC-001',
        description: 'Injection Molded Covers',
        quantity: 1000,
        unitPrice: 8.75,
        totalPrice: 8750.00
      }
    ],
    totalAmount: 8750.00,
    currency: 'USD',
    orderDate: subDays(new Date(), 35),
    requiredDate: addDays(new Date(), 10),
    expectedDate: addDays(new Date(), 15),
    status: 'confirmed',
    priority: 'low',
    category: 'Plastics'
  },
  {
    id: 'po-005',
    orderNumber: 'PO-2024-005',
    supplierId: 'supplier-005',
    supplierName: 'Reliable Parts Co',
    items: [
      {
        id: 'item-005',
        sku: 'BEARING-001',
        description: 'Precision Ball Bearings',
        quantity: 300,
        unitPrice: 15.00,
        totalPrice: 4500.00
      }
    ],
    totalAmount: 4500.00,
    currency: 'USD',
    orderDate: subDays(new Date(), 28),
    requiredDate: addDays(new Date(), 7),
    expectedDate: addDays(new Date(), 6),
    status: 'confirmed',
    priority: 'high',
    category: 'Mechanical'
  }
];

// Mock Delivery Exceptions
export const mockDeliveryExceptions: DeliveryException[] = [
  {
    id: 'exception-001',
    purchaseOrderId: 'po-002',
    orderNumber: 'PO-2024-002',
    supplierId: 'supplier-002',
    supplierName: 'Precision Manufacturing Ltd',
    exceptionType: 'delivery-delay',
    severity: 'critical',
    detectedDate: subDays(new Date(), 2),
    expectedDate: addDays(new Date(), 8),
    requiredDate: addDays(new Date(), 2),
    delayDays: 6,
    reason: 'Production line equipment failure causing 1-week delay',
    status: 'investigating',
    assignedTo: 'John Smith',
    alternativeSuppliers: [mockSuppliers[0], mockSuppliers[4]],
    emailDraft: {
      id: 'email-001',
      to: 'sales@precisionmfg.com',
      cc: ['procurement@company.com'],
      subject: 'URGENT: Delivery Delay - PO-2024-002',
      body: `Dear Precision Manufacturing Team,

We have been notified of a potential delay in our order PO-2024-002 for Aluminum Housing Components. This order is critical for our production schedule and any delay will have significant impact on our operations.

Please provide an immediate update on:
1. Current production status
2. Expected delivery date
3. Mitigation plans to minimize delay impact

We are also exploring alternative suppliers to ensure timely delivery. Please respond within 24 hours.

Best regards,
Supply Chain Team`,
      isUrgent: true,
      template: {
        id: 'template-001',
        name: 'Critical Delay Follow-up',
        subject: 'URGENT: Delivery Delay - {orderNumber}',
        body: 'Standard delay follow-up template',
        variables: ['orderNumber', 'supplierName', 'delayDays'],
        category: 'delay'
      }
    }
  },
  {
    id: 'exception-002',
    purchaseOrderId: 'po-004',
    orderNumber: 'PO-2024-004',
    supplierId: 'supplier-004',
    supplierName: 'Quality Components Inc',
    exceptionType: 'delivery-delay',
    severity: 'medium',
    detectedDate: subDays(new Date(), 1),
    expectedDate: addDays(new Date(), 15),
    requiredDate: addDays(new Date(), 10),
    delayDays: 5,
    reason: 'Raw material shortage affecting production capacity',
    status: 'open',
    alternativeSuppliers: [mockSuppliers[1], mockSuppliers[3]]
  }
];

// Mock Email Templates
export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'template-001',
    name: 'Critical Delay Follow-up',
    subject: 'URGENT: Delivery Delay - {orderNumber}',
    body: `Dear {supplierName} Team,

We have been notified of a potential delay in our order {orderNumber}. This order is critical for our production schedule and any delay will have significant impact on our operations.

Please provide an immediate update on:
1. Current production status
2. Expected delivery date
3. Mitigation plans to minimize delay impact

We are also exploring alternative suppliers to ensure timely delivery. Please respond within 24 hours.

Best regards,
Supply Chain Team`,
    variables: ['orderNumber', 'supplierName', 'delayDays'],
    category: 'delay'
  },
  {
    id: 'template-002',
    name: 'Alternative Supplier Request',
    subject: 'Urgent Order Request - {orderNumber}',
    body: `Dear {supplierName} Team,

We are experiencing a critical delay with our current supplier for order {orderNumber}. We are reaching out to you as a preferred alternative supplier to request urgent assistance.

Order Details:
- Items: {itemDescription}
- Quantity: {quantity}
- Required Date: {requiredDate}

Please confirm if you can meet this timeline and provide pricing. This is a high-priority request.

Best regards,
Supply Chain Team`,
    variables: ['orderNumber', 'supplierName', 'itemDescription', 'quantity', 'requiredDate'],
    category: 'delay'
  }
];

// Mock Workflow Steps
export const mockWorkflowSteps: WorkflowStep[] = [
  {
    id: 'step-001',
    name: 'Initial Assessment',
    description: 'Review exception details and assess impact',
    status: 'completed',
    assignedTo: 'John Smith',
    dueDate: subDays(new Date(), 1),
    completedDate: subDays(new Date(), 1),
    notes: 'Exception confirmed, critical impact identified'
  },
  {
    id: 'step-002',
    name: 'Supplier Communication',
    description: 'Contact supplier for status update and resolution plan',
    status: 'in-progress',
    assignedTo: 'John Smith',
    dueDate: new Date(),
    notes: 'Email drafted, awaiting supplier response'
  },
  {
    id: 'step-003',
    name: 'Alternative Supplier Search',
    description: 'Identify and contact alternative suppliers',
    status: 'pending',
    assignedTo: 'Sarah Johnson',
    dueDate: addDays(new Date(), 1)
  },
  {
    id: 'step-004',
    name: 'Resolution Implementation',
    description: 'Implement chosen resolution strategy',
    status: 'pending',
    assignedTo: 'Mike Wilson',
    dueDate: addDays(new Date(), 3)
  }
];

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalOrders: 156,
  activeExceptions: 8,
  atRiskOrders: 12,
  delayedOrders: 5,
  resolvedToday: 3,
  averageResolutionTime: 2.5,
  topSuppliers: [
    {
      supplierId: 'supplier-001',
      supplierName: 'Global Electronics Corp',
      totalOrders: 45,
      onTimeDeliveries: 43,
      delayedDeliveries: 2,
      averageDelay: 1.5,
      reliabilityScore: 95.6
    },
    {
      supplierId: 'supplier-005',
      supplierName: 'Reliable Parts Co',
      totalOrders: 38,
      onTimeDeliveries: 37,
      delayedDeliveries: 1,
      averageDelay: 0.5,
      reliabilityScore: 97.4
    }
  ]
};

// Helper function to get alternative suppliers for a given order
export const getAlternativeSuppliers = (currentSupplierId: string, category: string): Supplier[] => {
  return mockSuppliers
    .filter(supplier => supplier.id !== currentSupplierId)
    .filter(supplier => supplier.specialties.some(specialty => 
      specialty.toLowerCase().includes(category.toLowerCase())
    ))
    .sort((a, b) => b.reliability - a.reliability)
    .slice(0, 3);
};

// Helper function to calculate delay days
export const calculateDelayDays = (expectedDate: Date, requiredDate: Date): number => {
  const diffTime = expectedDate.getTime() - requiredDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to determine exception severity
export const determineSeverity = (delayDays: number, priority: string): 'low' | 'medium' | 'high' | 'critical' => {
  if (priority === 'critical' || delayDays > 7) return 'critical';
  if (priority === 'high' || delayDays > 3) return 'high';
  if (delayDays > 1) return 'medium';
  return 'low';
}; 