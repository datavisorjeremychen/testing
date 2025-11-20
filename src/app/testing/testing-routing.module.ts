import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestingCenterComponent } from './components/testing-center/testing-center.component';

const routes: Routes = [
  { path: '', component: TestingCenterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestingRoutingModule {}
