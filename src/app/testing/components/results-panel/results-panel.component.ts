import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResultView, TestConfig } from '../../models/testing.models';
import { TestingService } from '../../services/testing.service';

@Component({
  selector: 'dv-results-panel',
  templateUrl: './results-panel.component.html',
  styleUrls: ['./results-panel.component.scss']
})
export class ResultsPanelComponent {
  @Input() config!: TestConfig;
  @Input() view: ResultView = 'summary';
  @Output() viewChange = new EventEmitter<ResultView>();
  @Output() ran = new EventEmitter<any>();

  running = false;
  progress = 0;
  res: any;

  constructor(private svc: TestingService){ 
    this.svc.running$.subscribe(v => this.running = v);
    this.svc.progress$.subscribe(v => this.progress = v);
  }

  run(){
    this.svc.run(this.config).subscribe(res => {
      this.res = res;
      this.ran.emit(res);
    });
  }
}
