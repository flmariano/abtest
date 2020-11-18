import { NgModule } from "@angular/core";

import { CommonModule } from '@angular/common';
import { AbTestsService } from "./ab-tests.service";
import { AbTestsDirective } from "./ab-tests.directive";

export interface AbTestsOptions { // not doing anything yet
    versions: string[];
}

@NgModule({
    declarations: [ AbTestsDirective ],
    imports: [ CommonModule ],
    exports: [ AbTestsDirective, AbTestsService ],
    providers: [ AbTestsService ],
})
export class AbTestsModule {}