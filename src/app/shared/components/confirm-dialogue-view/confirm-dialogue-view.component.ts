import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-confirm-dialogue-view',
  templateUrl: './confirm-dialogue-view.component.html',
  styleUrls: ['./confirm-dialogue-view.component.css']
})
export class ConfirmDialogueViewComponent implements OnInit {

  modalTimer = 0;
  timeoutApi: any;
  copyTimeout: any;
  modelClose = false;
  modalLoading = false;
  modalLoadingText = 'Processing';
  minutesLabel = 0;
  secondsLabel = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const arrayApi: { request: any; completed: boolean; }[] = [];
    let status = false;

    const copyTimeout = setTimeout(() => {
      if (arrayApi.length === 0) {
        clearTimeout(this.timeoutApi);
        clearTimeout(this.copyTimeout);
      }
    }, 2000);

    const id = setInterval(() => {
      const stillPending = arrayApi.filter(api => !api.completed);
      if (stillPending.length === 0) {
        clearInterval(id);
        clearTimeout(this.timeoutApi);
        clearTimeout(copyTimeout);
        this.modelClose = false;
        document.documentElement.style.cursor = 'auto';
        document.body.style.cursor = 'auto';
        document.body.style.pointerEvents = 'auto';
        const processingModal = document.querySelector('.Processing-modal');
        if (processingModal) {
          processingModal.classList.remove('Processing-modal');
        }
      }
    }, 1000);

    this.timeoutApi = setTimeout(() => {
      const stillPending = arrayApi.filter(api => !api.completed);
      if (stillPending.length > 0) {
        stillPending.forEach(api => {
          const request = this.http.request(api.request.method, api.request.url, api.request);
          request.pipe(finalize(() => api.completed = true)).subscribe();
        });

        document.documentElement.style.cursor = 'wait';
        document.body.style.pointerEvents = 'none';
        this.modelClose = true;
        this.modalLoading = true;
        this.modalLoadingText = 'Processing';
        const confirmDialogGlobal = document.getElementById('confirmDialogGlobal');
        if (confirmDialogGlobal) {
          confirmDialogGlobal.classList.add('Processing-modal');
          confirmDialogGlobal.classList.add('show');
        }

        let totalSeconds = 0;
        this.minutesLabel = 0;
        this.secondsLabel = 0;

        setInterval(() => {
          totalSeconds++;
          this.secondsLabel =+ this.pad(totalSeconds % 60);
          this.minutesLabel =+ this.pad(Math.floor(totalSeconds / 60));
        }, 1000);
      }
    }, 20000);

  //   this.http.interceptors.push({
  //     intercept: (req, next) => {
  //       const api = { request: req, completed: false };
  //       arrayApi.push(api);
  //       return next.handle(req).pipe(finalize(() => api.completed = true));
  //     }
  //   });
   }

  pad(val: number): string {
    let valString = val.toString();
    if (valString.length < 2) {
      valString = '0' + valString;
    }
    return valString;
  }
}