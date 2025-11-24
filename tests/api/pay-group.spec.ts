import { test, expect } from '@playwright/test';

import { testConfig } from '../../src/config/test-config';

let payGroupApi: PayGroupApi;

import { PayGroupApi } from '../../src/api/pay-group-api';
import type { PayGroup } from '../../src/api/pay-group-api';
test.beforeEach(async ({ request }) => {
    payGroupApi = new PayGroupApi(request, testConfig.api.baseUrl);
});

test.describe('Pay Group API', () => {
    test('TC-01: Retrieve all pay groups (no filter)', async () => {
        const response = await payGroupApi.getPayGroups();
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
        data.forEach(pg => {
            expect(pg).toMatchObject({
                payGroupId: expect.any(Number),
                groupName: expect.any(String),
                paymentCycle: expect.any(String),
                baseTaxRate: expect.any(Number),
                benefitRate: expect.any(Number),
                deductionRate: expect.any(Number),
                createdAt: expect.any(String),
            });
        });
    });

    test('TC-02: Filter by paymentCycle=WEEKLY', async () => {
        const response = await payGroupApi.getPayGroups('WEEKLY');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(data.every(pg => pg.paymentCycle === 'WEEKLY')).toBe(true);
    });

    test('TC-03: Filter by paymentCycle=BIWEEKLY (no match)', async () => {
        const response = await payGroupApi.getPayGroups('BIWEEKLY');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(0);
    });

    test('TC-04: Filter by paymentCycle=MONTHLY', async () => {
        const response = await payGroupApi.getPayGroups('MONTHLY');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(data.every(pg => pg.paymentCycle === 'MONTHLY')).toBe(true);
    });

    test('TC-05: Field schema validation', async () => {
        const response = await payGroupApi.getPayGroups();
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        data.forEach(pg => {
            expect(typeof pg.payGroupId).toBe('number');
            expect(typeof pg.groupName).toBe('string');
            expect(typeof pg.paymentCycle).toBe('string');
            expect(typeof pg.baseTaxRate).toBe('number');
            expect(typeof pg.benefitRate).toBe('number');
            expect(typeof pg.deductionRate).toBe('number');
            expect(typeof pg.createdAt).toBe('string');
        });
    });

    test('TC-06: Invalid paymentCycle value', async () => {
        const response = await payGroupApi.getPayGroups('INVALID');
        expect(response.status()).toBe(500);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(false);

    });

    test('TC-07: Case sensitivity in filter', async () => {
        const response = await payGroupApi.getPayGroups('monthly');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
        // Should be empty or error depending on API spec
    });

    test('TC-08: Extra/unknown query parameter', async () => {
        const response = await payGroupApi.get('/pay-groups?foo=bar');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test('TC-09: SQL injection attempt in filter', async () => {
        const response = await payGroupApi.getPayGroups(`WEEKLY' OR 1=1--`);
        expect(response.status()).toBe(500);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(false);
        // Should be empty or error, but not all data
    });

    test('TC-10: Empty filter value', async () => {
        const response = await payGroupApi.getPayGroups('');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    // TC-11: No pay groups in DB - requires DB setup/teardown, usually handled in integration environment

    test('TC-12: Invalid HTTP method', async () => {
        const response = await payGroupApi.post('/pay-groups');
        expect([400, 405]).toContain(response.status());
    });

    test('TC-13: Accept header variations', async () => {
        const response = await payGroupApi.get('/pay-groups', {
            headers: { Accept: 'application/json' },
        });
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

});
