import { test, expect } from '@playwright/test';
import { testConfig } from '../../src/config/test-config';
import { EmployeeApi, CreateEmployeeRequest, Employee } from '../../src/api/employee-api';

let employeeApi: EmployeeApi;

test.beforeEach(async ({ request }) => {
    employeeApi = new EmployeeApi(request, testConfig.api.baseUrl);
});

test.describe('Employee API - Create Employee', () => {
    // Helper function to generate unique test data
    const generateUniqueEmployee = (suffix: string): CreateEmployeeRequest => {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        // Generate a short unique ID (e.g., E12345) instead of long timestamp
        const uniqueId = `E${Math.floor(Math.random() * 90000) + 10000}`;
        
        return {
            employeeId: uniqueId,
            firstName: 'John',
            lastName: 'Doe',
            department: 'Engineering',
            designation: 'Software Engineer',
            email: `test.${uniqueId.toLowerCase()}.${Date.now()}@example.com`,
            payGroupId: 1,
            joiningDate: today
        };
    };

    test('TC-01: Create an employee and validate successful creation', async () => {
        // Arrange: Prepare employee data
        const employeeData = generateUniqueEmployee('tc01');

        // Act: Create employee
        const response = await employeeApi.createEmployee(employeeData);

        // Assert: Verify response status
        expect(response.status()).toBe(201);

        // Assert: Verify response body
        const createdEmployee: Employee = await response.json();
        
        // Validate all fields are returned correctly
        expect(createdEmployee).toMatchObject({
            employeeId: employeeData.employeeId,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            department: employeeData.department,
            designation: employeeData.designation,
            email: employeeData.email,
            payGroupId: employeeData.payGroupId,
            joiningDate: employeeData.joiningDate
        });

        // Validate additional fields set by the API
        expect(createdEmployee.status).toBe('ACTIVE');
        expect(createdEmployee.createdAt).toBeDefined();
        expect(createdEmployee.updatedAt).toBeDefined();

        // Validate field types
        expect(typeof createdEmployee.employeeId).toBe('string');
        expect(typeof createdEmployee.firstName).toBe('string');
        expect(typeof createdEmployee.lastName).toBe('string');
        expect(typeof createdEmployee.department).toBe('string');
        expect(typeof createdEmployee.designation).toBe('string');
        expect(typeof createdEmployee.email).toBe('string');
        expect(typeof createdEmployee.payGroupId).toBe('number');
        expect(typeof createdEmployee.status).toBe('string');
        expect(typeof createdEmployee.joiningDate).toBe('string');
        expect(typeof createdEmployee.createdAt).toBe('string');
        expect(typeof createdEmployee.updatedAt).toBe('string');

        // Optional: Verify employee can be retrieved
        const getResponse = await employeeApi.getEmployee(employeeData.employeeId);
        expect(getResponse.status()).toBe(200);
        const retrievedEmployee: Employee = await getResponse.json();
        expect(retrievedEmployee.employeeId).toBe(employeeData.employeeId);
    });

    test('TC-02: Try to create employee with same employee ID - expect 409 conflict', async () => {
        // Arrange: Create an employee first
        const employeeData = generateUniqueEmployee('tc02');
        const firstResponse = await employeeApi.createEmployee(employeeData);
        expect(firstResponse.status()).toBe(201);

        // Act: Try to create another employee with the same employeeId
        const duplicateEmployee = {
            ...employeeData,
            firstName: 'Jane',  // Different first name
            lastName: 'Smith',  // Different last name
            email: `jane.smith.${Date.now()}@example.com`  // Different email
        };
        const duplicateResponse = await employeeApi.createEmployee(duplicateEmployee);

        // Assert: Verify 409 Conflict response
        expect(duplicateResponse.status()).toBe(409);

        // Assert: Verify error response contains meaningful information
        const errorBody = await duplicateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('conflict') || 
            bodyString.includes('already exists') || 
            bodyString.includes('duplicate') ||
            bodyString.includes('employeeid')
        ).toBeTruthy();
    });

    test('TC-03: Try to create employee with email associated with another employee - expect 409 conflict', async () => {
        // Arrange: Create an employee first
        const employeeData = generateUniqueEmployee('tc03');
        const firstResponse = await employeeApi.createEmployee(employeeData);
        expect(firstResponse.status()).toBe(201);

        // Act: Try to create another employee with different employeeId but same email
        const today = new Date().toISOString().split('T')[0];
        const uniqueId = `E${Math.floor(Math.random() * 90000) + 10000}`;
        const duplicateEmailEmployee: CreateEmployeeRequest = {
            employeeId: uniqueId,  // Different employee ID
            firstName: 'Jane',
            lastName: 'Smith',
            department: 'Marketing',
            designation: 'Marketing Manager',
            email: employeeData.email,  // Same email as first employee
            payGroupId: 1,
            joiningDate: today
        };
        const duplicateResponse = await employeeApi.createEmployee(duplicateEmailEmployee);

        // Assert: Verify 409 Conflict response
        expect(duplicateResponse.status()).toBe(409);

        // Assert: Verify error response contains meaningful information
        const errorBody = await duplicateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns related to email
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('conflict') || 
            bodyString.includes('already exists') || 
            bodyString.includes('duplicate') ||
            bodyString.includes('email')
        ).toBeTruthy();
    });

    test('TC-04: Create employee with missing payGroupId - expect 400 validation error', async () => {
        // Arrange: Create employee data without payGroupId
        const today = new Date().toISOString().split('T')[0];
        const uniqueId = `E${Math.floor(Math.random() * 90000) + 10000}`;
        const invalidEmployeeData: any = {
            employeeId: uniqueId,
            firstName: 'John',
            lastName: 'Doe',
            department: 'Engineering',
            designation: 'Software Engineer',
            email: `test.${uniqueId.toLowerCase()}.${Date.now()}@example.com`,
            // payGroupId is intentionally missing
            joiningDate: today
        };

        // Act: Try to create employee without payGroupId
        const response = await employeeApi.createEmployee(invalidEmployeeData);

        // Assert: Verify 400 Bad Request response
        expect(response.status()).toBe(400);

        // Assert: Verify error response contains validation error information
        const errorBody = await response.json();
        expect(errorBody).toBeDefined();
        
        // Check for validation error messages
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('required') || 
            bodyString.includes('paygroupid') ||
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    });
});

test.describe('Employee API - Update Employee', () => {
    // Helper function to generate unique test data
    const generateUniqueEmployee = (suffix: string): CreateEmployeeRequest => {
        const today = new Date().toISOString().split('T')[0];
        const uniqueId = `E${Math.floor(Math.random() * 90000) + 10000}`;
        
        return {
            employeeId: uniqueId,
            firstName: 'John',
            lastName: 'Doe',
            department: 'Engineering',
            designation: 'Software Engineer',
            email: `test.${uniqueId.toLowerCase()}.${Date.now()}@example.com`,
            payGroupId: 1,
            joiningDate: today
        };
    };

    test('TC-01: Update an employee and validate successful update with updatedAt change', async () => {
        // Arrange: Create an employee first
        const employeeData = generateUniqueEmployee('update-tc01');
        const createResponse = await employeeApi.createEmployee(employeeData);
        expect(createResponse.status()).toBe(201);
        
        const createdEmployee: Employee = await createResponse.json();
        const originalUpdatedAt = createdEmployee.updatedAt;
        
        // Wait a small moment to ensure timestamp difference
        await new Promise(resolve => setTimeout(resolve, 100));

        // Act: Update the employee's information
        const updateData = {
            firstName: 'Jane',
            lastName: 'Smith',
            department: 'Marketing',
            designation: 'Marketing Manager',
            email: `updated.${createdEmployee.employeeId.toLowerCase()}.${Date.now()}@example.com`,
            payGroupId: 2,
            joiningDate: createdEmployee.joiningDate,
            status: 'ACTIVE'
        };
        
        const updateResponse = await employeeApi.updateEmployee(createdEmployee.employeeId, updateData);

        // Assert: Verify successful update response
        expect(updateResponse.status()).toBe(200);
        
        const updatedEmployee: Employee = await updateResponse.json();
        
        // Validate updated fields
        expect(updatedEmployee.employeeId).toBe(createdEmployee.employeeId);
        expect(updatedEmployee.firstName).toBe(updateData.firstName);
        expect(updatedEmployee.lastName).toBe(updateData.lastName);
        expect(updatedEmployee.department).toBe(updateData.department);
        expect(updatedEmployee.designation).toBe(updateData.designation);
        expect(updatedEmployee.email).toBe(updateData.email);
        expect(updatedEmployee.payGroupId).toBe(updateData.payGroupId);
        
        // Validate updatedAt has changed
        expect(updatedEmployee.updatedAt).not.toBe(originalUpdatedAt);
        expect(new Date(updatedEmployee.updatedAt).getTime()).toBeGreaterThan(new Date(originalUpdatedAt).getTime());
        
        // Validate createdAt hasn't changed
        expect(updatedEmployee.createdAt).toBe(createdEmployee.createdAt);

        // Act: Get the employee to verify persistence
        const getResponse = await employeeApi.getEmployee(createdEmployee.employeeId);
        expect(getResponse.status()).toBe(200);
        
        const retrievedEmployee: Employee = await getResponse.json();
        
        // Assert: Verify GET returns the updated data
        expect(retrievedEmployee.firstName).toBe(updateData.firstName);
        expect(retrievedEmployee.lastName).toBe(updateData.lastName);
        expect(retrievedEmployee.department).toBe(updateData.department);
        expect(retrievedEmployee.email).toBe(updateData.email);
        
        // Verify updatedAt is greater than or equal to the original (data was persisted)
        expect(new Date(retrievedEmployee.updatedAt).getTime()).toBeGreaterThan(new Date(originalUpdatedAt).getTime());
    });

    test('TC-02: API returns 404 if employee does not exist', async () => {
        // Arrange: Generate a non-existent employee ID
        const nonExistentEmployeeId = `E99999`;
        
        const updateData = {
            firstName: 'Jane',
            lastName: 'Smith',
            department: 'Marketing',
            designation: 'Marketing Manager',
            email: `test.nonexistent.${Date.now()}@example.com`
        };

        // Act: Try to update a non-existent employee
        const response = await employeeApi.updateEmployee(nonExistentEmployeeId, updateData);

        // Assert: Verify 404 Not Found response
        expect(response.status()).toBe(404);
        
        // Assert: Verify error response
        const errorBody = await response.json();
        expect(errorBody).toBeDefined();
        
        // Check for error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('not found') || 
            bodyString.includes('does not exist') ||
            bodyString.includes('employee')
        ).toBeTruthy();
    });

    test('TC-03: API prevents editing to an email already used by another employee', async () => {
        // Arrange: Create two employees
        const employee1Data = generateUniqueEmployee('update-tc03-emp1');
        const employee2Data = generateUniqueEmployee('update-tc03-emp2');
        
        const createResponse1 = await employeeApi.createEmployee(employee1Data);
        expect(createResponse1.status()).toBe(201);
        const employee1: Employee = await createResponse1.json();
        
        const createResponse2 = await employeeApi.createEmployee(employee2Data);
        expect(createResponse2.status()).toBe(201);
        const employee2: Employee = await createResponse2.json();

        // Act: Try to update employee2's email to employee1's email
        const updateData = {
            firstName: employee2.firstName,
            lastName: employee2.lastName,
            department: employee2.department,
            designation: employee2.designation,
            email: employee1.email  // Try to use employee1's email
        };
        
        const updateResponse = await employeeApi.updateEmployee(employee2.employeeId, updateData);

        // Assert: Verify 409 Conflict response
        expect(updateResponse.status()).toBe(409);
        
        // Assert: Verify error response contains meaningful information
        const errorBody = await updateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for conflict error messages
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('conflict') || 
            bodyString.includes('already exists') || 
            bodyString.includes('duplicate') ||
            bodyString.includes('email') ||
            bodyString.includes('in use')
        ).toBeTruthy();

        // Verify employee2's email hasn't changed
        const getResponse = await employeeApi.getEmployee(employee2.employeeId);
        expect(getResponse.status()).toBe(200);
        const retrievedEmployee: Employee = await getResponse.json();
        expect(retrievedEmployee.email).toBe(employee2.email);
    });
});

