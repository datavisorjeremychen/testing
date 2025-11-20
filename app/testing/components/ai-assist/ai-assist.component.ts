import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestConfig } from '../../models/testing.models';

@Component({
  selector: 'dv-ai-assist',
  templateUrl: './ai-assist.component.html',
  styleUrls: ['./ai-assist.component.scss']
})
export class AiAssistComponent {
  @Input() config!: TestConfig;
  @Output() configChange = new EventEmitter<TestConfig>();

  get recommendation(): string {
    if (this.config.mode === 'quick' || (this.config.eventIds||'').trim().length>0) return 'Quick Replay';
    if (this.config.version==='Draft') return 'Recompute Backtest';
    if (this.config.adv?.minAmt || this.config.adv?.maxAmt || this.config.adv?.geo) return 'Recompute Backtest';
    return 'Stored Data (SQL)';
  }
  applyChip(kind: string){
    if (kind==='amount>500') this.config.adv.minAmt = 500;
    if (kind==='NOT USA') this.config.adv.geo = 'NOT USA';
    if (kind==='token_swap') this.config.eventTypes = 'token_swap';
    this.configChange.emit(this.config);
  }
}
