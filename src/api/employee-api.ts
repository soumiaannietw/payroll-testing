import { BaseAPI } from './base-api';

export interface Employee {
    employeeId: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    email: string;
    payGroupId: number;
    status: string;
    joiningDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEmployeeRequest {
    employeeId: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    email: string;
    payGroupId: number;
    joiningDate: string;
}

export class EmployeeApi extends BaseAPI {
    constructor(request: any, baseUrl: string) {
        super(request, baseUrl);
    }

    async createEmployee(employeeData: CreateEmployeeRequest) {
        return await this.post('/employee', employeeData);
    }

    async getEmployee(employeeId: string) {
        return await this.get(`/employee/${employeeId}`);
    }

    async getAllEmployees() {
        return await this.get('/employee');
    }

    async updateEmployee(employeeId: string, employeeData: Partial<CreateEmployeeRequest>) {
        return await this.put(`/employee/${employeeId}`, employeeData);
    }

    async deleteEmployee(employeeId: string) {
        return await this.delete(`/employee/${employeeId}`);
    }
}

