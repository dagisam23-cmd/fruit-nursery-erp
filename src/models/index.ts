// User Model
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  location: string;
  deviceType: string;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Batch Model
export interface Batch {
  id: string;
  batchNumber: string;
  seedSource: string;
  supplier: string;
  collectionDate: Date;
  variety: string;
  parentMaterial: string;
  germinationDate: Date;
  pottingDate: Date;
  graftingDate: Date;
  hardeningDate: Date;
  totalQuantity: number;
  status: string; // 'in_progress' | 'completed' | 'archived'
  locationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Batch Stage Model
export interface BatchStage {
  id: string;
  batchId: string;
  stageNumber: number;
  stageName: string;
  quantityEntered: number;
  quantityPassed: number;
  quantityLost: number;
  survivalRate: number;
  averageDaysInStage: number;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Plant Model
export interface Plant {
  id: string;
  batchId: string;
  plantNumber: string;
  height: number; // cm
  stemDiameter: number; // mm
  rootDevelopment: string;
  leafCount: number;
  biomassEstimation: number; // grams
  healthStatus: string;
  lastMeasurementDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Inspection Model
export interface Inspection {
  id: string;
  plantId: string;
  batchId: string;
  inspectorId: string;
  inspectionDate: Date;
  plantHeight: number;
  stemDiameter: number;
  leafCount: number;
  healthStatus: string;
  notes: string;
  photos: string[];
  voiceNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Disease Model
export interface Disease {
  id: string;
  batchId: string;
  plantId?: string;
  diseaseName: string;
  symptoms: string;
  severity: string; // 'low' | 'medium' | 'high'
  images: string[];
  treatmentRecommendation: string;
  isolationRequired: boolean;
  recordedDate: Date;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Inventory Item Model
export interface InventoryItem {
  id: string;
  itemType: string; // 'seeds' | 'rootstocks' | 'pots' | 'fertilizers' etc.
  itemName: string;
  sku: string;
  barcode?: string;
  rfidTag?: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  expiryDate?: Date;
  location: string;
  supplier?: string;
  unitCost: number;
  totalValue: number;
  lastRestockDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Purchase Order Model
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  requisitionId?: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: string; // 'draft' | 'submitted' | 'approved' | 'received' | 'paid'
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  createdBy: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  id: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Customer Model
export interface Customer {
  id: string;
  customerName: string;
  customerType: string; // 'farmer' | 'cooperative' | 'commercial_farm' | 'ngo' | 'government' | 'export_buyer'
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  creditLimit: number;
  satisfactionRating: number;
  preferredVarieties: string[];
  purchaseHistory: Order[];
  complaints: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Order Model
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string; // 'lead' | 'prospect' | 'quotation' | 'negotiation' | 'confirmed' | 'dispatched' | 'delivered'
  orderDate: Date;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  batchId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Employee Model
export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employmentType: string; // 'permanent' | 'seasonal' | 'contract' | 'specialist'
  department: string;
  designation: string;
  joinDate: Date;
  biometricId?: string;
  biometricType: string; // 'fingerprint' | 'face' | 'rfid' | 'none'
  salary: number;
  status: string; // 'active' | 'inactive' | 'on_leave'
  createdAt: Date;
  updatedAt: Date;
}

// Attendance Model
export interface Attendance {
  id: string;
  employeeId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  hoursWorked?: number;
  overtimeHours?: number;
  status: string; // 'present' | 'absent' | 'late' | 'half_day'
  attendanceDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Financial Transaction Model
export interface FinancialTransaction {
  id: string;
  transactionNumber: string;
  type: string; // 'income' | 'expense' | 'transfer'
  category: string;
  amount: number;
  currency: string;
  description: string;
  referenceNumber?: string;
  status: string; // 'draft' | 'posted' | 'reconciled'
  transactionDate: Date;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Compliance Audit Model
export interface ComplianceAudit {
  id: string;
  auditType: string; // 'GlobalG.A.P' | 'Organic' | 'National' | 'Export'
  auditDate: Date;
  auditorName: string;
  status: string; // 'scheduled' | 'in_progress' | 'completed' | 'failed'
  findings: AuditFinding[];
  certificateNumber?: string;
  certificateExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditFinding {
  id: string;
  category: string;
  description: string;
  severity: string; // 'critical' | 'major' | 'minor'
  correctiveAction?: string;
  dueDate?: Date;
  status: string; // 'open' | 'in_progress' | 'closed'
}

// Nursery Location Model
export interface NurseryLocation {
  id: string;
  locationName: string;
  locationType: string; // 'headquarters' | 'nursery_block' | 'warehouse' | 'greenhouse' | 'hardening_area' | 'dispatch_center'
  address: string;
  gpsCoordinates: { latitude: number; longitude: number };
  capacity: number;
  occupancy: number;
  healthStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
