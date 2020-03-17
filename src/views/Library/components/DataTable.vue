<template>
  <div class="table">
    <DataTableCell v-for="(data, index) in array" :data="data" :key="index" :index="index + 1" />
  </div>
</template>

<script>
import DataTableCell from './DataTableCell'

export default {
    name: 'DataTable',
    components: {
      DataTableCell
    },
    data() {
      return {
        array: []
      }
    },
    props: {
      playlists: Array,
      playlistNames: Array,
      forPlaylists: Boolean
    },
    methods: {
      formatData() {
        setTimeout(() => {
          let array = []
          let obj = {};

          this.playlists.forEach((arr, index) => {
            obj.leftTop = this.playlistNames[index];
            let views = JSON.stringify(arr.reduce((objA, objB) => Number.parseInt(objA.views) + Number.parseInt(objB.views)));
            let viewsLength = views.length;
            obj.leftBottom = views.slice(0, 2) + '0'.repeat(viewsLength - 2) + '+ views';
            obj.rightTop = arr.length + ' Songs';

            array.push(obj);
            obj = {};
          });

          this.array = array;
          window.console.log(array);
        }, 50)
    }
  },
  mounted() {
    this.formatData()
  }
}
</script>

<style lang="scss">
  .table {
    max-width: 680px;
    margin-left: 60px;
    margin-top: 40px;
    width: 100%;
    height: 100%;
  }
</style>