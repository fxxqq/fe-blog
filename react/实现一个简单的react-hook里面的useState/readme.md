```js
const myStates = []
let stateCalls = -1
function useMyState(defaultValue) {
  stateCalls += 1
  const stateId = stateCalls
  if (myStates[stateId]) {
    return myStates[stateId]
  }
  const setMyValue = (value) => {
    myStates[stateId][0] = value
    renderWithMyHook()
  }
  const tuple = [defaultValue, setMyValue]
  myStates[stateId] = tuple
  return tuple
}
```

```js
var subsets = function (nums) {
  const ans = []
  const n = nums.length
  for (let mask = 0; mask < 1 << n; ++mask) {
    const t = []
    for (let i = 0; i < n; ++i) {
      if (mask & (1 << i)) {
        t.push(nums[i])
      }
    }
    ans.push(t)
  }
  return ans
}
```
