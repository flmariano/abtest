import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LocalStorageHandler } from 'src/framework/data-handlers';
import { AbTestsModule } from 'src/framework/ab-tests.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AbTestsModule
  ],
  providers: [LocalStorageHandler],
  bootstrap: [AppComponent]
})
export class AppModule { }
