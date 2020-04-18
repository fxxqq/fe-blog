<template>
  <div>
    <p v-html="mdTest">vue demo</p>

  </div>
</template>

<script>
// import readme from "../readme.md";
import mdTest from "../mdtest.md";
console.log(mdTest)
// import img from "./test.png";
// console.log(readme);
export default {
  data () {
    return {
      mdTest
    };
  }
};
</script>

  