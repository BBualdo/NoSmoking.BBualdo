import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SmokeService } from '../../services/smoke.service';
import { SmokeLog } from '../../models/SmokeLog';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { AsyncPipe, formatDate } from '@angular/common';
import { AddModalComponent } from '../add-modal/add-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [RouterLink, AsyncPipe, AddModalComponent],
})
export class DashboardComponent {
  logsSubject: Subject<SmokeLog[] | null> = new BehaviorSubject<
    SmokeLog[] | null
  >(null);
  logs$ = this.logsSubject.asObservable();
  isOpen = false;

  constructor(private smokeService: SmokeService) {
    this.getSmokeLogs();
  }

  getSmokeLogs() {
    this.smokeService.getLogs().subscribe((logs) => {
      this.logsSubject.next(logs);
    });
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
    this.getSmokeLogs();
  }

  formatDate(dateStr: string, format: string, locale: string): string {
    return formatDate(dateStr, format, locale);
  }

  search(input: string) {
    this.smokeService
      .getLogs()
      .pipe(map((logs) => logs!.filter((log) => log.date.includes(input))))
      .subscribe((filteredLogs) => {
        this.logsSubject.next(filteredLogs);
      });
  }
}
