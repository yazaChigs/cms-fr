import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { BaseAdminComponent } from './base-admin/base-admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DataManagementComponent } from './data-management/data-management.component';
import { BranchComponent } from './branch/branch.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryComponent } from './category/category.component';
import { TextMessagingComponent } from './text-messaging/text-messaging/text-messaging.component';


const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'category', component: CategoryListComponent },
  { path: 'category-new', component: CategoryComponent },
  { path: 'branch', component: BranchComponent },
  { path: 'branch-list', component: BranchListComponent },
  { path: 'sms', component: TextMessagingComponent },

  {
    path: 'user',
    loadChildren: './users/user.module#UserModule',
    // canActivate: [NgxPermissionsGuard],
    // data: {
    //   permissions: {
    //     only: ['ROLE_GLOBAL', 'ROLE_SUPER_ADMIN'],
    //   }
    // }
  },
  // {
  //   path: 'lab',
  //   loadChildren: './lab/manage-lab.module#ManageLabModule'
  // },
  // {
  //   path: 'radiology',
  //   loadChildren: './radiology/manage-radiology.module#ManageRadiologyModule'
  // },
  //   {path: 'consultation',
  //   loadChildren: './consultation/manage-consultation.module#ManageConsultationModule'
  // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}
