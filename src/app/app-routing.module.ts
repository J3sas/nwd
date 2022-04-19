import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminIndexComponent } from './admin-index/admin-index.component';
import { AdminUserAddComponent } from './admin-user-add/admin-user-add.component';
import { AdminUserInfoComponent } from './admin-user-info/admin-user-info.component';
import { UserGateComponent } from './user-gate/user-gate.component';

const routes: Routes = [
  {path : '',component: UserGateComponent},
  {path : 'admin',component: AdminIndexComponent},
  {path : 'admin-add',component: AdminUserAddComponent},
  {path : 'user/:id',component: AdminUserInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponent = [UserGateComponent,AdminIndexComponent]
