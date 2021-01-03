import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './old-app.component';
import { AbTestsModule, AbTestsConfig } from 'src/framework/ab-tests.module';
import options from 'src/app/options.json';

export const abTestsOptions: AbTestsConfig[] = options; 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AbTestsModule.forRoot(abTestsOptions),
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
