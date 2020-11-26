import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LocalStorageHandler } from 'src/framework/local-storage-handler';
import { AbTestsModule, AbTestsOptions } from 'src/framework/ab-tests.module';
import options from 'src/app/options.json';

export const abTestsOptions: AbTestsOptions[] = options; 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AbTestsModule.forRoot(abTestsOptions),
    BrowserModule,
    HttpClientModule
  ],
  providers: [LocalStorageHandler],
  bootstrap: [AppComponent]
})
export class AppModule { }
