import { ModuleWithProviders, NgModule } from "@angular/core";

import { CommonModule } from '@angular/common';
import { AbTestsService } from "./ab-tests.service";
import { AbTestsDirective } from "./ab-tests.directive";
import { CONFIG } from "./ab-tests-injection-token";

export interface AbTestsOptions {
    contexts: {
      version: string,
      scope: string  // unused
    }[];
    weights?: {
      [x: string]: number,
    };
}

@NgModule({
    declarations: [ AbTestsDirective ],
    imports: [ CommonModule ],
    exports: [ AbTestsDirective ],
    providers: [ ],
})
export class AbTestsModule {
    static forRoot(configs: AbTestsOptions[]): ModuleWithProviders<AbTestsModule> {
        return {
          ngModule: AbTestsModule,
          providers: [
            AbTestsService,
            { provide: CONFIG, useValue: configs }
          ],
        }
      }
}