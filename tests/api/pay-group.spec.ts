import { test, expect } from '@playwright/test';

import { testConfig } from '../../src/config/test-config';

let payGroupApi: PayGroupApi;

import { PayGroupApi } from '../../src/api/pay-group-api';
import type { CreatePayGroup, PayGroup } from '../../src/api/pay-group-api';
import { create } from 'domain';

test.beforeEach(async ({ request }) => {
    payGroupApi = new PayGroupApi(request, testConfig.api.baseUrl);
});


//-------------------------------------------------------- Retrieve Pay Group-------------------------------------------------------------------//

test.describe('Pay Group API - Retrieve Pay Groups', () => {
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
   
    const filterValues = [
    { filter: '', expectedPaymentCycles: ['WEEKLY', 'BIWEEKLY', 'MONTHLY'] },
    { filter: 'WEEKLY', expectedPaymentCycles: ['WEEKLY'] },
    { filter: 'BIWEEKLY', expectedPaymentCycles: ['BIWEEKLY'] },
    { filter: 'MONTHLY', expectedPaymentCycles: ['MONTHLY'] },
];

    test('TC-02: Filter by paymentCycle=WEEKLY', async () => {
        const response = await payGroupApi.getPayGroups('WEEKLY');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
        if (data.length > 0) {
        expect(data.every(pg => pg.paymentCycle === 'WEEKLY')).toBe(true);
        }
    });

    test('TC-03: Filter by paymentCycle=BIWEEKLY', async () => {
        const response = await payGroupApi.getPayGroups('BIWEEKLY');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
        if (data.length > 0) {
            expect(data.every(pg => pg.paymentCycle === 'BIWEEKLY')).toBe(true);
        }
    });

    test('TC-04: Filter by paymentCycle=MONTHLY', async () => {
        const response = await payGroupApi.getPayGroups('MONTHLY');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
        if (data.length > 0) {
        expect(data.every(pg => pg.paymentCycle === 'MONTHLY')).toBe(true);
        }
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

    test('TC-06: Empty filter value', async () => {
        const response = await payGroupApi.getPayGroups('');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test('TC-07: Extra/unknown query parameter', async () => {
        const response = await payGroupApi.get('/pay-groups?foo=bar');
        expect(response.status()).toBe(200);
        const data: PayGroup[] = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test('TC-08: Invalid HTTP method', async () => {
        const response = await payGroupApi.post('/pay-groups');
        expect([400, 405]).toContain(response.status());
    }); 
    
    test('TC-09: Invalid paymentCycle value', async () => {
            const response = await payGroupApi.getPayGroups('INVALID');
            expect(response.status()).toBe(500);
            const data: PayGroup[] = await response.json();
            expect(Array.isArray(data)).toBe(false);
    
        });
    
    test('TC-10: Case sensitivity in filter', async () => {
            const response = await payGroupApi.getPayGroups('monthly');
            expect(response.status()).toBe(200);
            const data: PayGroup[] = await response.json();
            expect(Array.isArray(data)).toBe(true);
        });
    
    test('TC-11: SQL injection attempt in filter', async () => {
            const response = await payGroupApi.getPayGroups(`WEEKLY' OR 1=1--`);
            expect(response.status()).toBe(500);
            const data: PayGroup[] = await response.json();
            expect(Array.isArray(data)).toBe(false);
        });
    test('TC-12: Accept header variations', async () => {
            const response = await payGroupApi.get('/pay-groups', {
                headers: { Accept: 'application/json' },
            });
            expect(response.status()).toBe(200);
            const data: PayGroup[] = await response.json();
            expect(Array.isArray(data)).toBe(true);
        });

//--------------------------------------------------------Create Pay Group-------------------------------------------------------------------//

test.describe('Pay Group API - Create Pay Groups', () => {
    // Helper function to generate unique test data
    const generateUniquePayGroup = (suffix: string): CreatePayGroup => {
    // Generate a short unique groupName (e.g., any123) instead of long timestamp
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=';
    const charactersLength = characters.length;
  
  // Generate a random length between 0 and 50 (inclusive)
    const length = Math.floor(Math.random() * 51); // Multiplies up to 50.99... then floors
  
    let paygroupName = '';
  for (let i = 0; i < length; i++) {
    // Select a random character from the pool and add it to the result
    paygroupName += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
    // Randomly generate values for paymentCycle, baseTaxRate, benefitRate, and deductionRate
    const paymentCycle = ['MONTHLY', 'WEEKLY', 'BIWEEKLY'][Math.floor(Math.random() * 3)];
    const baseTaxRate = Math.random() * 60; // Random value between 0 and 60
    const benefitRate = Math.random() * 100; // Random value between 0 and 100
    const deductionRate = Math.random() * 100; // Random value between 0 and 100
    
    // Create a new PayGroup object with the generated data
    const payGroup: CreatePayGroup = {
        groupName: paygroupName,
        paymentCycle:paymentCycle, // or any other value
        baseTaxRate: Math.min(baseTaxRate, 60), // Ensure baseTaxRate is between 0 and 60
        benefitRate: Math.min(benefitRate, 100), // Ensure benefitRate is between 0 and 100
        deductionRate: Math.min(deductionRate, 100), // Ensure deductionRate is between 0 and 100
    };
    return payGroup;
};
    test('TC-01: Create a paygroup and validate successful creation', async () => {
        const paygroupData = generateUniquePayGroup('tc01');

        // Act: Create paygroup
        const response = await payGroupApi.createPayGroups(paygroupData);

        // Assert: Verify response status
        expect(response.status()).toBe(201);
       
        // Assert: Verify response body
        const createdPayGroup = await response.json();
        expect(createdPayGroup).toHaveProperty('payGroupId');
})
    test('TC-02: Test Create Paygroup API with Case sensitivity in paygroupName', async () => {
        const paygroupData = generateUniquePayGroup('tc02');
        const response = await payGroupApi.createPayGroups(paygroupData);
        expect(response.status()).toBe(201);
       
        // Act: Try to create another paygroup with the same groupName in different case
        const paygroupDatalowerCase  = {
                    ...paygroupData,
                    groupName: paygroupData.groupName.toLowerCase(),  
                };
        const lowerCaseResponse = await payGroupApi.createPayGroups(paygroupDatalowerCase);
        
                // Assert: Verify 409 Conflict response
        expect(lowerCaseResponse.status()).toBe(409);
        
        const errorBody = await lowerCaseResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('conflict') || 
            bodyString.includes('already exists')
        ).toBeTruthy();
    });    

    test('TC-03: Test Create Paygroup API with groupName length > 50', async () => {
        const paygroupData = generateUniquePayGroup('tc03');
        // Act: Try to create another paygroup with the groupName length > 50
        const paygroupDataLongName  = {
                    ...paygroupData,
                    groupName: 'A'.repeat(51),  
                };
        const responseLongName = await payGroupApi.createPayGroups(paygroupDataLongName);
        
        expect(responseLongName.status()).toBe(400);

        const errorBody = await responseLongName.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
        
    });  
    
    test('TC-04: Test Create Paygroup API with empty groupName', async () => {
        const paygroupData = generateUniquePayGroup('tc04');
       // Act: Try to create another paygroup with empty groupName
        const paygroupDataemptygroupName  = {
                    ...paygroupData,
                    groupName: '',  
                };
        const responseemptygroupName = await payGroupApi.createPayGroups(paygroupDataemptygroupName);
        
        expect(responseemptygroupName.status()).toBe(400);

        const errorBody = await responseemptygroupName.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    });  

    test('TC-05: Test Create Paygroup API with empty paymentCycle', async () => {
        const paygroupData = generateUniquePayGroup('tc05');
       // Act: Try to create another paygroup with empty paymentCycle
        const paygroupDataemptypaymentCycle  = {
                    ...paygroupData,
                    paymentCycle: '',  
                };
        const responseemptypaymentCycle = await payGroupApi.createPayGroups(paygroupDataemptypaymentCycle);
        
        expect(responseemptypaymentCycle.status()).toBe(400);

        const errorBody = await responseemptypaymentCycle.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    });

    test('TC-06: Test Create Paygroup API with groupName containing only the digits', async () => {
        const paygroupData = generateUniquePayGroup('tc06');
       const uniqueId = `${Math.floor(Math.random() * 90000) + 10000}`;
        const paygroupDatadigitsgroupName  = {
                    ...paygroupData,
                    groupName: uniqueId,  
                };
        const response = await payGroupApi.createPayGroups(paygroupDatadigitsgroupName);
        
        expect(response.status()).toBe(201);

        const createdPayGroup = await response.json();
        expect(createdPayGroup).toHaveProperty('payGroupId');
})
    test('TC-07: Test Create Paygroup API with extra fields included in payload', async () => {
        const paygroupData = generateUniquePayGroup('tc07');
        const paygroupDataextrafields  = {
                    ...paygroupData,
                    new_field: "yes",  
                };
        const response = await payGroupApi.createPayGroups(paygroupDataextrafields);
        
        expect(response.status()).toBe(201);

        const createdPayGroup = await response.json();
        expect(createdPayGroup).toHaveProperty('payGroupId');
}) 
     
    test('TC-08: Test Create Paygroup API with baseTaxRate < 0', async () => {
        const paygroupData = generateUniquePayGroup('tc08');
        const paygroupDatanegativebasetax  = {
                    ...paygroupData,
                    baseTaxRate : -1 
                };
        const response = await payGroupApi.createPayGroups(paygroupDatanegativebasetax);
        
        expect(response.status()).toBe(400);

        const errorBody = await response.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    });
    
    test('TC-09: Test Create Paygroup API with baseTaxRate > 60.0', async () => {
        const paygroupData = generateUniquePayGroup('tc09');
        const paygroupDatagreaterbasetax  = {
                    ...paygroupData,
                    baseTaxRate : 61
                };
        const response = await payGroupApi.createPayGroups(paygroupDatagreaterbasetax);
        
        expect(response.status()).toBe(400);

        const errorBody = await response.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    });

    test('TC-10: Test Create Paygroup API with benefitRate < 0', async () => {
        const paygroupData = generateUniquePayGroup('tc10');
        const paygroupDatanegativebenefitRate  = {
                    ...paygroupData,
                    benefitRate : -1 
                };
        const response = await payGroupApi.createPayGroups(paygroupDatanegativebenefitRate);
        
        expect(response.status()).toBe(400);

        const errorBody = await response.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    });

    test('TC-11: Test Create Paygroup API with benefitRate > 100', async () => {
        const paygroupData = generateUniquePayGroup('tc11');
        const paygroupDatagreaterbenefitRate  = {
                    ...paygroupData,
                    benefitRate : 101
                };
        const response = await payGroupApi.createPayGroups(paygroupDatagreaterbenefitRate);
        
        expect(response.status()).toBe(400);

        const errorBody = await response.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    });

    test('TC-12: Test Create Paygroup API with deductionRate < 0', async () => {
        const paygroupData = generateUniquePayGroup('tc12');
        const paygroupDatanegativedeductionRate  = {
                    ...paygroupData,
                    deductionRate : -1 
                };
        const response = await payGroupApi.createPayGroups(paygroupDatanegativedeductionRate);
        
        expect(response.status()).toBe(400);

        const errorBody = await response.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    });

    test('TC-13: Test Create Paygroup API with deductionRate > 100', async () => {
        const paygroupData = generateUniquePayGroup('tc13');
        const paygroupDatagreaterdeductionRate  = {
                    ...paygroupData,
                    deductionRate : 101
                };
        const response = await payGroupApi.createPayGroups(paygroupDatagreaterdeductionRate);
        
        expect(response.status()).toBe(400);

        const errorBody = await response.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    });
//-------------------------------------------------------- Update Pay Group-------------------------------------------------------------------//
test.describe('Pay Group API - UPDATE Pay Groups', () => {
    test('TC-01: Test Update Paygroup API with valid inputs', async () => {
    
      const paygroupData = generateUniquePayGroup('tc14');
      const response = await payGroupApi.createPayGroups(paygroupData);
      const data = await response.json();
      const payGroupId = data.payGroupId;
      const uniqueId = `${Math.floor(Math.random() * 90000) + 10000}`;
      const updatedPayGroupData = {
        groupName : uniqueId
      };
      const updateResponse = await payGroupApi.updatePayGroups(payGroupId, updatedPayGroupData);
      expect(updateResponse.status()).toBe(200);
      const updatedData = await updateResponse.json();
      expect(updatedData.payGroupId).toBe(payGroupId);
    })

    test('TC-02: Test Update Paygroup API with empty paymentCycle', async () => {
    
      const paygroupData = generateUniquePayGroup('tc15');
      const response = await payGroupApi.createPayGroups(paygroupData);
      const data = await response.json();
      const payGroupId = data.payGroupId;
      const updatedPayGroupData = {
        paymentCycle : ""
      };
      const updateResponse = await payGroupApi.updatePayGroups(payGroupId, updatedPayGroupData);
      expect(updateResponse.status()).toBe(400);
      const errorBody = await updateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    })
    test('TC-03: Test Update Paygroup API with empty groupName', async () => {
    
      const paygroupData = generateUniquePayGroup('tc16');
      const response = await payGroupApi.createPayGroups(paygroupData);
      const data = await response.json();
      const payGroupId = data.payGroupId;
      const updatedPayGroupData = {
        groupName : ""
      };
      const updateResponse = await payGroupApi.updatePayGroups(payGroupId, updatedPayGroupData);
      expect(updateResponse.status()).toBe(400);
      const errorBody = await updateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    })
    test('TC-04: Test Update Paygroup API with baseTaxRate < 0', async () => {
      const paygroupData = generateUniquePayGroup('tc16');
      const response = await payGroupApi.createPayGroups(paygroupData);
      const data = await response.json();
      const payGroupId = data.payGroupId;
      const updatedPayGroupData = {
        baseTaxRate : -1
      };
      const updateResponse = await payGroupApi.updatePayGroups(payGroupId, updatedPayGroupData);
      expect(updateResponse.status()).toBe(400);
      const errorBody = await updateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    })
    test('TC-05: Test Update Paygroup API with baseTaxRate > 60.0', async () => {
      const paygroupData = generateUniquePayGroup('tc17');
      const response = await payGroupApi.createPayGroups(paygroupData);
      const data = await response.json();
      const payGroupId = data.payGroupId;
      const updatedPayGroupData = {
        baseTaxRate : 61
      };
      const updateResponse = await payGroupApi.updatePayGroups(payGroupId, updatedPayGroupData);
      expect(updateResponse.status()).toBe(400);
      const errorBody = await updateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    })
    test('TC-06: Test Update Paygroup API with benefitRate < 0.0', async () => {
      const paygroupData = generateUniquePayGroup('tc18');
      const response = await payGroupApi.createPayGroups(paygroupData);
      const data = await response.json();
      const payGroupId = data.payGroupId;
      const updatedPayGroupData = {
        benefitRate : -1
      };
      const updateResponse = await payGroupApi.updatePayGroups(payGroupId, updatedPayGroupData);
      expect(updateResponse.status()).toBe(400);
      const errorBody = await updateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    })
    test('TC-07: Test Update Paygroup API with benefitRate > 100.0', async () => {
      const paygroupData = generateUniquePayGroup('tc19');
      const response = await payGroupApi.createPayGroups(paygroupData);
      const data = await response.json();
      const payGroupId = data.payGroupId;
      const updatedPayGroupData = {
        benefitRate : 101
      };
      const updateResponse = await payGroupApi.updatePayGroups(payGroupId, updatedPayGroupData);
      expect(updateResponse.status()).toBe(400);
      const errorBody = await updateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    })
    test('TC-08: Test Update Paygroup API with deductionRate < 0.0', async () => {
      const paygroupData = generateUniquePayGroup('tc20');
      const response = await payGroupApi.createPayGroups(paygroupData);
      const data = await response.json();
      const payGroupId = data.payGroupId;
      const updatedPayGroupData = {
        deductionRate : -1
      };
      const updateResponse = await payGroupApi.updatePayGroups(payGroupId, updatedPayGroupData);
      expect(updateResponse.status()).toBe(400);
      const errorBody = await updateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    })
    test('TC-09: Test Update Paygroup API with deductionRate > 100.0', async () => {
      const paygroupData = generateUniquePayGroup('tc21');
      const response = await payGroupApi.createPayGroups(paygroupData);
      const data = await response.json();
      const payGroupId = data.payGroupId;
      const updatedPayGroupData = {
        deductionRate : 101
      };
      const updateResponse = await payGroupApi.updatePayGroups(payGroupId, updatedPayGroupData);
      expect(updateResponse.status()).toBe(400);
      const errorBody = await updateResponse.json();
        expect(errorBody).toBeDefined();
        
        // Check for common error message patterns
        const bodyString = JSON.stringify(errorBody).toLowerCase();
        expect(
            bodyString.includes('validation') || 
            bodyString.includes('failed') || 
            bodyString.includes('missing') ||
            bodyString.includes('invalid')
        ).toBeTruthy();
    });
});
});
});