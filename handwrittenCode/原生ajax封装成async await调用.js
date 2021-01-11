const getJson = function (url, type, data) {
  const promise = new Promise(function (resolve, reject) {
    const handler = function () {
      if (this.readyState !== 4) {
        return
      }
      if (this.status == 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    const client = new XMLHttpRequest()
    client.open(type, url)
    client.onreadystatechange = handler
    client.responseType = 'json'
    if (type == 'get') {
      client.send(data)
    } else {
      client.setRequestHeader('Content-Type', 'application/json')
      client.send(JSON.stringify(data))
    }
  })
}
