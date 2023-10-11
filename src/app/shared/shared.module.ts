import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassawordTextBoxComponent } from './components/passaword-text-box/passaword-text-box.component';
import { ConfirmDialogueViewComponent } from './components/confirm-dialogue-view/confirm-dialogue-view.component';



@NgModule({
  declarations: [
    PassawordTextBoxComponent,
    ConfirmDialogueViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PassawordTextBoxComponent,
    ConfirmDialogueViewComponent
  ]
})
export class SharedModule { }
