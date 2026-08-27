import { Batch, BatchStage } from '../models';
import db from '../database/connection';

export class NurseryService {
  /**
   * Get all batches with pagination
   */
  async getBatches(page: number = 1, limit: number = 20, filters?: any) {
    const offset = (page - 1) * limit;
    let query = db('batches');

    if (filters?.status) {
      query = query.where('status', filters.status);
    }

    if (filters?.variety) {
      query = query.where('variety', 'ilike', `%${filters.variety}%`);
    }

    if (filters?.locationId) {
      query = query.where('location_id', filters.locationId);
    }

    const total = await query.clone().count('* as count').first();
    const batches = await query
      .offset(offset)
      .limit(limit)
      .orderBy('created_at', 'desc');

    return {
      data: batches,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        pages: Math.ceil((total?.count || 0) / limit),
      },
    };
  }

  /**
   * Create a new batch
   */
  async createBatch(batchData: Batch) {
    const [batch] = await db('batches')
      .insert({
        batch_number: batchData.batchNumber,
        seed_source: batchData.seedSource,
        supplier: batchData.supplier,
        collection_date: batchData.collectionDate,
        variety: batchData.variety,
        parent_material: batchData.parentMaterial,
        total_quantity: batchData.totalQuantity,
        status: 'in_progress',
        location_id: batchData.locationId,
        created_by: batchData.createdBy,
      })
      .returning('*');

    return batch;
  }

  /**
   * Get batch by ID with all stages
   */
  async getBatchById(batchId: string) {
    const batch = await db('batches')
      .where('id', batchId)
      .first();

    if (!batch) {
      return null;
    }

    const stages = await db('batch_stages')
      .where('batch_id', batchId)
      .orderBy('stage_number', 'asc');

    return {
      ...batch,
      stages,
    };
  }

  /**
   * Update batch stage
   */
  async updateBatchStage(batchId: string, stageId: string, stageData: BatchStage) {
    const [updated] = await db('batch_stages')
      .where('id', stageId)
      .where('batch_id', batchId)
      .update({
        quantity_passed: stageData.quantityPassed,
        quantity_lost: stageData.quantityLost,
        survival_rate: stageData.survivalRate,
        end_date: stageData.endDate,
        notes: stageData.notes,
        updated_at: new Date(),
      })
      .returning('*');

    return updated;
  }

  /**
   * Get production pipeline status
   */
  async getProductionPipeline() {
    const pipeline = await db('batch_stages')
      .join('batches', 'batch_stages.batch_id', 'batches.id')
      .select(
        'batch_stages.stage_number',
        'batch_stages.stage_name',
        db.raw('SUM(batch_stages.quantity_entered) as total_entered'),
        db.raw('SUM(batch_stages.quantity_passed) as total_passed'),
        db.raw('SUM(batch_stages.quantity_lost) as total_lost'),
        db.raw('AVG(batch_stages.survival_rate) as avg_survival_rate')
      )
      .where('batches.status', 'in_progress')
      .groupBy('batch_stages.stage_number', 'batch_stages.stage_name')
      .orderBy('batch_stages.stage_number', 'asc');

    return pipeline;
  }

  /**
   * Record batch mortality
   */
  async recordMortality(batchId: string, stageId: string, mortalityData: any) {
    const stage = await db('batch_stages')
      .where('id', stageId)
      .where('batch_id', batchId)
      .first();

    if (!stage) {
      throw new Error('Stage not found');
    }

    const newQuantityLost = stage.quantity_lost + mortalityData.quantity;
    const newSurvivalRate =
      ((stage.quantity_entered - newQuantityLost) / stage.quantity_entered) * 100;

    const [updated] = await db('batch_stages')
      .where('id', stageId)
      .update({
        quantity_lost: newQuantityLost,
        survival_rate: newSurvivalRate,
        updated_at: new Date(),
      })
      .returning('*');

    return updated;
  }
}

export default new NurseryService();
