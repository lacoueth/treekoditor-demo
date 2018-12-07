(function jsonExample() {
  // ----------------- Lexer -----------------
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;

  // In ES6, custom inheritance implementation
  // (such as the one above) can be replaced
  // with a more simple: "class X extends Y"...
  const LCurly = createToken({ name: 'LCurly', pattern: /{{/ });
  const RCurly = createToken({ name: 'RCurly', pattern: /}}/ });
  const Comma = createToken({ name: 'Comma', pattern: /\|/ });
  const Colon = createToken({ name: 'Colon', pattern: /\=/ });

  function matchInteger(text, startOffset) {
    let endOffset = startOffset;

    if (text.charCodeAt(startOffset) === '{') {
        return null;
    }

    let last = text.charCodeAt(endOffset + 1);
    let next = text.charCodeAt(endOffset + 2) || '}';
    // 0-9 digits
    while (
      !(last === '}' && next === '}') &&
      !(last === '{' && next === '{') &&
      endOffset + 2 < text.length
    ) {
      endOffset++;
      last = text.charCodeAt(endOffset + 1);
      next = text.charCodeAt(endOffset + 2) || '}';
    }

    // No match, must return null to conform with the RegExp.prototype.exec signature
    if (endOffset === startOffset) {
      return null;
    } else {
      let matchedString = text.substring(startOffset, endOffset);
      // according to the RegExp.prototype.exec API the first item in the returned array must be the whole matched string.
      return [matchedString];
    }
  }

  const CustomString = createToken({
    name: 'CustomString',
    pattern: { exec: matchInteger }
  });

  const StringLiteral = createToken({
    name: 'StringLiteral',
    pattern: /"(:?[^\\"]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
  });
  const SimpleWord = createToken({
    name: 'SimpleWord',
    pattern: /\w+/
  });
  const NumberLiteral = createToken({
    name: 'NumberLiteral',
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
  });
  const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: Lexer.SKIPPED
  });

  const jsonTokens = [
    WhiteSpace,
    NumberLiteral,
    StringLiteral,
    SimpleWord,
    CustomString,
    RCurly,
    LCurly,
    Comma,
    Colon
  ];

  const JsonLexer = new Lexer(jsonTokens);

  // Labels only affect error messages and Diagrams.
  /* LCurly.LABEL = "'{{'";
    RCurly.LABEL = "'}}'";
    Comma.LABEL = "'|'";
    Colon.LABEL = "'='"; */

  // ----------------- parser -----------------
  const Parser = chevrotain.Parser;

  class JsonParser extends Parser {
    constructor() {
      super(jsonTokens, { recoveryEnabled: true, outputCst: false });

      const $ = this;

      this.plain = $.RULE('plain', () => {
        let nodes = [];

        $.MANY({
          DEF: () =>
            $.OR([
              {
                ALT: () => {
                  const obj = $.SUBRULE($.template);
                  nodes.push({ type: 'template', value: obj });
                }
              },
              {
                ALT: () => {
                  const stringLiteral = $.CONSUME(CustomString).image;
                  // chop of the quotation marks
                  const str = stringLiteral.substr(0, stringLiteral.length);
                  nodes.push({ type: 'plain', value: str });
                }
              }
            ])
        });

        return nodes;
      });

      this.template = $.RULE('template', () => {
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
            _.assign(obj, $.SUBRULE($.templateParam));
          }
        });

        let content = $.SUBRULE($.templateContent);

        $.CONSUME(RCurly);

        return {
          template: tempName,
          params: obj,
          content: content
        };
      });

      $.RULE('templateContent', () => {
        $.CONSUME(Comma);
        let value = $.SUBRULE($.plain);
        return value;
      });

      $.RULE('templateParam', () => {
        let paramName = $.CONSUME(SimpleWord).image;
        $.CONSUME(Colon);
        let value = $.SUBRULE($.value);

        return {
          [paramName]: value
        };
      });

      this.value = $.RULE('value', () => {
        return $.OR([
          {
            ALT: () => {
              const stringLiteral = $.CONSUME(StringLiteral).image;
              // chop of the quotation marks
              return stringLiteral.substr(1, stringLiteral.length - 2);
            }
          },
          { ALT: () => Number($.CONSUME(NumberLiteral).image) },
          { ALT: () => $.SUBRULE($.template) }
        ]);
      });

      // very important to call this after all the rules have been setup.
      // otherwise the parser may not work correctly as it will lack information
      // derived from the self analysis.
      this.performSelfAnalysis();
    }
  }

  // for the playground to work the returned object must contain these fields
  return {
    lexer: JsonLexer,
    parser: JsonParser,
    defaultRule: 'plain'
  };
})();
