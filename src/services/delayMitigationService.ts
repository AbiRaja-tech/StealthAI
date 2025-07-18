import { DeliveryException, Supplier } from '../types';

// Types for the delay mitigation system
export interface DelayTrigger {
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

export interface MitigationAction {
  type: MitigationType;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost?: number;
  estimatedTime?: number; // in days
  confidence: number; // 0-100
}

export type MitigationType = 
  | 'air-freight' 
  | 'alternate-sourcing' 
  | 'inventory-buffer' 
  | 'production-adjustment' 
  | 'dynamic-rerouting';

export interface MitigationRecommendation {
  sku: string;
  supplierName: string;
  delayDays: number;
  reason: string;
  inventoryDaysRemaining: number;
  recommendedAction: MitigationAction;
  alternativeActions?: MitigationAction[];
  analysis: string;
}

// Sample data for demonstration
export const sampleDelayTriggers: DelayTrigger[] = [
  {
    sku: 'ECU-101',
    supplierName: 'AlphaElectronics',
    originalEta: new Date('2024-02-15'),
    delayDays: 7,
    reason: 'Port congestion',
    inventoryDaysRemaining: 2,
    alternateSuppliers: [
      {
        id: 'supplier-b',
        name: 'BetaElectronics',
        email: 'orders@betaelectronics.com',
        phone: '+1-555-0123',
        leadTime: 5,
        reliability: 85,
        rating: 4,
        specialties: ['electronics', 'automotive'],
        location: 'Taiwan',
        isPreferred: false
      }
    ]
  },
  {
    sku: 'MOTOR-204',
    supplierName: 'DriveMakers',
    originalEta: new Date('2024-02-18'),
    delayDays: 10,
    reason: 'Capacity issues',
    inventoryDaysRemaining: 5,
    otherDcStock: 300,
    otherDcLocation: 'Chicago DC'
  },
  {
    sku: 'PCB-501',
    supplierName: 'GreenCircuits',
    originalEta: new Date('2024-02-12'),
    delayDays: 3,
    reason: 'Customs hold',
    inventoryDaysRemaining: 1,
    alternateSuppliers: [
      {
        id: 'supplier-c',
        name: 'CircuitPro',
        email: 'orders@circuitpro.com',
        phone: '+1-555-0456',
        leadTime: 4,
        reliability: 90,
        rating: 4.5,
        specialties: ['pcb', 'electronics'],
        location: 'Mexico',
        isPreferred: false
      }
    ]
  },
  {
    sku: 'SENSOR-302',
    supplierName: 'SensorTech',
    originalEta: new Date('2024-02-20'),
    delayDays: 5,
    reason: 'Quality inspection delay',
    inventoryDaysRemaining: 8,
    productionImpact: true
  },
  {
    sku: 'BATTERY-405',
    supplierName: 'PowerCell',
    originalEta: new Date('2024-02-22'),
    delayDays: 12,
    reason: 'Transportation strike',
    inventoryDaysRemaining: 3,
    otherDcStock: 150,
    otherDcLocation: 'Los Angeles DC',
    demandLocation: 'San Francisco'
  },
  {
    sku: 'DISPLAY-608',
    supplierName: 'ScreenMasters',
    originalEta: new Date('2024-02-25'),
    delayDays: 15,
    reason: 'Component shortage',
    inventoryDaysRemaining: 1,
    alternateSuppliers: [
      {
        id: 'supplier-d',
        name: 'DisplayPro',
        email: 'orders@displaypro.com',
        phone: '+1-555-0789',
        leadTime: 8,
        reliability: 75,
        rating: 3.5,
        specialties: ['displays', 'screens'],
        location: 'South Korea',
        isPreferred: false
      }
    ]
  }
];

// Mitigation action templates
const mitigationActions: Record<MitigationType, Omit<MitigationAction, 'confidence'>> = {
  'air-freight': {
    type: 'air-freight',
    description: 'Expedite shipment via air freight',
    action: 'Ship remaining units via Air Freight',
    priority: 'high',
    estimatedCost: 2500,
    estimatedTime: 2
  },
  'alternate-sourcing': {
    type: 'alternate-sourcing',
    description: 'Switch to alternate supplier',
    action: 'Use alternate supplier for remaining order',
    priority: 'medium',
    estimatedCost: 500,
    estimatedTime: 5
  },
  'inventory-buffer': {
    type: 'inventory-buffer',
    description: 'Use inventory from other DC',
    action: 'Transfer stock from other distribution center',
    priority: 'low',
    estimatedCost: 200,
    estimatedTime: 1
  },
  'production-adjustment': {
    type: 'production-adjustment',
    description: 'Adjust production schedule',
    action: 'Reschedule production to accommodate delay',
    priority: 'medium',
    estimatedCost: 1000,
    estimatedTime: 3
  },
  'dynamic-rerouting': {
    type: 'dynamic-rerouting',
    description: 'Reroute from closer DC',
    action: 'Source from closer distribution center',
    priority: 'low',
    estimatedCost: 300,
    estimatedTime: 2
  }
};

export class DelayMitigationService {
  
  /**
   * Process delay triggers and generate mitigation recommendations
   */
  static processDelayTriggers(triggers: DelayTrigger[]): MitigationRecommendation[] {
    return triggers.map(trigger => this.analyzeDelay(trigger));
  }

  /**
   * Analyze a single delay trigger and determine the best mitigation strategy
   */
  static analyzeDelay(trigger: DelayTrigger): MitigationRecommendation {
    const recommendations: MitigationAction[] = [];
    
    // Decision logic based on the specified rules
    
    // Rule 1: If delay days exceed inventory days and no alternate/buffer exists, suggest Air Freight
    if (trigger.delayDays > trigger.inventoryDaysRemaining && 
        (!trigger.alternateSuppliers || trigger.alternateSuppliers.length === 0) &&
        !trigger.otherDcStock) {
      recommendations.push({
        ...mitigationActions['air-freight'],
        confidence: 95
      });
    }
    
    // Rule 2: If alternate suppliers are available and can meet lead time, switch sourcing
    if (trigger.alternateSuppliers && trigger.alternateSuppliers.length > 0) {
      const bestAlternate = trigger.alternateSuppliers.reduce((best, current) => 
        current.leadTime < best.leadTime ? current : best
      );
      
      if (bestAlternate.leadTime <= trigger.delayDays + trigger.inventoryDaysRemaining) {
        recommendations.push({
          ...mitigationActions['alternate-sourcing'],
          action: `Use ${bestAlternate.name} instead of ${trigger.supplierName}`,
          confidence: 85
        });
      }
    }
    
    // Rule 3: If other DC stock exists, use Inventory Buffer
    if (trigger.otherDcStock && trigger.otherDcStock > 0) {
      recommendations.push({
        ...mitigationActions['inventory-buffer'],
        action: `Transfer ${Math.min(trigger.otherDcStock, 100)} units from ${trigger.otherDcLocation}`,
        confidence: 90
      });
    }
    
    // Rule 4: If delay is acceptable but affects planning, adjust production schedule
    if (trigger.productionImpact && trigger.delayDays <= trigger.inventoryDaysRemaining + 3) {
      recommendations.push({
        ...mitigationActions['production-adjustment'],
        confidence: 75
      });
    }
    
    // Rule 5: If another DC is closer to demand point, suggest Dynamic Rerouting
    if (trigger.otherDcLocation && trigger.demandLocation && 
        this.isCloserLocation(trigger.otherDcLocation, trigger.demandLocation)) {
      recommendations.push({
        ...mitigationActions['dynamic-rerouting'],
        action: `Source from ${trigger.otherDcLocation} (closer to ${trigger.demandLocation})`,
        confidence: 80
      });
    }
    
    // If no specific rules match, default to air freight for critical delays
    if (recommendations.length === 0 && trigger.delayDays > trigger.inventoryDaysRemaining) {
      recommendations.push({
        ...mitigationActions['air-freight'],
        confidence: 70
      });
    }
    
    // Sort by confidence and priority
    recommendations.sort((a, b) => {
      if (a.confidence !== b.confidence) {
        return b.confidence - a.confidence;
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    const primaryAction = recommendations[0];
    const alternativeActions = recommendations.slice(1);
    
    return {
      sku: trigger.sku,
      supplierName: trigger.supplierName,
      delayDays: trigger.delayDays,
      reason: trigger.reason,
      inventoryDaysRemaining: trigger.inventoryDaysRemaining,
      recommendedAction: primaryAction,
      alternativeActions: alternativeActions.length > 0 ? alternativeActions : undefined,
      analysis: this.generateAnalysis(trigger, primaryAction)
    };
  }

  /**
   * Generate analysis text for the recommendation
   */
  private static generateAnalysis(trigger: DelayTrigger, action: MitigationAction): string {
    const criticality = trigger.delayDays > trigger.inventoryDaysRemaining ? 'CRITICAL' : 'MODERATE';
    
    return `Delay is ${criticality} - ${trigger.delayDays} days delay with only ${trigger.inventoryDaysRemaining} days of inventory remaining. ` +
           `Reason: ${trigger.reason}. Recommended action: ${action.description} with ${action.confidence}% confidence. ` +
           `Estimated cost: $${action.estimatedCost} and ${action.estimatedTime} days to implement.`;
  }

  /**
   * Simple logic to determine if one location is closer to demand point
   */
  private static isCloserLocation(dcLocation: string, demandLocation: string): boolean {
    // Simplified logic - in real implementation, this would use actual distance calculations
    const locationPairs = [
      { dc: 'Chicago DC', demand: 'Detroit', closer: true },
      { dc: 'Los Angeles DC', demand: 'San Francisco', closer: true },
      { dc: 'New York DC', demand: 'Boston', closer: true },
      { dc: 'Dallas DC', demand: 'Houston', closer: true }
    ];
    
    return locationPairs.some(pair => 
      pair.dc === dcLocation && pair.demand === demandLocation && pair.closer
    );
  }

  /**
   * Convert recommendations to JSON format
   */
  static toJson(recommendations: MitigationRecommendation[]): string {
    return JSON.stringify(recommendations, null, 2);
  }

  /**
   * Convert recommendations to table format
   */
  static toTable(recommendations: MitigationRecommendation[]): string {
    const headers = ['SKU', 'Supplier', 'Delay Days', 'Inventory Days', 'Mitigation Method', 'Action', 'Confidence', 'Cost'];
    const rows = recommendations.map(rec => [
      rec.sku,
      rec.supplierName,
      rec.delayDays.toString(),
      rec.inventoryDaysRemaining.toString(),
      rec.recommendedAction.type.replace('-', ' ').toUpperCase(),
      rec.recommendedAction.action,
      `${rec.recommendedAction.confidence}%`,
      `$${rec.recommendedAction.estimatedCost}`
    ]);

    const maxLengths = headers.map((_, i) => 
      Math.max(...rows.map(row => row[i].length), headers[i].length)
    );

    const formatRow = (row: string[]) => 
      row.map((cell, i) => cell.padEnd(maxLengths[i])).join(' | ');

    const separator = maxLengths.map(len => '-'.repeat(len)).join('-+-');

    return [
      formatRow(headers),
      separator,
      ...rows.map(formatRow)
    ].join('\n');
  }

  /**
   * Process email content and extract delay trigger
   */
  static parseEmailContent(emailBody: string): DelayTrigger | null {
    // Simple email parsing logic - in real implementation, this would be more sophisticated
    const lines = emailBody.split('\n');
    const trigger: Partial<DelayTrigger> = {};
    
    for (const line of lines) {
      if (line.includes('SKU:')) {
        trigger.sku = line.split('SKU:')[1].trim();
      } else if (line.includes('Supplier:')) {
        trigger.supplierName = line.split('Supplier:')[1].trim();
      } else if (line.includes('ETA:')) {
        const etaStr = line.split('ETA:')[1].trim();
        trigger.originalEta = new Date(etaStr);
      } else if (line.includes('Delay:')) {
        trigger.delayDays = parseInt(line.split('Delay:')[1].trim());
      } else if (line.includes('Reason:')) {
        trigger.reason = line.split('Reason:')[1].trim();
      } else if (line.includes('Inventory:')) {
        trigger.inventoryDaysRemaining = parseInt(line.split('Inventory:')[1].trim());
      }
    }
    
    // Validate required fields
    if (trigger.sku && trigger.supplierName && trigger.originalEta && 
        trigger.delayDays !== undefined && trigger.reason && 
        trigger.inventoryDaysRemaining !== undefined) {
      return trigger as DelayTrigger;
    }
    
    return null;
  }
}

// Demo function to run the complete workflow
export function runDelayMitigationDemo(): void {
  console.log('=== Delivery Delay Mitigation Demo ===\n');
  
  // Process sample delay triggers
  const recommendations = DelayMitigationService.processDelayTriggers(sampleDelayTriggers);
  
  // Output as JSON
  console.log('JSON Output:');
  console.log(DelayMitigationService.toJson(recommendations));
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Output as table
  console.log('Table Output:');
  console.log(DelayMitigationService.toTable(recommendations));
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Detailed analysis
  console.log('Detailed Analysis:');
  recommendations.forEach((rec, index) => {
    console.log(`\n${index + 1}. ${rec.sku} - ${rec.supplierName}`);
    console.log(`   Delay: ${rec.delayDays} days (${rec.reason})`);
    console.log(`   Inventory: ${rec.inventoryDaysRemaining} days remaining`);
    console.log(`   Recommendation: ${rec.recommendedAction.description}`);
    console.log(`   Action: ${rec.recommendedAction.action}`);
    console.log(`   Confidence: ${rec.recommendedAction.confidence}%`);
    console.log(`   Cost: $${rec.recommendedAction.estimatedCost}`);
    console.log(`   Time: ${rec.recommendedAction.estimatedTime} days`);
    console.log(`   Analysis: ${rec.analysis}`);
    
    if (rec.alternativeActions && rec.alternativeActions.length > 0) {
      console.log(`   Alternative actions:`);
      rec.alternativeActions.forEach(alt => {
        console.log(`     - ${alt.description} (${alt.confidence}% confidence)`);
      });
    }
  });
}

// Example email parsing demo
export function demoEmailParsing(): void {
  console.log('=== Email Parsing Demo ===\n');
  
  const sampleEmail = `
Subject: Delivery Delay Alert - ECU-101

Dear Supply Chain Team,

We have received notification of a delivery delay:

SKU: ECU-101
Supplier: AlphaElectronics
ETA: 2024-02-15
Delay: 7 days
Reason: Port congestion
Inventory: 2 days remaining

Please take appropriate action.

Best regards,
Logistics Team
  `;
  
  const trigger = DelayMitigationService.parseEmailContent(sampleEmail);
  
  if (trigger) {
    console.log('Parsed delay trigger:');
    console.log(JSON.stringify(trigger, null, 2));
    
    const recommendation = DelayMitigationService.analyzeDelay(trigger);
    console.log('\nGenerated recommendation:');
    console.log(JSON.stringify(recommendation, null, 2));
  } else {
    console.log('Failed to parse email content');
  }
} 