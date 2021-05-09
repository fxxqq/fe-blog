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
