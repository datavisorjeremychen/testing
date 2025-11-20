import { Component } from '@angular/core';
import { Artifact, Mode, ResultView, TestConfig } from '../../models/testing.models';

@Component({
  selector: 'dv-testing-center',
  templateUrl: './testing-center.component.html',
  styleUrls: ['./testing-center.component.scss']
})
export class TestingCenterComponent {
  config: TestConfig = {
    mode: 'stored',
    artifact: 'Rules',
    version: 'Published',
    inputType: 'production',
    fromTime: this.isoAt(-1),
    toTime: this.isoAt(0),
    adv: {}
  };

  view: ResultView = 'summary';
  results: any;

  onRun(res: any) { this.results = res; }
  onSwitchView(v: ResultView) { this.view = v; }

  private isoAt(daysDelta:number){
    const d = new Date(Date.now()+daysDelta*24*3600*1000);
    const pad = (x:number)=> String(x).padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
