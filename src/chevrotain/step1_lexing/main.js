const lex = require("./lexer").lex;

const real_w_quotes = require("../../input-tests").real_w_text_w_quotes;
let inputText = real_w_quotes;
const lexingResult = lex(inputText);
console.log(JSON.stringify(lexingResult, null, "\t"));
