import { InjectionToken } from '@angular/core';
import { AbTestsConfig } from './ab-tests.module';

export const CONFIG = new InjectionToken<AbTestsConfig[]>('the configuration for A/B tests');
