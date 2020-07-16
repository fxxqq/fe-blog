 class Promise {
   constructor(executor) {
     this.status = 'pending' // 默认状态
     this.value // resolve 成功时的值
     this.error // reject 失败时的值
     this.resolveQueue = []; // 成功存放的数组
     this.rejectQueue = []; // 失败存放法数组

     // 定义 resolve
     let resolve = (res) => {
       if (this.status === 'pending') {
         this.value = res
         this.status = 'resolved'
           // 一旦resolve执行，调用成功数组的函数
         this.resolveQueue.forEach(fn => fn());
       }
     }

     // 定义 reject
     let reject = (err) => {
       if (this.status === 'pending') {
         this.error = err
         this.status = 'rejected'
       }
     }

     // 自动执行
     executor(resolve, reject)
   }

   // 声明 then
   then(onFullfilled, onRejected) {
       let promise2;
       if (this.status === 'resolved') {
         onFullfilled(this.value)
       }
       if (this.status === 'rejected') {
         onRejected(this.error)
       }
       // 当状态state为pending时
       if (this.status === "pending") {
         promise2 = new Promise((resolve, reject) => {
           this.resolveQueue.push(() => {
             let x = onFullfilled(this.value);
             resolvePromise(promise2, x, resolve, reject);
           })
           this.rejectQueue.push(() => {
             let x = onRejected(this.error);
             resolvePromise(promise2, x, resolve, reject);
           })
         })
       }
       return promise2;
     },
     catch (onRejected) {
       return this.then(null, onRejected)
     }
 }

 class Promise {
   constructor(executor) {
     this.status = "pending"
     this.value
     this.error
     this.resolveQuene = []
     this.rejectQuene = []
     let resolve = (res) => {
       if (this.status === 'pending') {
         this.value = res
         this.status = 'resolved'
         this.resolveQuene.forEach(fn => fn())
       }
     }
     let reject = (err) => {
       if (this.status === 'pending') {
         this.value = res
         this.status = 'rejected'
       }
     }
     executor(resolve, reject)
   }
   then(onFullfilled, onRejected) {
     let promise2;
     if (this.status == 'resolved') {
       onFullfilled(this.value)
     }
     if (this.status == 'rejected') {
       onRejected(this.error)
     }
     if (this.status == 'pending') {
       promise2 = new Promise((resolve, reject) => {
         this.resolveQuene.push(() => {
           let x = onFullfilled(this.value)
           resolvePromise(promise2, x, resolve, reject);
         })
         this.rejectQueue.push(() => {
           let x = onRejected(this.error);
           resolvePromise(promise2, x, resolve, reject);
         })
       })
     }
   }
 }