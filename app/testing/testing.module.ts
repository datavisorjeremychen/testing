import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TestingRoutingModule } from './testing-routing.module';

import { TestingCenterComponent } from './components/testing-center/testing-center.component';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { ResultsPanelComponent } from './components/results-panel/results-panel.component';
import { SummaryCardsComponent } from './components/summary-cards/summary-cards.component';
import { EventsTableComponent } from './components/events-table/events-table.component';
import { ClausesViewComponent } from './components/clauses-view/clauses-view.component';
import { SqlViewComponent } from './components/sql-view/sql-view.component';
import { AiAssistComponent } from './components/ai-assist/ai-assist.component';

@NgModule({
  declarations: [
    TestingCenterComponent,
    ConfigPanelComponent,
    ResultsPanelComponent,
    SummaryCardsComponent,
    EventsTableComponent,
    ClausesViewComponent,
    SqlViewComponent,
    AiAssistComponent
  ],
  imports: [CommonModule, FormsModule, TestingRoutingModule]
})
export class TestingModule {}
