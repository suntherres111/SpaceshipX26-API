export interface CrewLead {
  id: string;
  name: string;
}

export const MAX_CREW_LEADS = 3;

export class CrewLeadLimitExceededError extends Error {
  constructor() {
    super(`System integrity requires exactly ${MAX_CREW_LEADS} Crew Leads.`);
    this.name = 'CrewLeadLimitExceededError';
  }
}