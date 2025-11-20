import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dv-sql-view',
  templateUrl: './sql-view.component.html',
  styleUrls: ['./sql-view.component.scss']
})
export class SqlViewComponent {
  @Input() sql = '';
  @Output() rerun = new EventEmitter<void>();
  copy(){ navigator.clipboard.writeText(this.sql); alert('Copied SQL'); }
}
