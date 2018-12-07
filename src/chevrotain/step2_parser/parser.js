"use strict";
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step2_parsing.md

// Tutorial Step 2:

// Adding a Parser (grammar only, only reads the input without any actions).
// Using the Token Vocabulary defined in the previous step.

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

// ----------------- parser -----------------
class JsonParser extends Parser {
  // A config object as a constructor argument is normally not needed.
  // Our tutorial scenario requires a dynamic configuration to support step3 without duplicating code.
  constructor(config) {
    super(tokenVocabulary, config);

    // for conciseness
    const $ = this;

    $.RULE("plain", () => {
      $.MANY({
        DEF: () =>
          $.OR([
            {
              ALT: () => {
                $.SUBRULE($.template);
              }
            },
            {
              ALT: () => {
                $.CONSUME(StringLiteral);
              }
            }
          ])
      });
    });

    $.RULE("template", () => {
      // uncomment the debugger statement and open dev tools in chrome/firefox
      // to debug the parsing flow.
      // debugger;
      $.CONSUME(LCurly);

      //let tempName = $.SUBRULE($.value);
      $.CONSUME(SimpleWord);

      $.MANY({
        DEF: () => {
          $.CONSUME(Comma);
          $.SUBRULE($.templateParam);
        }
      });
      $.SUBRULE($.templateContent);
      $.CONSUME(RCurly);
    });

    $.RULE("templateContent", () => {
      $.CONSUME(Comma);
      $.SUBRULE($.plain);
    });

    $.RULE("templateParam", () => {
      $.CONSUME(SimpleWord);
      $.CONSUME(Colon);
      $.SUBRULE($.value);
    });

    $.RULE("value", () =>
      $.OR([
        {
          ALT: () => {
            $.CONSUME(StringLiteral);
          }
        },
        { ALT: () => $.CONSUME(NumberLiteral) },
        { ALT: () => $.SUBRULE($.template) }
      ])
    );

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

// We only ever need one as the parser internal state is reset for each new input.
const parserInstance = new JsonParser();

module.exports = {
  parserInstance: parserInstance,

  JsonParser: JsonParser,

  parse: function(inputText) {
    const lexResult = jsonLexer.lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // No semantic actions so this won't return anything yet.
    parserInstance.plain();

    if (parserInstance.errors.length > 0) {
      throw Error(
        "Sad sad panda, parsing errors detected!\n" +
          parserInstance.errors[0].message
      );
    }
  }
};
