import { ModuleWithProviders, NgModule } from "@angular/core";

import { CommonModule } from '@angular/common';
import { AbTestsService } from "./ab-tests.service";
import { AbTestsDirective } from "./ab-tests.directive";
import { CONFIG } from "./ab-tests-injection-token";
import { LocalStorageHandler } from "./local-storage-handler";

export interface AbTestsConfig {
    versions: {
      name: string,
      weight?: number
    }[];
    testName: string;
}

@NgModule({
    declarations: [ AbTestsDirective ],
    imports: [ CommonModule ],
    exports: [ AbTestsDirective ],
    providers: [ LocalStorageHandler ],
})
export class AbTestsModule {
    static forRoot(configs: AbTestsConfig[]): ModuleWithProviders<AbTestsModule> {
        return {
          ngModule: AbTestsModule,
          providers: [
            AbTestsService,
            { provide: CONFIG, useValue: configs }
          ],
        }
      }
}