import { MembershipLevel } from './membership-level.js';

export interface Passenger {
  id: string;
  name: string;
  membershipLevel: MembershipLevel;
}