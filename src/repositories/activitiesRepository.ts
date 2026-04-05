import { getCatalogSnapshot } from '../catalog/catalogStore';
import { activities as activitiesSeed } from '../data/activities';
import type { Activity } from '../data/activities';

export function getAllActivities(): Activity[] {
  return getCatalogSnapshot().activities;
}

export function getActivitiesSeed(): Activity[] {
  return activitiesSeed;
}

export type { Activity } from '../data/activities';
