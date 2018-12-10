import { Pipe, PipeTransform } from '@angular/core';

import { renderTTBlock } from '../../utils/ta2pa';

@Pipe({
  name: 'renderNode'
})
export class RenderNodePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return renderTTBlock(value);
  }
}
