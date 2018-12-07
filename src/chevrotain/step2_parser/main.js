const parse = require("./parser").parse;

const real_w_quotes = require("../../input-tests").real_w_text_w_quotes;
let inputText = real_w_quotes;
parse(inputText);
