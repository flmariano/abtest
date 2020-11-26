import { InjectionToken } from '@angular/core';
import { AbTestsOptions } from './ab-tests.module';

export const CONFIG = new InjectionToken<AbTestsOptions[]>('the configuration for A/B tests');
