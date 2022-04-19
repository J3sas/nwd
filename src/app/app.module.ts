import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserGateComponent } from './user-gate/user-gate.component';
import { SearchIndexComponent } from './search-index/search-index.component';
import { UserCreationComponent } from './user-creation/user-creation.component';
import { AdminIndexComponent } from './admin-index/admin-index.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminUserInfoComponent } from './admin-user-info/admin-user-info.component';
import { AdminUserAddComponent } from './admin-user-add/admin-user-add.component';

@NgModule({
  declarations: [
    AppComponent,
    UserGateComponent,
    SearchIndexComponent,
    UserCreationComponent,
    AdminIndexComponent,
    AdminUserInfoComponent,
    AdminUserAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
