import { Inspection, Disease } from '../models';
import db from '../database/connection';

export class AgronomyService {
  /**
   * Get all inspections
   */
  async getInspections(filters?: any) {
    let query = db('inspections');

    if (filters?.batchId) {
      query = query.where('batch_id', filters.batchId);
    }

    if (filters?.inspectorId) {
      query = query.where('inspector_id', filters.inspectorId);
    }

    if (filters?.startDate && filters?.endDate) {
      query = query.whereBetween('inspection_date', [
        filters.startDate,
        filters.endDate,
      ]);
    }

    const inspections = await query.orderBy('inspection_date', 'desc');
    return inspections;
  }

  /**
   * Create inspection record
   */
  async createInspection(inspectionData: Inspection) {
    const [inspection] = await db('inspections')
      .insert({
        plant_id: inspectionData.plantId,
        batch_id: inspectionData.batchId,
        inspector_id: inspectionData.inspectorId,
        inspection_date: inspectionData.inspectionDate,
        plant_height: inspectionData.plantHeight,
        stem_diameter: inspectionData.stemDiameter,
        leaf_count: inspectionData.leafCount,
        health_status: inspectionData.healthStatus,
        notes: inspectionData.notes,
        photos: JSON.stringify(inspectionData.photos),
        voice_notes: inspectionData.voiceNotes,
      })
      .returning('*');

    return inspection;
  }

  /**
   * Get growth analytics for a plant
   */
  async getGrowthAnalytics(plantId: string) {
    const inspections = await db('inspections')
      .where('plant_id', plantId)
      .orderBy('inspection_date', 'asc')
      .select(
        'inspection_date',
        'plant_height',
        'stem_diameter',
        'leaf_count',
        'health_status'
      );

    if (inspections.length === 0) {
      return null;
    }

    // Calculate growth trends
    const firstInspection = inspections[0];
    const lastInspection = inspections[inspections.length - 1];

    const heightGrowth = lastInspection.plant_height - firstInspection.plant_height;
    const diameterGrowth =
      lastInspection.stem_diameter - firstInspection.stem_diameter;
    const leafGrowth = lastInspection.leaf_count - firstInspection.leaf_count;

    return {
      inspections,
      growthTrends: {
        heightGrowth,
        diameterGrowth,
        leafGrowth,
        totalInspections: inspections.length,
      },
    };
  }

  /**
   * Record disease
   */
  async recordDisease(diseaseData: Disease) {
    const [disease] = await db('diseases')
      .insert({
        batch_id: diseaseData.batchId,
        plant_id: diseaseData.plantId,
        disease_name: diseaseData.diseaseName,
        symptoms: diseaseData.symptoms,
        severity: diseaseData.severity,
        images: JSON.stringify(diseaseData.images),
        treatment_recommendation: diseaseData.treatmentRecommendation,
        isolation_required: diseaseData.isolationRequired,
        recorded_date: diseaseData.recordedDate,
        recorded_by: diseaseData.recordedBy,
      })
      .returning('*');

    return disease;
  }

  /**
   * Get disease surveillance data
   */
  async getDiseaseSurveillance(filters?: any) {
    let query = db('diseases');

    if (filters?.batchId) {
      query = query.where('batch_id', filters.batchId);
    }

    if (filters?.severity) {
      query = query.where('severity', filters.severity);
    }

    if (filters?.isolation) {
      query = query.where('isolation_required', true);
    }

    const diseases = await query.orderBy('recorded_date', 'desc');

    // Calculate statistics
    const stats = {
      totalRecords: diseases.length,
      byDisease: {} as any,
      bySeverity: {} as any,
      isolationRequired: diseases.filter((d) => d.isolation_required).length,
    };

    for (const disease of diseases) {
      stats.byDisease[disease.disease_name] =
        (stats.byDisease[disease.disease_name] || 0) + 1;
      stats.bySeverity[disease.severity] = (stats.bySeverity[disease.severity] || 0) + 1;
    }

    return {
      diseases,
      statistics: stats,
    };
  }

  /**
   * Create field observation
   */
  async createObservation(observationData: any) {
    const [observation] = await db('observations')
      .insert({
        batch_id: observationData.batchId,
        plant_id: observationData.plantId,
        observer_id: observationData.observerId,
        observation_date: new Date(),
        description: observationData.description,
        photos: JSON.stringify(observationData.photos || []),
        voice_notes: observationData.voiceNotes,
        corrective_actions: JSON.stringify(observationData.correctiveActions || []),
        assigned_to: observationData.assignedTo,
      })
      .returning('*');

    return observation;
  }
}

export default new AgronomyService();
