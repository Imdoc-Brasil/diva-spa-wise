// ============================================
// INVENTORY & PRODUCTS
// ============================================

export type ProductCategory = 'homecare' | 'treatment_package' | 'giftcard' | 'professional_use' | 'medical_material';

export interface Product {
    id: string;
    organizationId: string;
    name: string;
    activeIngredients?: string;
    presentation?: string;
    contentQuantity?: number;
    contentUnit?: string;
    description?: string;
    price: number;
    costPrice?: number;
    category: ProductCategory;
    stock?: number;
    stockByUnit?: { [unitId: string]: number };
    minStockLevel?: number;
    batchNumber?: string;
    expirationDate?: string;
    lastInvoice?: string;
    supplier?: string;
    isPromotion?: boolean;
    loyaltyPoints?: number;
    unitId?: string;
    serviceReferenceId?: string;
    packageSessionCount?: number;
}

export interface Supplier {
    id: string;
    organizationId: string;
    name: string;
    contact: string;
    email?: string;
    phone?: string;
    document?: string;
    rating?: number;
    categories: string[];
    active: boolean;
}

export interface PurchaseOrder {
    id: string;
    supplierId: string;
    supplierName: string;
    status: 'draft' | 'ordered' | 'received';
    date: string;
    itemsCount: number;
    totalCost: number;
    expectedDelivery?: string;
    items: { productId: string; productName: string; quantity: number; unitCost: number }[];
}

export interface StockAuditItem {
    productId: string;
    productName: string;
    systemQty: number;
    costPrice: number;
    discrepancy: number;
    countedQty?: number;
}

export interface StockAudit {
    id: string;
    date: string;
    status: 'in_progress' | 'completed';
    performedBy: string;
    items: StockAuditItem[];
    totalDiscrepancyValue: number;
}

// Pharmacy & Vials
export interface OpenVial {
    id: string;
    organizationId: string;
    productId: string;
    productName: string;
    batchNumber: string;
    openedAt: string;
    expiresAfterOpen: number;
    initialUnits: number;
    remainingUnits: number;
    openedBy: string;
}

export interface VialUsageLog {
    id: string;
    vialId: string;
    productName: string;
    unitsUsed: number;
    patientName: string;
    procedure: string;
    timestamp: string;
    staffName: string;
}

// Laundry
export interface LinenItem {
    id: string;
    name: string;
    totalQuantity: number;
    statusCounts: {
        clean: number;
        inUse: number;
        dirty: number;
        laundry: number;
    };
    costPerWash: number;
    lifespanWashes: number;
    currentWashes: number;
}

export interface LaundryTransaction {
    id: string;
    date: string;
    type: 'send' | 'receive';
    laundryName: string;
    items: { itemName: string; quantity: number }[];
    totalWeight?: number;
    cost?: number;
}

// Assets
export type AssetStatus = 'operational' | 'warning' | 'critical' | 'maintenance';

export interface Asset {
    id: string;
    name: string;
    serialNumber: string;
    purchaseDate: string;
    warrantyExpires: string;
    supplierId: string;
    status: AssetStatus;
    totalShots: number;
    maxShots: number;
    lastMaintenance: string;
    nextMaintenance: string;
    location: string;
}

export interface MaintenanceRecord {
    id: string;
    assetId: string;
    assetName: string;
    date: string;
    type: 'preventive' | 'corrective';
    technician: string;
    cost: number;
    notes: string;
    status: 'scheduled' | 'completed';
}
