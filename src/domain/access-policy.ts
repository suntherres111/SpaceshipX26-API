import { MembershipLevel } from './membership-level.js';
import { Passenger } from './passenger.js';
import { Resource } from './resource.js';

export interface AccessPolicy {
  canAccess(passenger: Passenger, resource: Resource): boolean;
}

export class TierBasedAccessPolicy implements AccessPolicy {
  canAccess(passenger: Passenger, resource: Resource): boolean {
    if (!resource.isActive) return false;
    return passenger.membershipLevel >= resource.minimumLevel;
  }
}