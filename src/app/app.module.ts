import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';
import { RenderEditComponent } from './render-edit/render-edit.component';

import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { TextBlockEditComponent } from './render-edit/text-block-edit/text-block-edit.component';
import { RenderInnerHtmlComponent } from './render-inner-html/render-inner-html.component';
import { RenderEditSingleBlockComponent } from './render-edit/render-edit-single-block/render-edit-single-block.component';
import { RenderNodePipe } from './pipes/render-node.pipe';
import { DiffsPrinterComponent } from './diffs-printer/diffs-printer.component';
import { DevelopmentComponent } from './development/development.component';
import { DemoComponent } from './demo/demo.component';

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    RenderEditComponent,
    TextBlockEditComponent,
    RenderInnerHtmlComponent,
    RenderEditSingleBlockComponent,
    RenderNodePipe,
    DiffsPrinterComponent,
    DevelopmentComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    TextareaAutosizeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: DemoComponent },
      { path: 'dev', component: DevelopmentComponent },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
