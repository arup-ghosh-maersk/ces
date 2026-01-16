import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InspectionJobService } from '../../services/inspection-job.service';
import { ITPTemplateService } from '../../services/itp-template.service';
import { InspectionJob, IssueNCR, IssuePunchList, IssueDefect, InspectionResult, ITPTemplate, InspectionTask } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inspection-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="jobs-container">
      <div class="jobs-section">
        <h3>Inspection Jobs</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Job Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Inspector</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let job of jobs$ | async" 
                (click)="selectJob(job)"
                [class.selected]="selectedJobId === job.jobId"
                class="clickable">
              <td><strong>{{ job.jobId }}</strong></td>
              <td>{{ job.jobType }}</td>
              <td>{{ job.startDate | date:'short' }}</td>
              <td>{{ job.endDate | date:'short' }}</td>
              <td>
                <span [ngClass]="'badge badge-' + job.status.toLowerCase()">
                  {{ job.status }}
                </span>
              </td>
              <td>{{ job.inspectorId }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="job-details-section" *ngIf="selectedJobId">
        <div class="details-header">
          <h3>Job Details & Inspection Results</h3>
          <p class="info-text">Job: <strong>{{ selectedJobId }}</strong></p>
        </div>

        <div class="template-info" *ngIf="selectedTemplate">
          <h4>Linked Template</h4>
          <div class="info-card">
            <div class="info-row">
              <span class="label">Template Code:</span>
              <span class="value">{{ selectedTemplate.templateCode }}</span>
            </div>
            <div class="info-row">
              <span class="label">Title:</span>
              <span class="value">{{ selectedTemplate.title }}</span>
            </div>
            <div class="info-row">
              <span class="label">Asset Type:</span>
              <span class="value">{{ selectedTemplate.applicableAssetType }}</span>
            </div>
            <div class="info-row">
              <span class="label">Standard Reference:</span>
              <span class="value">{{ selectedTemplate.standardReference }}</span>
            </div>
          </div>
        </div>

        <div class="results-section" *ngIf="selectedJobId">
          <div class="results-header">
            <h4>Inspection Results</h4>
            <button class="btn btn-add" (click)="addNewResult()">+ Add Result</button>
          </div>
          
          <div class="results-container" *ngIf="jobResults && jobResults.length > 0">
            <div *ngFor="let result of jobResults; let i = index" class="result-card">
              <div class="card-header">
                <span class="result-id">{{ result.resultId }}</span>
                <span [ngClass]="'result-status badge-' + result.result.toLowerCase()">{{ result.result }}</span>
              </div>
              
              <div class="card-body">
                <div class="form-group">
                  <label>Task Description</label>
                  <select [(ngModel)]="result.taskId" (change)="onTaskChange(result, i)" name="taskId-{{ i }}" class="form-control">
                    <option value="">Select Task</option>
                    <option *ngFor="let task of getTasks()" [value]="task.taskId">{{ task.taskDescription }}</option>
                  </select>
                </div>

                <div class="form-row">
                  <div class="form-group col">
                    <label>Component Category</label>
                    <input type="text" [value]="getTaskCategory(result.taskId)" readonly class="form-control form-control-readonly">
                  </div>
                  <div class="form-group col">
                    <label>Inspection Method</label>
                    <input type="text" [value]="getTaskMethod(result.taskId)" readonly class="form-control form-control-readonly">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col">
                    <label>Result</label>
                    <select [(ngModel)]="result.result" name="result-{{ i }}" class="form-control">
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                  <div class="form-group col">
                    <label>Inspection Date</label>
                    <input type="date" [(ngModel)]="result.inspectionDate" name="date-{{ i }}" class="form-control">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col">
                    <label>Observed Value</label>
                    <input type="text" [(ngModel)]="result.observedValue" name="observed-{{ i }}" class="form-control" placeholder="e.g. 6.5mm">
                  </div>
                  <div class="form-group col">
                    <label>Expected Value (from Task Threshold)</label>
                    <input type="text" [value]="getTaskThreshold(result.taskId)" readonly class="form-control form-control-readonly">
                  </div>
                </div>

                <div class="form-group">
                  <label>Notes</label>
                  <textarea [(ngModel)]="result.inspectorNotes" name="notes-{{ i }}" class="form-control" rows="3" placeholder="Inspector notes..."></textarea>
                </div>

                <div class="card-actions">
                  <button class="btn btn-save" (click)="saveResult(result)">Save Result</button>
                  <button class="btn btn-delete" (click)="deleteResult(result.resultId, i)">Delete</button>
                </div>
              </div>
            </div>
          </div>

          <div class="no-results" *ngIf="!jobResults || jobResults.length === 0">
            <p>No inspection results found for this job</p>
            <button class="btn btn-add" (click)="addNewResult()">+ Add First Result</button>
          </div>
        </div>
      </div>

      <div class="issues-section">
        <h3>Non-Conformance Reports (NCR)</h3>
        <table class="table" *ngIf="(ncrs$ | async)?.length; else noNCRs">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ncr of ncrs$ | async">
              <td><strong>{{ ncr.issueId }}</strong></td>
              <td>{{ ncr.title }}</td>
              <td>
                <span [ngClass]="'badge badge-' + ncr.severity.toLowerCase()">
                  {{ ncr.severity }}
                </span>
              </td>
              <td>
                <span [ngClass]="'badge badge-' + ncr.status.toLowerCase()">
                  {{ ncr.status }}
                </span>
              </td>
              <td>{{ ncr.createdBy }}</td>
              <td>{{ ncr.createdAt | date:'short' }}</td>
            </tr>
          </tbody>
        </table>
        <ng-template #noNCRs>
          <p>No Non-Conformance Reports found</p>
        </ng-template>
      </div>

      <div class="defects-section">
        <h3>Defects</h3>
        <table class="table" *ngIf="(defects$ | async)?.length; else noDefects">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Title</th>
              <th>Defect Type</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let defect of defects$ | async">
              <td><strong>{{ defect.issueId }}</strong></td>
              <td>{{ defect.title }}</td>
              <td>{{ defect.defectType }}</td>
              <td>
                <span [ngClass]="'badge badge-' + defect.severity.toLowerCase()">
                  {{ defect.severity }}
                </span>
              </td>
              <td>
                <span [ngClass]="'badge badge-' + defect.status.toLowerCase()">
                  {{ defect.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noDefects>
          <p>No Defects found</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .jobs-container {
      padding: 20px;
      max-width: 1600px;
      margin: 0 auto;
    }
    h2 {
      color: #333;
      margin-bottom: 20px;
      border-bottom: 3px solid #7b1fa2;
      padding-bottom: 10px;
    }
    h3 {
      color: #666;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    h4 {
      color: #7b1fa2;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .table thead {
      background-color: #f5f5f5;
    }
    .table th,
    .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .table tr:hover {
      background-color: #f9f9f9;
    }
    .table tr.clickable {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    .table tr.selected {
      background-color: #c8e6c9;
      font-weight: bold;
    }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .badge-draft {
      background-color: #e0e0e0;
      color: #424242;
    }
    .badge-in {
      background-color: #fff3cd;
      color: #856404;
    }
    .badge-completed {
      background-color: #d4edda;
      color: #155724;
    }
    .badge-on {
      background-color: #f8d7da;
      color: #721c24;
    }
    .badge-pass {
      background-color: #d4edda;
      color: #155724;
    }
    .badge-fail {
      background-color: #f8d7da;
      color: #721c24;
    }
    .badge-na {
      background-color: #e2e3e5;
      color: #383d41;
    }
    .badge-critical {
      background-color: #f5222d;
      color: white;
    }
    .badge-high {
      background-color: #faad14;
      color: white;
    }
    .badge-medium {
      background-color: #1890ff;
      color: white;
    }
    .badge-low {
      background-color: #52c41a;
      color: white;
    }
    .badge-open {
      background-color: #ff7a45;
      color: white;
    }
    .badge-resolved {
      background-color: #52c41a;
      color: white;
    }
    .badge-closed {
      background-color: #1890ff;
      color: white;
    }

    .job-details-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
    }

    .details-header {
      border-bottom: 2px solid #7b1fa2;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }

    .details-header h3 {
      margin-top: 0;
      color: #7b1fa2;
    }

    .info-text {
      color: #666;
      font-size: 14px;
      margin: 8px 0 0 0;
    }

    .template-info {
      margin-bottom: 30px;
    }

    .info-card {
      background: #f9f9f9;
      border-left: 4px solid #1976d2;
      padding: 15px;
      border-radius: 4px;
    }

    .info-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row .label {
      font-weight: bold;
      color: #555;
      min-width: 150px;
      flex-shrink: 0;
    }

    .info-row .value {
      color: #333;
    }

    .results-section {
      margin-top: 20px;
      background: white;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #ddd;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      border-bottom: 2px solid #7b1fa2;
      padding-bottom: 10px;
    }

    .results-header h4 {
      margin: 0;
      color: #7b1fa2;
    }

    .results-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .results-table thead {
      background-color: #f5f5f5;
    }

    .results-table th,
    .results-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      font-size: 13px;
    }

    .results-table tr:hover {
      background-color: #f9f9f9;
    }

    .result-row {
      display: table-row;
    }

    .result-id {
      font-weight: bold;
      color: #333;
      white-space: nowrap;
    }

    .form-control {
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      width: 100%;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #7b1fa2;
      box-shadow: 0 0 0 3px rgba(123, 31, 162, 0.1);
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: bold;
      transition: background-color 0.3s ease;
      white-space: nowrap;
    }

    .btn-add {
      background-color: #4caf50;
      color: white;
    }

    .btn-add:hover {
      background-color: #45a049;
    }

    .btn-save {
      background-color: #1976d2;
      color: white;
      flex: 1;
    }

    .btn-save:hover {
      background-color: #1565c0;
    }

    .btn-delete {
      background-color: #f44336;
      color: white;
      flex: 1;
    }

    .btn-delete:hover {
      background-color: #da190b;
    }

    .no-results {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 4px;
      text-align: center;
      color: #999;
      font-style: italic;
    }

    .no-results p {
      margin: 0 0 15px 0;
    }

    .no-results .btn {
      display: inline-block;
    }

    p {
      color: #999;
      font-style: italic;
    }
  `]
})
export class InspectionJobsComponent implements OnInit {
  jobs$: Observable<InspectionJob[]>;
  ncrs$: Observable<IssueNCR[]>;
  punchLists$: Observable<IssuePunchList[]>;
  defects$: Observable<IssueDefect[]>;

  selectedJobId: string | null = null;
  selectedTemplate: ITPTemplate | null = null;
  jobResults: InspectionResult[] = [];
  private allTemplates: ITPTemplate[] = [];
  private allTasks: InspectionTask[] = [];

  constructor(
    private jobService: InspectionJobService,
    private itpService: ITPTemplateService
  ) {
    this.jobs$ = this.jobService.getJobs();
    this.ncrs$ = this.jobService.getNCRs();
    this.punchLists$ = this.jobService.getPunchLists();
    this.defects$ = this.jobService.getDefects();
  }

  ngOnInit(): void {
    // Cache templates and tasks
    this.itpService.getTemplates().subscribe(templates => {
      this.allTemplates = templates;
    });
    this.itpService.getTasks().subscribe(tasks => {
      this.allTasks = tasks;
    });
  }

  selectJob(job: InspectionJob): void {
    this.selectedJobId = job.jobId;
    
    // Get linked template
    this.selectedTemplate = this.allTemplates.find(t => t.templateId === job.templateId) || null;
    
    // Get inspection results for this job
    this.jobResults = [...this.jobService.getResultsByJob(job.jobId)];
  }

  getTaskDescription(taskId: string): string {
    const task = this.allTasks.find(t => t.taskId === taskId);
    return task ? task.taskDescription : 'Unknown Task';
  }

  getTasks(): InspectionTask[] {
    return this.allTasks;
  }

  getTaskCategory(taskId: string): string {
    const task = this.allTasks.find(t => t.taskId === taskId);
    return task ? task.componentCategory : '-';
  }

  getTaskMethod(taskId: string): string {
    const task = this.allTasks.find(t => t.taskId === taskId);
    return task ? task.inspectionMethod : '-';
  }

  getTaskThreshold(taskId: string): string {
    const task = this.allTasks.find(t => t.taskId === taskId);
    return task && task.taskThreshold ? task.taskThreshold : '-';
  }

  onTaskChange(result: InspectionResult, index: number): void {
    // Auto-populate expected value from task threshold
    const task = this.allTasks.find(t => t.taskId === result.taskId);
    if (task && task.taskThreshold) {
      result.expectedValue = task.taskThreshold;
    }
  }

  addNewResult(): void {
    if (!this.selectedJobId) return;

    const newResult: InspectionResult = {
      resultId: 'res-' + Date.now(),
      jobId: this.selectedJobId,
      taskId: this.allTasks.length > 0 ? this.allTasks[0].taskId : '',
      result: 'Pass',
      observedValue: '',
      expectedValue: this.allTasks.length > 0 && this.allTasks[0].taskThreshold ? this.allTasks[0].taskThreshold : '',
      inspectionDate: new Date(),
      inspectorId: 'usr-001'
    };

    this.jobResults.push(newResult);
  }

  saveResult(result: InspectionResult): void {
    if (result.resultId.startsWith('res-')) {
      // New result - add it
      this.jobService.addResult(result);
    } else {
      // Existing result - update it
      this.jobService.updateResult(result);
    }
    alert('Inspection result saved successfully!');
  }

  deleteResult(resultId: string, index: number): void {
    if (confirm('Are you sure you want to delete this inspection result?')) {
      this.jobService.deleteResult(resultId);
      this.jobResults.splice(index, 1);
      alert('Inspection result deleted!');
    }
  }
}
