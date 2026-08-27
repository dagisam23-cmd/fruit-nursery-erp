import { InventoryItem } from '../models';
import db from '../database/connection';

export class InventoryService {
  /**
   * Get all inventory items
   */
  async getInventoryItems(page: number = 1, limit: number = 20, filters?: any) {
    const offset = (page - 1) * limit;
    let query = db('inventory_items');

    if (filters?.itemType) {
      query = query.where('item_type', filters.itemType);
    }

    if (filters?.search) {
      query = query.where('item_name', 'ilike', `%${filters.search}%`);
    }

    const total = await query.clone().count('* as count').first();
    const items = await query
      .offset(offset)
      .limit(limit)
      .orderBy('item_name', 'asc');

    return {
      data: items,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        pages: Math.ceil((total?.count || 0) / limit),
      },
    };
  }

  /**
   * Create inventory item
   */
  async createItem(itemData: InventoryItem) {
    const [item] = await db('inventory_items')
      .insert({
        item_type: itemData.itemType,
        item_name: itemData.itemName,
        sku: itemData.sku,
        barcode: itemData.barcode,
        rfid_tag: itemData.rfidTag,
        quantity: itemData.quantity,
        unit: itemData.unit,
        reorder_level: itemData.reorderLevel,
        expiry_date: itemData.expiryDate,
        location: itemData.location,
        supplier: itemData.supplier,
        unit_cost: itemData.unitCost,
        total_value: itemData.quantity * itemData.unitCost,
        last_restock_date: new Date(),
      })
      .returning('*');

    return item;
  }

  /**
   * Scan barcode and update inventory
   */
  async scanBarcode(barcode: string, quantity: number, action: 'add' | 'remove') {
    const item = await db('inventory_items')
      .where('barcode', barcode)
      .first();

    if (!item) {
      throw new Error('Barcode not found');
    }

    const newQuantity = action === 'add' ? item.quantity + quantity : item.quantity - quantity;

    if (newQuantity < 0) {
      throw new Error('Insufficient stock');
    }

    const [updated] = await db('inventory_items')
      .where('id', item.id)
      .update({
        quantity: newQuantity,
        total_value: newQuantity * item.unit_cost,
        updated_at: new Date(),
      })
      .returning('*');

    return updated;
  }

  /**
   * Get reorder alerts
   */
  async getReorderAlerts() {
    const alerts = await db('inventory_items')
      .whereRaw('quantity <= reorder_level')
      .orWhereRaw('expiry_date IS NOT NULL AND expiry_date <= NOW()')
      .select('*');

    return alerts.map((item) => ({
      ...item,
      alertType: item.quantity <= item.reorder_level ? 'LOW_STOCK' : 'EXPIRY_WARNING',
    }));
  }

  /**
   * Stock adjustment
   */
  async adjustStock(itemId: string, adjustment: any) {
    const item = await db('inventory_items')
      .where('id', itemId)
      .first();

    if (!item) {
      throw new Error('Item not found');
    }

    const newQuantity = item.quantity + adjustment.quantityChange;

    if (newQuantity < 0) {
      throw new Error('Insufficient stock');
    }

    const [updated] = await db('inventory_items')
      .where('id', itemId)
      .update({
        quantity: newQuantity,
        total_value: newQuantity * item.unit_cost,
        updated_at: new Date(),
      })
      .returning('*');

    // Log the adjustment
    await db('inventory_adjustments').insert({
      item_id: itemId,
      previous_quantity: item.quantity,
      new_quantity: newQuantity,
      reason: adjustment.reason,
      adjusted_by: adjustment.adjustedBy,
      adjustment_date: new Date(),
    });

    return updated;
  }

  /**
   * Get inventory dashboard metrics
   */
  async getInventoryMetrics() {
    const totalValue = await db('inventory_items')
      .sum('total_value as value')
      .first();

    const lowStockItems = await db('inventory_items')
      .whereRaw('quantity <= reorder_level')
      .count('* as count')
      .first();

    const expiredItems = await db('inventory_items')
      .whereRaw('expiry_date IS NOT NULL AND expiry_date <= NOW()')
      .count('* as count')
      .first();

    const consumptionRate = await db('inventory_adjustments')
      .whereRaw('adjustment_date >= NOW() - INTERVAL \'30 days\'')
      .sum('CAST(previous_quantity - new_quantity AS INTEGER) as consumed')
      .first();

    return {
      totalInventoryValue: totalValue?.value || 0,
      lowStockCount: lowStockItems?.count || 0,
      expiredItemsCount: expiredItems?.count || 0,
      consumptionRate30Days: consumptionRate?.consumed || 0,
    };
  }
}

export default new InventoryService();
