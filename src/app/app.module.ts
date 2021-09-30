import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module'
import { AdminModule } from './modules/admin/admin.module';
import { HttpClientModule } from '@angular/common/http';  
import { DndDirective } from './directives/dnd.directive';
import { ReportsModule } from './modules/reports/reports.module';
import { DatePipe } from '@angular/common';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DndDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AdminModule,
    HttpClientModule,
    ReportsModule
  ],
  providers: [DatePipe,{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
