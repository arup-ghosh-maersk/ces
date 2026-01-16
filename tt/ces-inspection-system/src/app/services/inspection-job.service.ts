import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InspectionJob, InspectionResult, IssueNCR, IssuePunchList, IssueDefect } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InspectionJobService {
  private jobs: InspectionJob[] = [];
  private jobsSubject = new BehaviorSubject<InspectionJob[]>([]);
  public jobs$ = this.jobsSubject.asObservable();

  private results: InspectionResult[] = [];
  private resultsSubject = new BehaviorSubject<InspectionResult[]>([]);
  public results$ = this.resultsSubject.asObservable();

  private ncrs: IssueNCR[] = [];
  private ncrsSubject = new BehaviorSubject<IssueNCR[]>([]);
  public ncrs$ = this.ncrsSubject.asObservable();

  private punchLists: IssuePunchList[] = [];
  private punchListsSubject = new BehaviorSubject<IssuePunchList[]>([]);
  public punchLists$ = this.punchListsSubject.asObservable();

  private defects: IssueDefect[] = [];
  private defectsSubject = new BehaviorSubject<IssueDefect[]>([]);
  public defects$ = this.defectsSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.jobs = [
      {
        jobId: 'job-001',
        assetId: 'ast-001',
        templateId: 'tpl-001',
        jobType: 'Routine',
        inspectorId: 'usr-001',
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-01-12'),
        status: 'Completed',
        notes: 'Routine annual inspection completed'
      }
    ];

    this.results = [
      {
        resultId: 'res-001',
        jobId: 'job-001',
        taskId: 'tsk-001',
        controlId: 'cp-001',
        result: 'Pass',
        observedValue: '6.5mm',
        expectedValue: '>5mm',
        inspectionDate: new Date('2024-01-10'),
        inspectorId: 'usr-001'
      }
    ];

    this.ncrs = [
      {
        issueId: 'ncr-001',
        jobId: 'job-001',
        resultId: 'res-001',
        issueType: 'NCR',
        title: 'Non-conformance in chain tension',
        description: 'Chain tension found to be below specification',
        severity: 'High',
        status: 'Open',
        createdBy: 'usr-001',
        createdAt: new Date('2024-01-11')
      }
    ];

    this.punchLists = [];
    this.defects = [];

    this.jobsSubject.next(this.jobs);
    this.resultsSubject.next(this.results);
    this.ncrsSubject.next(this.ncrs);
    this.punchListsSubject.next(this.punchLists);
    this.defectsSubject.next(this.defects);
  }

  // Job Methods
  getJobs(): Observable<InspectionJob[]> {
    return this.jobs$;
  }

  getJobById(id: string): InspectionJob | undefined {
    return this.jobs.find(j => j.jobId === id);
  }

  addJob(job: InspectionJob): void {
    this.jobs.push(job);
    this.jobsSubject.next([...this.jobs]);
  }

  updateJob(job: InspectionJob): void {
    const index = this.jobs.findIndex(j => j.jobId === job.jobId);
    if (index !== -1) {
      this.jobs[index] = job;
      this.jobsSubject.next([...this.jobs]);
    }
  }

  deleteJob(id: string): void {
    this.jobs = this.jobs.filter(j => j.jobId !== id);
    this.jobsSubject.next([...this.jobs]);
  }

  // Result Methods
  getResults(): Observable<InspectionResult[]> {
    return this.results$;
  }

  getResultsByJob(jobId: string): InspectionResult[] {
    return this.results.filter(r => r.jobId === jobId);
  }

  getResultById(id: string): InspectionResult | undefined {
    return this.results.find(r => r.resultId === id);
  }

  addResult(result: InspectionResult): void {
    this.results.push(result);
    this.resultsSubject.next([...this.results]);
  }

  updateResult(result: InspectionResult): void {
    const index = this.results.findIndex(r => r.resultId === result.resultId);
    if (index !== -1) {
      this.results[index] = result;
      this.resultsSubject.next([...this.results]);
    }
  }

  deleteResult(id: string): void {
    this.results = this.results.filter(r => r.resultId !== id);
    this.resultsSubject.next([...this.results]);
  }

  // NCR Methods
  getNCRs(): Observable<IssueNCR[]> {
    return this.ncrs$;
  }

  getNCRsByJob(jobId: string): IssueNCR[] {
    return this.ncrs.filter(ncr => ncr.jobId === jobId);
  }

  getNCRById(id: string): IssueNCR | undefined {
    return this.ncrs.find(ncr => ncr.issueId === id);
  }

  addNCR(ncr: IssueNCR): void {
    this.ncrs.push(ncr);
    this.ncrsSubject.next([...this.ncrs]);
  }

  updateNCR(ncr: IssueNCR): void {
    const index = this.ncrs.findIndex(n => n.issueId === ncr.issueId);
    if (index !== -1) {
      this.ncrs[index] = ncr;
      this.ncrsSubject.next([...this.ncrs]);
    }
  }

  deleteNCR(id: string): void {
    this.ncrs = this.ncrs.filter(ncr => ncr.issueId !== id);
    this.ncrsSubject.next([...this.ncrs]);
  }

  // Punch List Methods
  getPunchLists(): Observable<IssuePunchList[]> {
    return this.punchLists$;
  }

  getPunchListsByJob(jobId: string): IssuePunchList[] {
    return this.punchLists.filter(pl => pl.jobId === jobId);
  }

  addPunchListItem(item: IssuePunchList): void {
    this.punchLists.push(item);
    this.punchListsSubject.next([...this.punchLists]);
  }

  updatePunchListItem(item: IssuePunchList): void {
    const index = this.punchLists.findIndex(pl => pl.issueId === item.issueId);
    if (index !== -1) {
      this.punchLists[index] = item;
      this.punchListsSubject.next([...this.punchLists]);
    }
  }

  deletePunchListItem(id: string): void {
    this.punchLists = this.punchLists.filter(pl => pl.issueId !== id);
    this.punchListsSubject.next([...this.punchLists]);
  }

  // Defect Methods
  getDefects(): Observable<IssueDefect[]> {
    return this.defects$;
  }

  getDefectsByAsset(assetId: string): IssueDefect[] {
    return this.defects.filter(d => d.assetId === assetId);
  }

  addDefect(defect: IssueDefect): void {
    this.defects.push(defect);
    this.defectsSubject.next([...this.defects]);
  }

  updateDefect(defect: IssueDefect): void {
    const index = this.defects.findIndex(d => d.issueId === defect.issueId);
    if (index !== -1) {
      this.defects[index] = defect;
      this.defectsSubject.next([...this.defects]);
    }
  }

  deleteDefect(id: string): void {
    this.defects = this.defects.filter(d => d.issueId !== id);
    this.defectsSubject.next([...this.defects]);
  }
}
