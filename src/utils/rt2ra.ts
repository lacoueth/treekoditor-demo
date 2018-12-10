import { parse } from 'node-html-parser';

/**
 * Raw text to raw AST with node-html-parser library
 * @param rawText input string - text source file
 */
export function rt2ra(rawText: string): any {
  return parse(`<doc>${rawText}</doc>`, {
    lowerCaseTagName: false, // convert tag name to lower case (hurt performance heavily)
    script: false, // retrieve content in <script> (hurt performance slightly)
    style: false, // retrieve content in <style> (hurt performance slightly)
    pre: true // retrieve content in <pre> (hurt performance slightly)
  } as any).childNodes[0];
}
