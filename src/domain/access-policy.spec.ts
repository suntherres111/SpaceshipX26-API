import { describe, it, expect } from 'vitest';
import { TierBasedAccessPolicy } from './access-policy.js';
import { MembershipLevel } from './membership-level.js';
import { Passenger } from './passenger.js';
import { Resource } from './resource.js';

describe('TierBasedAccessPolicy', () => {
  const policy = new TierBasedAccessPolicy();
  const passenger = (level: MembershipLevel): Passenger => ({ id: 'p1', name: 'Test', membershipLevel: level });
  const resource = (minLevel: MembershipLevel, isActive = true): Resource => ({
    id: 'r1', name: 'Test', category: 'Test', minimumLevel: minLevel, isActive,
  });

  it('allows a passenger whose level meets the resource minimum', () => {
    expect(policy.canAccess(passenger(MembershipLevel.Gold), resource(MembershipLevel.Gold))).toBe(true);
  });

  it('allows a higher tier to access a lower-tier resource (inheritance)', () => {
    expect(policy.canAccess(passenger(MembershipLevel.Platinum), resource(MembershipLevel.Silver))).toBe(true);
  });

  it('denies a passenger below the resource minimum', () => {
    expect(policy.canAccess(passenger(MembershipLevel.Silver), resource(MembershipLevel.Platinum))).toBe(false);
  });

  it('denies access to a decommissioned resource regardless of tier', () => {
    expect(policy.canAccess(passenger(MembershipLevel.Platinum), resource(MembershipLevel.Silver, false))).toBe(false);
  });
});