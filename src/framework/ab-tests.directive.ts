import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AbTestsService } from './ab-tests.service';

@Directive({
    selector: '[abTests]',
})
export class AbTestsDirective {
    private _versions: string[];

    constructor(
        private _service: AbTestsService,
        private _viewContainer: ViewContainerRef,
        private _templateRef: TemplateRef<any>
    ) { }

    ngOnInit() {
        if (this._service.shouldRender(this._versions)) {
            this._viewContainer.createEmbeddedView(this._templateRef);
        }
    }

    @Input()
    set abTests(value: string) {
        this._versions = value.split(',');
        for (let i = 0; i < this._versions.length; i++) { // sometimes people will put spaces between versions
            this._versions[i] = this._versions[i].trim();
        }
    }
}