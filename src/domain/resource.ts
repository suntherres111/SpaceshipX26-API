import { MembershipLevel } from './membership-level.js';

export interface Resource {
  id: string;
  name: string;
  category: string; // e.g. "Sleeping Pod", "Food Supply Station"
  minimumLevel: MembershipLevel;
  isActive: boolean; // supports Crew Lead decommissioning
}