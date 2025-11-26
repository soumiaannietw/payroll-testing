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

export interface CreatePayGroup {
    groupName: string;
    paymentCycle: string;
    baseTaxRate: number;
    benefitRate: number;
    deductionRate: number;
}
export class PayGroupApi extends BaseAPI {
    constructor(request: any, baseUrl: string) {
        super(request, baseUrl);
    }

    async getPayGroups(paymentCycle?: string) {
        const params = paymentCycle ? `?paymentCycle=${encodeURIComponent(paymentCycle)}` : '';
        return await this.get(`/pay-groups${params}`);
    }

    async createPayGroups(paygroupdata: CreatePayGroup) {
        return await this.post('/pay-groups', paygroupdata);
    }

    async updatePayGroups(id:number,paygroupdata:Partial<CreatePayGroup>) {
            return await this.put(`/pay-groups/${id}`, paygroupdata);
        }
}
