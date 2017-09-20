export default class helperFunctions {
  // var fu = paddy(14, 5); // 00014
  // var bar = paddy(2, 4, '#'); // ###2
  paddy (n, p, c) {
    let padChar = typeof c !== 'undefined' ? c : '0'
    let pad = new Array(1 + p).join(padChar)
    return (pad + n).slice(-pad.length)
  }
}
