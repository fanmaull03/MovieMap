import { Component } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage {
  segment: string = 'friends';

  constructor() {}

  segmentChanged(event: any) {
    this.segment = event.detail.value;
  }

  // Tambahkan metode untuk mengambil data aktivitas sesuai segmen
}
