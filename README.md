# StealthAI Supply Chain Management System

A professional, enterprise-grade web application for managing delivery delay exceptions in supply chain operations. Built with React, TypeScript, and Material-UI for optimal performance and user experience.

## 🚀 Features

### Core Functionality
- **Real-time Dashboard**: Comprehensive overview of supply chain metrics and KPIs
- **Delivery Exception Management**: Detect, track, and resolve delivery delays
- **Purchase Order Monitoring**: Track all active purchase orders with risk assessment
- **Supplier Management**: Manage supplier relationships and performance metrics
- **Email Integration**: Auto-draft professional emails for supplier communication
- **Alternative Supplier Suggestions**: AI-powered recommendations for backup suppliers
- **Workflow Management**: Structured exception resolution workflows

### Key Capabilities
- **Delay Detection**: Automatic detection of potential delays (3-day advance warning)
- **Status Indicators**: Clear visual indicators for on-time, at-risk, and delayed orders
- **Professional Email Templates**: Pre-built templates for supplier communication
- **Responsive Design**: Mobile-friendly interface for field operations
- **Real-time Updates**: Live data updates and notifications
- **Advanced Filtering**: Powerful search and filter capabilities
- **Export Functionality**: Data export for reporting and analysis

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with strict configuration
- **Material-UI (MUI)**: Professional UI components and theming
- **React Router**: Client-side routing and navigation
- **Zustand**: Lightweight state management
- **React Query**: Server state management and caching
- **Date-fns**: Date manipulation and formatting
- **Recharts**: Data visualization and charts

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **TypeScript**: Static type checking
- **React Scripts**: Development and build tooling
- **Notistack**: Toast notifications
- **React Hook Form**: Form handling and validation

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard/       # Dashboard components
│   ├── DeliveryExceptions/ # Exception management
│   ├── Layout/          # Main layout and navigation
│   ├── PurchaseOrders/  # Order management
│   └── Suppliers/       # Supplier management
├── services/            # API and data services
│   ├── api.ts          # API client and endpoints
│   └── mockData.ts     # Mock data for development
├── store/              # State management
│   └── supplyChainStore.ts # Zustand store
├── theme/              # Material-UI theming
│   └── index.ts        # Theme configuration
├── types/              # TypeScript type definitions
│   └── index.ts        # Core interfaces and types
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StealthAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

## 🏗 Architecture

### State Management
The application uses **Zustand** for global state management with the following structure:

- **Data State**: Purchase orders, delivery exceptions, suppliers, metrics
- **UI State**: Loading states, errors, selected items
- **Filter State**: Search, filters, pagination, sorting

### Component Architecture
- **Layout Components**: Navigation, sidebar, header
- **Feature Components**: Dashboard, exceptions, orders, suppliers
- **Shared Components**: Tables, forms, cards, modals
- **Utility Components**: Status indicators, charts, filters

### API Integration
- **RESTful API**: Standard HTTP endpoints for CRUD operations
- **Error Handling**: Comprehensive error handling and user feedback
- **Caching**: React Query for efficient data caching
- **Authentication**: JWT-based authentication (ready for backend integration)

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1976d2) - Main brand color
- **Success**: Green (#2e7d32) - On-time deliveries
- **Warning**: Orange (#ed6c02) - At-risk orders
- **Error**: Red (#d32f2f) - Delayed orders
- **Critical**: Purple (#9c27b0) - Critical exceptions

### Typography
- **Font Family**: Roboto (Google Fonts)
- **Hierarchy**: Clear typographic scale for headings and body text
- **Responsive**: Mobile-optimized font sizes

### Components
- **Cards**: Elevated containers for content sections
- **Tables**: Sortable, filterable data tables
- **Forms**: Consistent form components with validation
- **Buttons**: Primary, secondary, and icon buttons
- **Chips**: Status indicators and tags

## 📊 Data Models

### Core Entities

**PurchaseOrder**
```typescript
interface PurchaseOrder {
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
```

**DeliveryException**
```typescript
interface DeliveryException {
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
```

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

### TypeScript Configuration
- Strict mode enabled
- Path mapping for clean imports
- Comprehensive type definitions
- ESLint integration

## 🧪 Testing

### Test Structure
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user workflow testing

### Running Tests
```bash
npm test              # Run all tests
npm test -- --watch   # Run tests in watch mode
npm test -- --coverage # Run tests with coverage
```

## 📦 Deployment

### Production Build
```bash
npm run build
```

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Run linting and type checking
4. Submit pull request with description
5. Code review and approval
6. Merge to main branch

## 🔮 Roadmap

### Upcoming Features
- **AI-Powered Analytics**: Predictive delay detection
- **Mobile App**: Native mobile application
- **Advanced Reporting**: Custom report builder
- **Integration Hub**: Third-party system integrations
- **Real-time Notifications**: Push notifications and alerts

---

**Built with ❤️ by the StealthAI Team** 