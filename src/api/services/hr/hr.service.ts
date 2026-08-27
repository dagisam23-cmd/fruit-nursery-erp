import { Employee, Attendance } from '../models';
import db from '../database/connection';

export class HRService {
  /**
   * Get all employees
   */
  async getEmployees(page: number = 1, limit: number = 20, filters?: any) {
    const offset = (page - 1) * limit;
    let query = db('employees');

    if (filters?.department) {
      query = query.where('department', filters.department);
    }

    if (filters?.status) {
      query = query.where('status', filters.status);
    }

    const total = await query.clone().count('* as count').first();
    const employees = await query
      .offset(offset)
      .limit(limit)
      .orderBy('first_name', 'asc');

    return {
      data: employees,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        pages: Math.ceil((total?.count || 0) / limit),
      },
    };
  }

  /**
   * Create employee
   */
  async createEmployee(employeeData: Employee) {
    const [employee] = await db('employees')
      .insert({
        employee_number: employeeData.employeeNumber,
        first_name: employeeData.firstName,
        last_name: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone,
        employment_type: employeeData.employmentType,
        department: employeeData.department,
        designation: employeeData.designation,
        join_date: employeeData.joinDate,
        biometric_id: employeeData.biometricId,
        biometric_type: employeeData.biometricType,
        salary: employeeData.salary,
        status: 'active',
      })
      .returning('*');

    return employee;
  }

  /**
   * Employee check-in
   */
  async checkIn(employeeId: string) {
    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in today
    const existing = await db('attendance')
      .whereRaw(`DATE(check_in_time) = ?::date`, [today])
      .where('employee_id', employeeId)
      .first();

    if (existing) {
      throw new Error('Already checked in today');
    }

    const [attendance] = await db('attendance')
      .insert({
        employee_id: employeeId,
        check_in_time: new Date(),
        status: 'present',
        attendance_date: new Date(),
      })
      .returning('*');

    return attendance;
  }

  /**
   * Employee check-out
   */
  async checkOut(employeeId: string) {
    const today = new Date().toISOString().split('T')[0];

    const attendance = await db('attendance')
      .whereRaw(`DATE(check_in_time) = ?::date`, [today])
      .where('employee_id', employeeId)
      .whereNull('check_out_time')
      .first();

    if (!attendance) {
      throw new Error('No active check-in found');
    }

    const checkOutTime = new Date();
    const hoursWorked =
      (checkOutTime.getTime() - new Date(attendance.check_in_time).getTime()) /
      (1000 * 60 * 60);

    const [updated] = await db('attendance')
      .where('id', attendance.id)
      .update({
        check_out_time: checkOutTime,
        hours_worked: hoursWorked,
        updated_at: new Date(),
      })
      .returning('*');

    return updated;
  }

  /**
   * Get attendance records
   */
  async getAttendance(filters?: any) {
    let query = db('attendance');

    if (filters?.employeeId) {
      query = query.where('employee_id', filters.employeeId);
    }

    if (filters?.startDate && filters?.endDate) {
      query = query.whereBetween('attendance_date', [
        filters.startDate,
        filters.endDate,
      ]);
    }

    const records = await query.orderBy('attendance_date', 'desc');
    return records;
  }

  /**
   * Get productivity metrics
   */
  async getProductivityMetrics(employeeId?: string) {
    let query = db('attendance')
      .whereRaw('attendance_date >= NOW() - INTERVAL \'30 days\'')
      .select(
        'employee_id',
        db.raw('COUNT(*) as days_present'),
        db.raw('SUM(COALESCE(hours_worked, 0)) as total_hours'),
        db.raw('SUM(COALESCE(overtime_hours, 0)) as total_overtime')
      )
      .groupBy('employee_id');

    if (employeeId) {
      query = query.where('employee_id', employeeId);
    }

    const metrics = await query;
    return metrics;
  }
}

export default new HRService();
