<template>
    <v-container> 
        <v-flex ma-2>
            <v-btn-toggle align-content-center v-model="filterMode">
                <v-btn flat value="all">
                    All
                </v-btn>
                <v-btn flat value="inBuyMode">
                    Purchased
                </v-btn>
                <v-btn flat value="notinBuyMode">
                    In Stand by
                </v-btn>
            </v-btn-toggle>
        </v-flex>

        <v-card class="ma-2">
            <v-container>
                <v-layout>
                    <v-flex xs12 md4 align-content-space-around>
                    <v-text-field
                        v-model="itemsList.budget"
                        label="Budget"
                        required
                        hide-details
                    ></v-text-field>
                    </v-flex>
                    <v-spacer>
                    </v-spacer>
                    <v-list-tile-content class="align-end">Total of {{itemsList.name}} : {{ total }}</v-list-tile-content>
                </v-layout>
            </v-container>
        </v-card>

        <v-card class="mx-2">
            <v-form>
                <v-container>
                    <v-layout>
                        <v-flex xs12 md4 align-content-space-around>
                        <v-select
                            v-bind:items="words"
                            v-model="itemName"
                            label="Item name"
                            required
                            hide-details
                            autocomplete
                        ></v-select>
                        </v-flex>
                        <v-spacer>
                        </v-spacer>
                        <v-btn
                            color="error"
                            @click="addItem" 
                        >
                            Add
                        </v-btn>
                    </v-layout>
                </v-container>
            </v-form>
        </v-card>

        <v-alert :value="alert" type="error" class="ma-2">
            Warning ! You are exceeding your budget !
        </v-alert>
        

        <v-data-iterator
        :items="listFilter"
        content-tag="v-layout"
        row
        wrap
        hide-actions
        >
            <template v-slot:item="props">
                <v-flex xs12 sm6 md4 lg3 ma-2>
                    <v-card>
                        <v-card-title><h4>{{ props.item.name }}</h4></v-card-title>
                        <v-divider></v-divider>
                        <v-list dense>
                            <v-list-tile>
                                <v-text-field  label="Price" v-model="props.item.price" class="align-end">{{ props.item.price }}</v-text-field>
                            </v-list-tile>      
                            <v-list-tile>
                                <v-checkbox label="Purchased" v-model="props.item.inBuyMode" class="align-end"></v-checkbox>
                            </v-list-tile>  
                            <v-list-tile>
                                <v-btn color="error" @click="deleteItem(props.item.index)"> Delete  </v-btn> 
                            </v-list-tile>    
                        </v-list>
                    </v-card>
                </v-flex>
            </template>
        </v-data-iterator>
    </v-container>
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
        itemsLists: {},
        itemsList: {},
        filterMode: 'all',
        words: [
            "Banana",
            "Avocado",
            "Steack",
            "Salad",
            "Salmon",
            "Tomato",
            "Orange",
            "Brocoli"
        ]
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
                return this.itemsList.list.filter(i => !i.inBuyMode)
            else if(this.filterMode === 'inBuyMode')
                return this.itemsList.list.filter(i => i.inBuyMode)
            else
                return this.itemsList
        },

        alert () {
            return this.total > this.itemsList.budget
        },

        listFilter() {
            if(this.filterMode === 'notinBuyMode')
                return this.itemsList.list.filter(i => !i.inBuyMode)
            else if(this.filterMode === 'inBuyMode')
                return this.itemsList.list.filter(i => i.inBuyMode)
            return this.itemsList.list
        },
    },
}
</script>


<style scoped>
</style>
