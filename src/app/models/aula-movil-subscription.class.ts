export class AulaMovilSubscription {
  uid?: string;
  status: string;
  startDate: number;
  trialStart: number;
  trialEnd: number;
  daysUntilDue: number;
  created: number;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  collectionMethod: string;
  billingCycleAnchor: number;
  cancelAt: number;
  canceledAt: number;
  cancelAtPeriodEnd: boolean;
}
