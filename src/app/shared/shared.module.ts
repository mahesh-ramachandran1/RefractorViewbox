import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordTextboxComponent } from './components/passaword-text-box/passaword-text-box.component';
import { ConfirmDialogueViewComponent } from './components/confirm-dialogue-view/confirm-dialogue-view.component';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    PasswordTextboxComponent,
    ConfirmDialogueViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    PasswordTextboxComponent,
    ConfirmDialogueViewComponent
  ]
})
export class SharedModule { }
