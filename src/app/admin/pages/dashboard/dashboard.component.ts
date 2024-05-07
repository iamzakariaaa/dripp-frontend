import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { BarComponent } from '../../components/charts/bar/bar.component';
import { PieComponent } from '../../components/charts/pie/pie.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, BarComponent, PieComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
