class RequestLimit {
  constructor(limit) {
    // 定义一个自己的并发请求控制类在实例化时设置 limit
    this.limit = Number(limit) || 2
    this.blockQueue = []
    this.currentReqNumber = 0
  }

  /**
   * 请求
   * @param {*} req
   */
  async request(req) {
    // 为这个这个并发请求控制类实现一个 request 方法
    if (!req) {
      throw new Error('req is required.')
    }
    if (Object.prototype.toString.call(req) !== '[object Function]') {
      throw new Error('Req must be a function.')
    }
    if (this.currentReqNumber >= this.limit) {
      // 在 request 里判断如果当前请求数大于设置的 limit 程序进入阻塞状态
      await new Promise((resolve) => this.blockQueue.push(resolve)) // 阻塞队列增加一个 Pending 状态的 Promise
    }

    return this._handlerReq(req) // 在 request 请求里如果当前请求数小于设置的 limit，处理传入的请求
  }

  /**
   * 内部方法处理请求
   * @param {*} req
   */
  async _handlerReq(req) {
    this.currentReqNumber++ // 在处理传入的请求开始时要对当前请求数做加 1 操作
    try {
      return await req()
    } catch (err) {
      return Promise.reject(err)
    } finally {
      this.currentReqNumber--
      if (this.blockQueue.length) {
        // 每完成一个就从阻塞队列里剔除一个
        this.blockQueue[0]() // 将最先进入阻塞队列的 Promise 从 Pending 变为 Fulfilled
        this.blockQueue.shift()
      }
    }
  }
}
