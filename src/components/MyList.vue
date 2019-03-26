<template>
    <form id="shopping-list">
        <h1>Budget :  <input type="number" v-model="itemsList.budget"></h1>
        <h2> {{itemsList.name}} : {{ total }} </h2>
        <!--<div class="alert alert-danger w-25" role="alert" v-if="alert">
                Warning ! You are exceeding your budget !
        </div>-->
        <!--<list :items="itemsList" class="mt-3"></list>-->
        <v-alert
            :value="alert"
            type="error"
        >
             Warning ! You are exceeding your budget !
        </v-alert>
        <div>
        <div class="btn-group mb-3" size="sm" role="group">
            <button type="button" :class='filterMode === "all" ? "btn btn-primary" : "btn btn-secondary"' @click="filterMode = 'all'">All</button>
            <button type="button" :class='filterMode === "inBuyMode" ? "btn btn-primary" : "btn btn-secondary"' @click="filterMode = 'inBuyMode'">Purchased</button>
            <button type="button" :class='filterMode === "notinBuyMode" ? "btn btn-primary" : "btn btn-secondary"' @click="filterMode = 'notinBuyMode'">In StandBy</button>
        </div>
        <table id="shopping-list-table" class="table table-condensed table-hover">
            <thead>
                <tr>
                    <th>Price</th>
                    <th>Item</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tr v-for="(item, index) in itemsList.list" :key="index">
                <td v-if="item.inBuyMode">
                    <input type="number" v-model="item.price">
                </td>
                <td v-else>
                    <span >{{ item.price }}</span>
                </td>
                <td>
                    <span>{{ item.name }}</span>
                </td>
                <td>
                    <input type="checkbox" v-model="item.inBuyMode"/>
                    <button type="button" class="btn btn-danger" @click="deleteItem(index)"><i class="fa fa-remove"></i> Delete  </button>
                </td>
            </tr>
        </table>
    </div>

        <h4>Add new item</h4>
        <div class="row col-md-6">
            <div class="col-md-6 form-group"> Name
                <input type="text" v-model="itemName">
            </div>
            <button type="button" @click="addItem" class="btn btn-primary" > Add  </button>
        </div>
    </form>
</template>

<script>

export default {
    props: {
        items: {
            type: Array
        }
    },

    data: () =>  ({
        name: '',
        itemName: '',
        itemsLists: [],
        itemsList: [],
        filterMode: 'all'
    }),

    methods: {
        addItem() {
            this.itemsList.list.push({
                name: this.itemName,
                price: 0,
                inBuyMode: false
            })
            this.itemToAdd = ''
            this.updateIndexes()
        },

        deleteItem (index) {
        this.itemsList.list = this.itemsList.list.filter(i => i.index !== index)
        this.updateIndexes()
        },

        updateIndexes () {
            this.itemsList.list = this.itemsList.list.map((o,i) => ({
                ...o,
                index: i
            }))
        }
    },

    mounted() {
        const name = this.$route.params.name
        this.itemsLists = JSON.parse(window.localStorage.getItem('itemsLists')) || {lists: [], lastUpdate: ''}
        const itemsList = this.itemsLists.lists.find(l => l.name === name)
        if(!itemsList) {
            this.itemsList = {name: name, list: [], budget: 50}
            this.itemsLists.lists.push(this.itemsList)
        } else {
            this.itemsList = itemsList
        }
    this.updateIndexes()
  },
  
    watch: {
        itemsList: {
            handler () {
                this.itemsLists.lists = this.itemsLists.lists.map(item => item.name === this.itemsList.name ? this.itemsList : item)
                this.itemsLists.lastUpdate = this.itemsList.name
                window.localStorage.setItem('itemsLists', JSON.stringify(this.itemsLists))
            },
            deep: true
        }
    },
        
    computed: {
        total () {
            if(this.itemsList.list)
                return this.itemsList.list.reduce((acc, cur) => cur.inBuyMode ? acc += Number(cur.price) : acc,0)
            return 0;
        },

        list () {
            if(this.filterMode === 'notinBuyMode')
                return this.itemsList.filter(i => !i.inBuyMode)
            else if(this.filterMode === 'inBuyMode')
                return this.itemsList.filter(i => i.inBuyMode)
            else
                return this.itemsList
        },

        alert () {
            return this.total > this.itemsList.budget
        }
    },
}
</script>


<style scoped>
body {
    padding: 1%;
    background-color: #abca
}
  
h2, h4 {
    font-family: 'Nunito', sans-serif;
}
  

#shopping-list-table{
    table-layout: fixed;
    width: 50%;
    vertical-align: middle;
}
  
button {
    margin-left: 2%;
}
</style>
