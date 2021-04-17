// 输入：[ ['a', 'b'], ['苹果', '梨', '香蕉'], ['红', '黑'] ];
// 输出：
// ['a-苹果-红', 'a-苹果-黑', 'a-梨-红', 'a-梨-黑', 'a-香蕉-红', 'a-香蕉-黑',
// 'b-苹果-红', 'b-苹果-黑', 'b-梨-红', 'b-梨-黑', 'b-香蕉-红', 'b-香蕉-黑' ];


// 思路： 数组两两拼接，组成一个新的数组，再和下一个数组拼接


let list=[ ['a', 'b'], ['苹果', '梨', '香蕉'], ['红', '黑'] ]
let arrMerge=()=>{
  let result=[]
  if(list.length>1){
     let res=[]
     for(let m=0;m<list[0].length;m++){
       for(let n=0;n<list[1].length;n++){
         res.push(`${list[0][m]}-${list[1][n]}`)
       }
     }
    list=list.slice(1)
    list[0]=res
    if(list.length>1){
      twoArrMerge(list)
    }
    result=res
  } else{
    result=list
  }
  return list
}
console.log(arrMerge(list))
