import * as showdown from 'showdown';
import * as _ from 'lodash';
import katex from 'katex';

showdown.setOption('tables', true);
showdown.setOption('openLinksInNewWindow', true);
showdown.setOption('emoji', true);
showdown.setOption('strikethrough', true);

const converter = new showdown.Converter();

export function youtubeBlock(params) {
  return `<youtube-video id="${params.id}"></youtube-video>`;
}

export function imageBlock(params) {
  return `<single-image url="${params.src}" title="${
    params.title
  }" description="${params.description}"></single-image>`;
}

export function contentBoxBlock(attrs, inner) {
  return `<content-box classes="${attrs.class}"
                         heading="${attrs.title}">
      ${inner}
    </content-box>`;
}

export function hideShowBlock(attrs, inner) {
  return `<hide-show classes="${attrs.class}"
                       heading="${attrs.title}">
      ${inner}
    </hide-show>`;
}

export function textBlock(text) {
  const md = converter.makeHtml(text);

  /* const kat = _.replace(md, /\$\S([^\$\<\>"])*\S\$/g, e => {
    return katex.renderToString(_.trim(e, '$'), {throwOnError: false});
  }); */

  return md;
}

export function parseMaths(input) {
  const display = _.replace(input, /\$\$([^\$\<\>"])+\$\$/g, e => {
    return katex.renderToString(_.trim(e, '$'), {
      throwOnError: false,
      displayMode: true
    });
  });
  return _.replace(display, /\$\S([^\$\<\>"])*\S\$/g, e => {
    return katex.renderToString(_.trim(e, '$'), { throwOnError: false });
  });
}

export function annotationBlock(annotated, annotationContent) {
  return `<annotation-mark annotated="${_.escape(annotated)}"
annotation="${_.escape(JSON.stringify(annotationContent))}">
</annotation-mark>`;
}
