import { Component, Input } from '@angular/core';
import { EventRow } from '../../models/testing.models';

@Component({
  selector: 'dv-clauses-view',
  templateUrl: './clauses-view.component.html',
  styleUrls: ['./clauses-view.component.scss']
})
export class ClausesViewComponent {
  @Input() rows: EventRow[] = [];
  focused?: EventRow;
  select(r: EventRow){ this.focused = r; }
}
