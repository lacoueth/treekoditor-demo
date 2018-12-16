import { Pipe, PipeTransform } from '@angular/core';

// import { renderTTBlock } from '../../utils/ta2pa';

import { pa2rh } from 'treekoditor';

@Pipe({
  name: 'renderNode'
})
export class RenderNodePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return pa2rh(value);
  }
}
