<template>
  <div>
    <p v-html="mdTest">vue demo</p>

  </div>
</template>

<script>
import mdTest from "./mdtest.md";
console.log(mdTest)

export default {
  data () {
    return {
      mdTest
    };
  }
};
</script>

  