import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AddUserComponent } from './admin/users/add-user/add-user.component';
import { ListUserComponent } from './admin/users/list-user/list-user.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { QueryComponent } from './admin/query/query.component';
import { QueryListComponent } from './admin/query-list/query-list.component';
import { CategoryListComponent } from './admin/category-list/category-list.component';
import { TaskListComponent } from './admin/task-list/task-list.component';
import { TaskComponent } from './admin/task/task.component';


const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: ListUserComponent },
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'tasks', component: TaskListComponent },
      { path: 'task-edit', component: TaskComponent },
      { path: 'queries', component: QueryComponent },
      { path: 'query-list', component: QueryListComponent },
      // { path: 'category', component: CategoryListComponent },
      {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule',
        // canActivate: [NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['ROLE_GLOBAL', 'ROLE_SUPER_ADMIN', 'ROLE_FINANCE'],
        //   }
        // }
      },
      {
        path: 'access-denied', component: AccessDeniedComponent
      },
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
