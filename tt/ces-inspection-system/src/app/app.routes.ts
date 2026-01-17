import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { ITPTemplatesComponent } from './components/itp-templates/itp-templates.component';
import { InspectionJobsComponent } from './components/inspection-jobs/inspection-jobs.component';
import { AssetSpecsComponent } from './components/asset-specs/asset-specs.component';
import { ComponentMasterComponent } from './components/component-master/component-master.component';
import { TerminalLocationsComponent } from './components/terminal-locations/terminal-locations.component';
import { ComponentInspectionPointsComponent } from './components/component-inspection-points/component-inspection-points.component';
import { AssetComponentPointsComponent } from './components/asset-component-points/asset-component-points.component';
import { ComponentParametersComponent } from './components/component-parameters/component-parameters.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'assets', component: AssetListComponent },
  { path: 'assets/specs', component: AssetSpecsComponent },
  { path: 'locations', component: TerminalLocationsComponent },
  { path: 'templates', component: ITPTemplatesComponent },
  { path: 'jobs', component: InspectionJobsComponent },
  { path: 'components', component: ComponentMasterComponent },
  { path: 'components/:componentId', component: ComponentMasterComponent },
  { path: 'components/inspection-points', component: ComponentInspectionPointsComponent },
  { path: 'components/asset-points', component: AssetComponentPointsComponent },
  { path: 'components/parameters', component: ComponentParametersComponent },
  { path: '**', redirectTo: '/dashboard' }
];
