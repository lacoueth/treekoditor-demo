import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { RenderComponent } from './render/render.component';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './render/blocks/image/image.component';
import { HideShowComponent } from './render/blocks/hide-show/hide-show.component';
import { AnnotationComponent } from './render/blocks/annotation/annotation.component';
import { SafePipe } from './safe.pipe';
import { RenderEditComponent } from './render-edit/render-edit.component';

import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { TextBlockEditComponent } from './render-edit/text-block-edit/text-block-edit.component';
import { RenderInnerHtmlComponent } from './render-inner-html/render-inner-html.component';
import { RenderEditSingleBlockComponent } from './render-edit/render-edit-single-block/render-edit-single-block.component';

@NgModule({
  declarations: [
    AppComponent,
    RenderComponent,
    ImageComponent,
    HideShowComponent,
    AnnotationComponent,
    SafePipe,
    RenderEditComponent,
    TextBlockEditComponent,
    RenderInnerHtmlComponent,
    RenderEditSingleBlockComponent
  ],
  imports: [BrowserModule, CommonModule, TextareaAutosizeModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
