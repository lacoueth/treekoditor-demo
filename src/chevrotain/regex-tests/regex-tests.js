(function grammarTest() {
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;

  const ParamKey = createToken({
    name: 'ParamKey',
    pattern: /[a-z]+[a-zA-Z0-9]+/
  });

  const TagName = createToken({
    name: 'TagName',
    pattern: /[A-Z]+[a-zA-Z0-9]+/
  });

  const BackTicsOpen = createToken({
    name: 'BackTicsOpen',
    pattern: /`{3}[a-z]+\n/
  });

  const BackTicsClose = createToken({
    name: 'BackTicsClose',
    pattern: /\n\`\`\`\n/
  });

  const PreTagOpen = createToken({
    name: 'PreTagOpen',
    pattern: /\<pre\>/
  });

  const PreTagClose = createToken({
    name: 'PreTagClose',
    pattern: /\<\/pre\>/
  });

  const JsonNumberValue = createToken({
    name: 'JsonNumberValue',
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
  });

  const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: Lexer.SKIPPED
  });

  const JsonStringValue = createToken({
    name: 'JsonStringValue',
    pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
  });

  const TAG_OPEN = createToken({ name: 'TAG_OPEN', pattern: /\</ });
  const TAG_OPEN_SLASH = createToken({
    name: 'TAG_OPEN_SLASH',
    pattern: /\<\//
  });
  const TAG_CLOSE = createToken({ name: 'TAG_CLOSE', pattern: /\>/ });
  const TAG_SLASH = createToken({ name: 'TAG_SLASH', pattern: /\// });
  const TAG_EQUALS = createToken({ name: 'TAG_EQUALS', pattern: /=/ });
  const TAG_SLASH_CLOSE = createToken({
    name: 'TAG_SLASH_CLOSE',
    pattern: /\/\>/
  });

  const tokens = [
    BackTicsOpen,
    BackTicsClose,

    WhiteSpace,
    JsonNumberValue,
    JsonStringValue,

    ParamKey,
    TagName,

    PreTagOpen,
    PreTagClose,

    TAG_OPEN_SLASH,
    TAG_OPEN,
    TAG_CLOSE,
    TAG_EQUALS,
    TAG_SLASH_CLOSE,
    TAG_SLASH
  ];

  const lexerTest = new Lexer(tokens);

  const Parser = chevrotain.Parser;

  class TestParser extends Parser {
    constructor() {
      super(tokens, { recoveryEnabled: true, outputCst: false });

      const $ = this;

      $.RULE('content', () => {
        const content = [];

        $.MANY({
          DEF: () => {
            $.OR([
              {
                ALT: () => {
                  content.push($.SUBRULE($.escape));
                }
              },
              {
                ALT: () => {
                  content.push($.SUBRULE($.htmlBlock));
                }
              },
              {
                ALT: () => {
                  const text = $.CONSUME(JsonStringValue).image;
                  content.push({ type: 'text', text: text });
                }
              }
            ]);
          }
        });

        return content;
      });

      $.RULE('htmlBlock', () => {
        const openTag = $.SUBRULE($.htmlOpenTag);
        const content = $.SUBRULE($.content);
        const closeTag = $.SUBRULE($.htmlCloseTag);

        return {
          type: openTag.tagName,
          params: openTag.params,
          err: openTag === closeTag,
          content
        };
      });

      $.RULE('htmlOpenTag', () => {
        $.CONSUME(TAG_OPEN);

        const tagName = $.CONSUME(TagName).image;

        const params = {};
        $.MANY({
          SEP: WhiteSpace,
          DEF: () => {
            Object.assign(params, $.SUBRULE($.htmlAttribute));
          }
        });

        $.CONSUME(TAG_CLOSE);

        return { tagName, params };
      });

      $.RULE('htmlCloseTag', () => {
        $.CONSUME(TAG_OPEN_SLASH);
        const tagName = $.CONSUME(TagName).image;
        $.CONSUME(TAG_CLOSE);

        return { tagName };
      });

      $.RULE('htmlAttribute', () => {
        const paramKey = $.CONSUME(ParamKey).image;
        $.CONSUME(TAG_EQUALS);
        const paramValue = $.CONSUME(JsonStringValue).image;

        return { [paramKey]: paramValue };
      });

      $.RULE('escape', () => {
        $.CONSUME(BackTicsOpen);
        const inner = $.SUBRULE($.content);
        $.CONSUME(BackTicsClose);

        return { type: 'Code', inner };
      });

      this.performSelfAnalysis();
    }
  }

  return {
    lexer: lexerTest,
    parser: TestParser,
    defaultRule: 'content'
  };
})();
