import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { EventRow, Metrics, TestConfig } from '../models/testing.models';

@Injectable({ providedIn: 'root' })
export class TestingService {
  readonly running$ = new BehaviorSubject<boolean>(false);
  readonly progress$ = new BehaviorSubject<number>(0);

  run(config: TestConfig): Observable<{rows: EventRow[]; metrics: Metrics; sql: string;}> {
    this.running$.next(true);
    this.progress$.next(0);

    // fake progress
    const prog = timer(0, 120).pipe(
      tap(i => {
        const v = Math.min(100, i*12);
        this.progress$.next(v);
      }),
      map(i => i>=9)
    );

    return new Observable(sub => {
      const subProg = prog.subscribe(done => {
        if (done) {
          subProg.unsubscribe();
          const res = this.mockResult(config);
          this.running$.next(false);
          this.progress$.next(100);
          sub.next(res);
          sub.complete();
        }
      });
    });
  }

  private mockResult(cfg: TestConfig) {
    const now = new Date();
    const base: EventRow[] = [
      {
        eventId: 'aH_VMFEnQ6q_PZnaXlwwEA',
        eventTime: new Date(now.getTime()-3600_000).toISOString(),
        eventType: cfg.eventTypes || 'token_swap',
        merchant: '172+22049006',
        amount: 850,
        label: 'fraud',
        hit: true,
        action: cfg.artifact==='Scorecards' ? undefined : 'RULE_ACTION +1',
        score: cfg.artifact==='Scorecards' ? 0.93 : undefined,
        why: [
          { clause: 'posCardReadMethod is in CHIP_FALLBACK', passed: true },
          { clause: 'NOT merchantCountry is in USA', passed: true, details: 'merchantCountry=CA' },
          { clause: 'se_ttfm_model_score_v1 >= 0.1', value: 0.67, passed: true },
          { clause: 'visaTrxRiskScore >= 30', value: 44, passed: true },
          { clause: 'amountUSD > 0', value: 850, passed: true },
          { clause: 'organizationId_tenure_d >= 30', value: 75, passed: true }
        ]
      },
      {
        eventId: '5pPgYls8Rn_1FqyF2FDzw',
        eventTime: new Date(now.getTime()-7_200_000).toISOString(),
        eventType: cfg.eventTypes || 'auth',
        amount: 42,
        label: 'legit',
        hit: false,
        action: undefined,
        score: cfg.artifact==='Scorecards' ? 0.08 : undefined,
        why: [
          { clause: 'NOT merchantCountry is in USA', passed: false, details: 'merchantCountry=US' },
          { clause: 'amountUSD > 0', value: 42, passed: true }
        ]
      }
    ];
    const det = base.filter(b => b.hit).length;
    const total = 31;
    const multiplier = cfg.mode==='stored' ? 1 : (cfg.mode==='recompute' ? 1.2 : 1);

    const metrics: Metrics = {
      total,
      detections: Math.round(det*multiplier),
      detectionRatio: (det*multiplier)/total,
      tp: 22, fp: 9, fn: 3, tn: total-22-9-3,
      precision: 22/(22+9), recall: 22/(22+3),
      f1: (2*(22/(22+9))*(22/(22+3)))/((22/(22+9))+(22/(22+3))),
      captureRate: 0.72, workloadRate: 0.12
    };

    const where: string[] = [];
    if (cfg.mode!=='quick') {
      if (cfg.fromTime) where.push(`toDateTime(event_time) >= toDateTime('${cfg.fromTime}')`);
      if (cfg.toTime) where.push(`toDateTime(event_time) < toDateTime('${cfg.toTime}')`);
    }
    if (cfg.eventTypes) where.push(`event_type IN (${cfg.eventTypes.split(',').map(s=>`'${s.trim()}'`).join(', ')})`);
    if (cfg.adv?.minAmt!=null) where.push(`amountUSD >= ${cfg.adv.minAmt}`);
    if (cfg.adv?.maxAmt!=null) where.push(`amountUSD <= ${cfg.adv.maxAmt}`);
    if (cfg.adv?.geo) where.push(`/* geo filter */ merchantCountry ${cfg.adv.geo.includes('NOT')?'NOT IN':'IN'} ('USA')`);
    const sql = `/* ${cfg.mode} */\nSELECT event_id, event_time, event_type, amountUSD, ${
      cfg.artifact==='Scorecards' ? 'score' : 'rule_action'
    } AS action, label AS transaction_label FROM event_result\n${where.length ? 'WHERE ' + where.join(' AND ') : ''}\nLIMIT 1000;`;

    return { rows: base, metrics, sql };
  }
}
