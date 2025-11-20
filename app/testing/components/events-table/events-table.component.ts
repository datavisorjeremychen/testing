import { Component, Input } from '@angular/core';
import { EventRow } from '../../models/testing.models';

@Component({
  selector: 'dv-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent {
  @Input() rows: EventRow[] = [];
  exportCsv(){
    const header = ['event_id','event_time','event_type','amount','label','hit','action','score'];
    const rows = this.rows.map(r => [r.eventId,r.eventTime,r.eventType,r.amount??'',r.label??'',r.hit?'1':'0',r.action??'',(r.score??'')]);
    const csv = [header.join(','), ...rows.map(r=>r.join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'test_results.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
