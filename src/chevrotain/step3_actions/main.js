const toAstEmbedded = require("./embed").toAst;

/* const real_w_quotes = require("../../input-tests").real_w_text_w_quotes;
let inputText = real_w_quotes;

let astFromEmbedded = toAstEmbedded(inputText);

console.log(JSON.stringify(astFromEmbedded, null, "  ")); */

export function Parse(input) {
  return toAstEmbedded(input);
}

document.getElementById("area").addEventListener("keyup", res => {
  console.log(res);

  // const toAstEmbedded = require("./embed").toAst;
  const area = document.getElementById("area");
  const print = document.getElementById("print");

  let astFromEmbedded = Parse(area.value);

  print.innerHTML = astFromEmbedded;
});
