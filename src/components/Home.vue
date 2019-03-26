<template>
  <v-container>
    <v-flex xm>
      <v-card class='pa-3' v-if="lastList">
        <v-card-title primary-title>
          <span class="title">This is your last list</span>
        </v-card-title>
        <v-card color="#726969">
          <v-card-title primary-title>
            <span class='title'>{{ lastList.name }}</span>
          </v-card-title>
          <v-card-text>
            Number of items : {{ lastList.list.length }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :to='"/lists/"+lastList.name' class="error" dark>SEE</v-btn>  
          </v-card-actions>
        </v-card>
      </v-card>
      <v-alert v-else type="error" :value="true">
        You have no list.
      </v-alert>
    </v-flex>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    lastList : null
  }),
  mounted () {
    const itemsLists = JSON.parse(window.localStorage.getItem('itemsLists')) || []
    this.lastList = itemsLists.lists.find(list => list.name === itemsLists.lastUpdate) || null
  }
}
</script>