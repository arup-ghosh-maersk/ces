import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { ITPTemplatesComponent } from './components/itp-templates/itp-templates.component';
import { InspectionJobsComponent } from './components/inspection-jobs/inspection-jobs.component';
import { AssetSpecsComponent } from './components/asset-specs/asset-specs.component';
import { ComponentMasterComponent } from './components/component-master/component-master.component';
import { TerminalLocationsComponent } from './components/terminal-locations/terminal-locations.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'assets', component: AssetListComponent },
  { path: 'assets/specs', component: AssetSpecsComponent },
  { path: 'locations', component: TerminalLocationsComponent },
  { path: 'templates', component: ITPTemplatesComponent },
  { path: 'jobs', component: InspectionJobsComponent },
  { path: 'components', component: ComponentMasterComponent },
  { path: '**', redirectTo: '/dashboard' }
];
