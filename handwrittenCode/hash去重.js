//hash去重
function Deduplication(arr) {
  var result = [];
  var hashMap = {};
  for (var i = 0; i < arr.length; i++) {
    var temp = arr[i]
    if (!hashMap[temp]) {
      hashMap[temp] = true
      result.push(temp)
    }
  }
  return result;
}