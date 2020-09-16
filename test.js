var isValid = function(s) {
  var rightSymbols = []
  for (var i = 0; i < s.length; i++) {
    if (s[i] == '(') {
      rightSymbols.push(')')
    } else if (s[i] == '{') {
      rightSymbols.push('}')
    } else if (s[i] == '[') {
      rightSymbols.push(']')
    } else if (rightSymbols.pop() != s[i]) {
      return false
    }
    console.log(rightSymbols)
  }
  return !rightSymbols.length
}
console.log(isValid("[]"))