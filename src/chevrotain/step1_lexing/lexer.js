'use strict';
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step1_lexing.md

// Tutorial Step 1:
// Implementation of A lexer for a simple SELECT statement grammar
const chevrotain = require('chevrotain');
const Lexer = chevrotain.Lexer;
const createToken = chevrotain.createToken;

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

const LCurly = createToken({ name: 'LCurly', pattern: /{{/ });
const RCurly = createToken({ name: 'RCurly', pattern: /}}/ });
const Comma = createToken({ name: 'Comma', pattern: /\|/ });
const Colon = createToken({ name: 'Colon', pattern: /=/ });

const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /"(:?[^"]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
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
  RCurly,
  LCurly,
  Comma,
  Colon
];

const JsonLexer = new Lexer(jsonTokens);

jsonTokens.forEach(tokenType => {
  tokenVocabulary[tokenType.name] = tokenType;
});

module.exports = {
  tokenVocabulary: tokenVocabulary,

  lex: function(inputText) {
    const lexingResult = JsonLexer.tokenize(inputText);

    if (lexingResult.errors.length > 0) {
      throw Error('Sad Sad Panda, lexing errors detected');
    }

    return lexingResult;
  }
};
