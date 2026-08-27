import { Customer, Order } from '../models';
import db from '../database/connection';

export class CRMService {
  /**
   * Get all customers
   */
  async getCustomers(page: number = 1, limit: number = 20, filters?: any) {
    const offset = (page - 1) * limit;
    let query = db('customers');

    if (filters?.customerType) {
      query = query.where('customer_type', filters.customerType);
    }

    if (filters?.search) {
      query = query.where('customer_name', 'ilike', `%${filters.search}%`);
    }

    const total = await query.clone().count('* as count').first();
    const customers = await query
      .offset(offset)
      .limit(limit)
      .orderBy('customer_name', 'asc');

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        pages: Math.ceil((total?.count || 0) / limit),
      },
    };
  }

  /**
   * Create new customer
   */
  async createCustomer(customerData: Customer) {
    const [customer] = await db('customers')
      .insert({
        customer_name: customerData.customerName,
        customer_type: customerData.customerType,
        contact_person: customerData.contactPerson,
        phone: customerData.phone,
        email: customerData.email,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        country: customerData.country,
        credit_limit: customerData.creditLimit,
        satisfaction_rating: customerData.satisfactionRating || 0,
        preferred_varieties: JSON.stringify(customerData.preferredVarieties || []),
      })
      .returning('*');

    return customer;
  }

  /**
   * Get customer by ID with history
   */
  async getCustomerById(customerId: string) {
    const customer = await db('customers')
      .where('id', customerId)
      .first();

    if (!customer) {
      return null;
    }

    const orders = await db('orders')
      .where('customer_id', customerId)
      .orderBy('order_date', 'desc');

    return {
      ...customer,
      orders,
    };
  }

  /**
   * Create lead/prospect
   */
  async createLead(leadData: any) {
    const [lead] = await db('leads')
      .insert({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        status: 'new',
        source: leadData.source,
        created_by: leadData.createdBy,
      })
      .returning('*');

    return lead;
  }

  /**
   * Get sales pipeline
   */
  async getSalesPipeline(filters?: any) {
    let query = db('orders');

    if (filters?.startDate && filters?.endDate) {
      query = query.whereBetween('order_date', [
        filters.startDate,
        filters.endDate,
      ]);
    }

    const pipeline = await query
      .select('status')
      .count('* as count')
      .sum('total_amount as total_value')
      .groupBy('status');

    return pipeline;
  }

  /**
   * Create order
   */
  async createOrder(orderData: Order) {
    const [order] = await db('orders')
      .insert({
        order_number: orderData.orderNumber,
        customer_id: orderData.customerId,
        total_amount: orderData.totalAmount,
        status: 'draft',
        order_date: new Date(),
      })
      .returning('*');

    // Insert order items
    await db('order_items').insert(
      orderData.items.map((item) => ({
        order_id: order.id,
        batch_id: item.batchId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
      }))
    );

    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string) {
    const [updated] = await db('orders')
      .where('id', orderId)
      .update({
        status,
        updated_at: new Date(),
      })
      .returning('*');

    return updated;
  }
}

export default new CRMService();
