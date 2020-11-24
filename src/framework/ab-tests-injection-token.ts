import { InjectionToken } from '@angular/core';
import { AbTestsOptions } from './ab-tests.module';

export const CONFIG = new InjectionToken<AbTestsOptions[]>('ANGULAR_AB_TEST_CONFIG');
