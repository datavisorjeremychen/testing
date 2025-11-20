export type Mode = 'quick' | 'stored' | 'recompute';
export type ResultView = 'summary' | 'events' | 'clauses' | 'sql';
export type Artifact = 'Rules' | 'Scorecards' | 'Decision Flows';

export interface RuleClauseEval {
  clause: string;
  value?: string | number | boolean;
  passed: boolean;
  details?: string;
}

export interface EventRow {
  eventId: string;
  eventTime: string;   // ISO
  eventType: string;
  merchant?: string;
  amount?: number;
  label?: 'fraud' | 'legit' | 'unknown';
  hit: boolean;        // did the artifact trigger
  action?: string;     // e.g., RULE_ACTION +1, decline, review, etc.
  score?: number;      // for scorecards
  why?: RuleClauseEval[];
}

export interface Metrics {
  total: number;
  detections: number;
  detectionRatio: number; // 0..1
  tp?: number; fp?: number; fn?: number; tn?: number;
  precision?: number; recall?: number; f1?: number;
  captureRate?: number; workloadRate?: number;
}

export interface TestConfig {
  mode: Mode;
  artifact: Artifact;
  version: 'Published' | 'Draft' | 'Select';
  inputType: 'production' | 'manual' | 'dataset';
  fromTime?: string;
  toTime?: string;
  eventIds?: string;
  label?: string;
  eventTypes?: string;
  adv: { merchant?: string; user?: string; minAmt?: number; maxAmt?: number; geo?: string; };
}
