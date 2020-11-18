import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LocalStorageHandler } from 'src/framework/data-handlers';
import { AbTestsModule } from 'src/framework/ab-tests.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AbTestsModule,
    HttpClientModule
  ],
  providers: [LocalStorageHandler],
  bootstrap: [AppComponent]
})
export class AppModule { }
