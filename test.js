function longestPalindrome(string) {
  const n = string.length
  const dp = []
  //先创建一个二维数组
  for (let i = 0; i < n; i++) {
    dp[i] = []
  }

  let ans = ''
  //l作为字符串的长度
  for (let l = 0; l < n; l++) {
    //注意 i才是起始位置 不能用l来作为起始位置遍历

    for (let i = 0; i + l < n; i++) {
      let j = i + l
      if (l === 0) {
        dp[i][j] = true
      } else if (l === 1) {
        dp[i][j] = string[i] === string[j]
      } else {
        console.log(dp[i + 1][j - 1])
        dp[i][j] = dp[i + 1][j - 1] && string[i] === string[j]
      }
      //每当有回文字符串的时候跟ans比较，得出长度更大的回文串
      // j+1是因为substring的方法

      if (dp[i][j] && string.substring(i, j + 1).length > ans.length) {
        // console.log(string.substring(i, j + 1))
        ans = string.substring(i, j + 1)
      }
    }
  }

  return ans
}
console.log(longestPalindrome('accddsds'))
