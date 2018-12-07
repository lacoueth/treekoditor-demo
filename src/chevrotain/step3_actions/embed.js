"use strict";
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step3b_adding_actions_embedded.md

// Tutorial Step 3:

// Adding a actions(semantics) embedded in the grammar.
// This is the highest performance approach, but its also verbose and none modular
// Therefore using the CST Visitor is the recommended approach:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/src/step3a_actions_visitor.js

const jsonLexer = require("../step1_lexing/lexer");
const Parser = require("chevrotain").Parser;
const tokenVocabulary = jsonLexer.tokenVocabulary;

// individual imports, prefer ES6 imports if supported in your runtime/transpiler...
const NumberLiteral = tokenVocabulary.NumberLiteral;
const StringLiteral = tokenVocabulary.StringLiteral;
const SimpleWord = tokenVocabulary.SimpleWord;
const RCurly = tokenVocabulary.RCurly;
const LCurly = tokenVocabulary.LCurly;
const Comma = tokenVocabulary.Comma;
const Colon = tokenVocabulary.Colon;

LCurly.LABEL = "'{{'";
RCurly.LABEL = "'}}'";
Comma.LABEL = "'|'";
Colon.LABEL = "'='";

// ----------------- parser -----------------
class JsonParserEmbed extends Parser {
  constructor() {
    super(tokenVocabulary, { recoveryEnabled: true, outputCst: false });

    const $ = this;

    $.RULE("plain", () => {
      let nodes = [];

      $.MANY({
        DEF: () =>
          $.OR([
            {
              ALT: () => {
                const obj = $.SUBRULE($.template);
                nodes.push({ type: "template", value: obj });
              }
            },
            {
              ALT: () => {
                const stringLiteral = $.CONSUME(StringLiteral).image;
                // chop of the quotation marks
                const str = stringLiteral.substr(1, stringLiteral.length - 2);
                nodes.push({ type: "plain", value: str });
              }
            }
          ])
      });

      return nodes;
    });

    $.RULE("template", () => {
      // uncomment the debugger statement and open dev tools in chrome/firefox
      // to debug the parsing flow.
      // debugger;
      const obj = {};

      $.CONSUME(LCurly);

      //let tempName = $.SUBRULE($.value);
      let tempName = $.CONSUME(SimpleWord).image;

      $.MANY({
        DEF: () => {
          $.CONSUME(Comma);
          Object.assign(obj, $.SUBRULE($.templateParam));
        }
      });

      let content = $.SUBRULE($.templateContent);

      $.CONSUME(RCurly);

      return { template: tempName, params: obj, content: content };
    });

    $.RULE("templateContent", () => {
      $.CONSUME(Comma);
      let value = $.SUBRULE($.plain);
      return value;
    });

    $.RULE("templateParam", () => {
      let paramName = $.CONSUME(SimpleWord).image;
      $.CONSUME(Colon);
      let value = $.SUBRULE($.value);
      return { [paramName]: value };
    });

    $.RULE("value", () =>
      $.OR([
        {
          ALT: () => {
            const stringLiteral = $.CONSUME(StringLiteral).image;
            // chop of the quotation marks
            return stringLiteral.substr(1, stringLiteral.length - 2);
          }
        },
        { ALT: () => Number($.CONSUME(NumberLiteral).image) },
        { ALT: () => $.SUBRULE($.template) }
      ])
    );

    // very important to call this after all the rules have been setup.
    // otherwise the parser may not work correctly as it will lack information
    // derived from the self analysis.
    this.performSelfAnalysis();
  }
}

// We only ever need one as the parser internal state is reset for each new input.
const parserInstance = new JsonParserEmbed();

module.exports = {
  toAst: function(inputText) {
    const lexResult = jsonLexer.lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // No semantic actions so this won't return anything yet.
    const ast = parserInstance.plain();

    if (parserInstance.errors.length > 0) {
      throw Error(
        "Sad sad panda, parsing errors detected!\n" +
          parserInstance.errors[0].message
      );
    }

    return ast;
  }
};
