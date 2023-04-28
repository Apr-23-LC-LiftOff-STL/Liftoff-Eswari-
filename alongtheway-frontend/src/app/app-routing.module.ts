import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GasCalculatorComponent } from './gas-calculator/gas-calculator.component';

const routes: Routes = [
  { path: '', component: GasCalculatorComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
