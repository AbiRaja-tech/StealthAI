# Delivery Delay Mitigation System

A comprehensive demo-level exception handling workflow for delivery delays in supply chain management. This system processes delay triggers from emails and suggests optimal mitigation actions based on business rules.

## Features

- **Email Trigger Processing**: Parse delay notifications from email content
- **Intelligent Decision Logic**: Apply business rules to determine best mitigation strategies
- **Multiple Mitigation Methods**: Support for 5 different mitigation approaches
- **Structured Output**: Generate recommendations in JSON and table formats
- **React UI Integration**: Modern web interface for visualization and interaction
- **Standalone Demo Script**: Independent Node.js script for testing and demonstration

## Mitigation Methods

1. **Air Freight** - Expedite shipment via air freight for critical delays
2. **Alternate Sourcing** - Switch to alternative suppliers when available
3. **Inventory Buffer** - Use stock from other distribution centers
4. **Production Adjustment** - Reschedule production to accommodate delays
5. **Dynamic Rerouting** - Source from closer distribution centers

## Decision Logic

The system applies the following business rules in order of priority:

1. **Critical Delay Rule**: If delay days exceed inventory days and no alternatives exist → Air Freight
2. **Alternate Supplier Rule**: If alternate suppliers are available and can meet lead time → Switch Sourcing
3. **Inventory Buffer Rule**: If other DC stock exists → Use Inventory Buffer
4. **Production Impact Rule**: If delay affects planning but is acceptable → Adjust Production Schedule
5. **Geographic Optimization Rule**: If another DC is closer to demand point → Dynamic Rerouting

## Sample Data

The system includes 6 sample delay scenarios:

| SKU | Supplier | Delay Days | Reason | Inventory Days | Mitigation Method |
|-----|----------|------------|--------|----------------|-------------------|
| ECU-101 | AlphaElectronics | 7 | Port congestion | 2 | Alternate Sourcing |
| MOTOR-204 | DriveMakers | 10 | Capacity issues | 5 | Inventory Buffer |
| PCB-501 | GreenCircuits | 3 | Customs hold | 1 | Alternate Sourcing |
| SENSOR-302 | SensorTech | 5 | Quality inspection | 8 | Production Adjustment |
| BATTERY-405 | PowerCell | 12 | Transportation strike | 3 | Dynamic Rerouting |
| DISPLAY-608 | ScreenMasters | 15 | Component shortage | 1 | Air Freight |

## Installation & Usage

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Running the Standalone Demo

```bash
# Run the standalone demo script
node delay-mitigation-demo.js
```

### Running the React Application

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Using the React Component

```tsx
import DelayMitigation from './components/DelayMitigation/DelayMitigation';

// In your React component
<DelayMitigation />
```

## API Reference

### DelayMitigationService

#### `processDelayTriggers(triggers: DelayTrigger[]): MitigationRecommendation[]`

Process multiple delay triggers and generate recommendations.

#### `analyzeDelay(trigger: DelayTrigger): MitigationRecommendation`

Analyze a single delay trigger and determine the best mitigation strategy.

#### `parseEmailContent(emailBody: string): DelayTrigger | null`

Parse email content to extract delay trigger information.

#### `toJson(recommendations: MitigationRecommendation[]): string`

Convert recommendations to JSON format.

#### `toTable(recommendations: MitigationRecommendation[]): string`

Convert recommendations to formatted table.

### Data Types

#### DelayTrigger
```typescript
interface DelayTrigger {
  sku: string;
  supplierName: string;
  originalEta: Date;
  delayDays: number;
  reason: string;
  inventoryDaysRemaining: number;
  alternateSuppliers?: Supplier[];
  otherDcStock?: number;
  otherDcLocation?: string;
  productionImpact?: boolean;
  demandLocation?: string;
}
```

#### MitigationRecommendation
```typescript
interface MitigationRecommendation {
  sku: string;
  supplierName: string;
  delayDays: number;
  reason: string;
  inventoryDaysRemaining: number;
  recommendedAction: MitigationAction;
  alternativeActions?: MitigationAction[];
  analysis: string;
}
```

#### MitigationAction
```typescript
interface MitigationAction {
  type: MitigationType;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost?: number;
  estimatedTime?: number;
  confidence: number;
}
```

## Email Format

The system can parse delay notifications from emails in the following format:

```
SKU: ECU-101
Supplier: AlphaElectronics
ETA: 2024-02-15
Delay: 7 days
Reason: Port congestion
Inventory: 2 days remaining
```

## Example Output

### JSON Format
```json
[
  {
    "sku": "ECU-101",
    "supplierName": "AlphaElectronics",
    "delayDays": 7,
    "reason": "Port congestion",
    "inventoryDaysRemaining": 2,
    "recommendedAction": {
      "type": "alternate-sourcing",
      "description": "Switch to alternate supplier",
      "action": "Use BetaElectronics instead of AlphaElectronics",
      "priority": "medium",
      "estimatedCost": 500,
      "estimatedTime": 5,
      "confidence": 85
    },
    "analysis": "Delay is CRITICAL - 7 days delay with only 2 days of inventory remaining. Reason: Port congestion. Recommended action: Switch to alternate supplier with 85% confidence. Estimated cost: $500 and 5 days to implement."
  }
]
```

### Table Format
```
SKU        | Supplier         | Delay Days | Inventory Days | Mitigation Method | Action                                    | Confidence | Cost
-----------|------------------|------------|----------------|-------------------|-------------------------------------------|------------|------
ECU-101    | AlphaElectronics | 7          | 2              | ALTERNATE SOURCING| Use BetaElectronics instead of AlphaElectronics | 85%        | $500
MOTOR-204  | DriveMakers      | 10         | 5              | INVENTORY BUFFER  | Transfer 100 units from Chicago DC        | 90%        | $200
```

## Integration Points

The system is designed to be easily integrated with:

- **Email Systems**: Connect to email servers for automatic trigger detection
- **ERP Systems**: Integrate with enterprise resource planning systems
- **Supply Chain Platforms**: Connect to existing supply chain management tools
- **Notification Systems**: Send alerts and recommendations to stakeholders

## Customization

### Adding New Mitigation Methods

1. Add the new method to the `MitigationType` union type
2. Define the action template in `mitigationActions`
3. Implement the decision logic in `analyzeDelay()`

### Modifying Decision Rules

Update the business logic in the `analyzeDelay()` method to reflect your organization's specific rules and priorities.

### Extending Email Parsing

Enhance the `parseEmailContent()` method to handle different email formats and extract additional fields.

## Future Enhancements

- **Machine Learning Integration**: Use ML models for more sophisticated decision making
- **Real-time Data Integration**: Connect to live inventory and supplier systems
- **Advanced Analytics**: Add predictive analytics for delay forecasting
- **Workflow Automation**: Automate the execution of mitigation actions
- **Multi-language Support**: Support for international supply chains

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 