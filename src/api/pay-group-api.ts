import { BaseAPI } from './base-api';

export interface PayGroup {
    payGroupId: number;
    groupName: string;
    paymentCycle: string;
    baseTaxRate: number;
    benefitRate: number;
    deductionRate: number;
    createdAt: string;
}

export class PayGroupApi extends BaseAPI {
    constructor(request: any, baseUrl: string) {
        super(request, baseUrl);
    }

    async getPayGroups(paymentCycle?: string) {
        const params = paymentCycle ? `?paymentCycle=${encodeURIComponent(paymentCycle)}` : '';
        return await this.get(`/pay-groups${params}`);
    }
}
