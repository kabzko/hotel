<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" color="primary"></ion-back-button>
                </ion-buttons>
                <ion-searchbar ref="searchRef" v-on:keyup.enter="searchUsingEnter()" v-model="search" class="searchshores" placeholder="Search Hotels" show-clear-button="always"></ion-searchbar>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div v-if="status == false && recent.length != 0">
                <ion-list>
                    <ion-list-header>
                        Recent searches
                    </ion-list-header>
                    <div @click.prevent="searchRecent(recent)" class="recent-list" v-for="recent of recent" v-bind:key="recent">
                        <ion-grid>
                            <ion-row>
                                <ion-col>
                                    <ion-icon :icon="timerOutline" color="primary"></ion-icon>
                                    &nbsp;
                                    <span>{{ recent }}</span>
                                </ion-col>
                                <ion-col class="ion-text-end">
                                    <ion-icon @click.stop="removeRecent(recent)" :icon="closeOutline" color="primary"></ion-icon>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </div>
                </ion-list>
            </div>
            <div v-if="status == true && recent.length != 0">
                <ion-list>
                    <ion-list-header>
                        You search for "{{ search }}"
                    </ion-list-header>
                    <div class="search-list">
                        <ion-grid>
                            <ion-row>
                                <ion-col size="4" v-for="store of stores" v-bind:key="store" @click.prevent="gotoStore(store.id)">
                                    <div class="store-img">
                                        <img :src="store.images">
                                    </div>
                                    <div>
                                        {{ store.name }}
                                    </div>
                                 </ion-col>
                            </ion-row>
                        </ion-grid>
                    </div>
                </ion-list>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonContent, IonPage, IonBackButton, IonButtons, IonIcon, IonSearchbar, IonList, IonListHeader, IonGrid, IonRow, IonCol } from "@ionic/vue";
import { closeOutline, timerOutline, heartOutline, heart } from "ionicons/icons";
import { useRoute } from "vue-router";
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonContent,
        IonPage,
        IonBackButton,
        IonButtons,
        IonIcon,
        IonSearchbar,
        IonList,
        IonGrid, 
        IonRow, 
        IonCol,
        IonListHeader
    },
    setup() {
        const route = useRoute();
        const type = route.params.type;
        return {
            closeOutline,
            timerOutline,
            heartOutline,
            heart,
            type,
        }
    },
    async created() {
        setTimeout(() => {
            this.$refs.searchRef.$el.setFocus();
        }, 100);
        if (typeof localStorage.users !== "undefined") {
            this.userID = JSON.parse(localStorage.users)[0].id;
        }
        if (localStorage.recent != undefined) {
            this.backUpRecent = JSON.parse(localStorage.recent);
            this.recent = this.backUpRecent;
        }
    },
    data() {
        return {
            recent: [],
            backUpRecent: [],
            stores: [],
            status: false,
            search: "",
            userID: "",
        }
    },
    methods: {
        searchHotelsAndResorts() {
            if (this.search != "") {
                if (typeof this.backUpRecent.find(x => x == this.search) == 'undefined') {
                    this.backUpRecent.reverse().push(this.search);
                    if (this.backUpRecent.length <= 5) {
                        this.recent = this.backUpRecent.reverse();
                        localStorage.recent = JSON.stringify(this.recent);
                    } else {
                        this.recent = this.backUpRecent.reverse().slice(0, 5);
                        localStorage.recent = JSON.stringify(this.recent);
                    }
                } else {
                    this.backUpRecent.splice(this.backUpRecent.indexOf(this.search), 1);
                    this.backUpRecent.reverse().push(this.search);
                    if (this.backUpRecent.length <= 5) {
                        this.recent = this.backUpRecent.reverse();
                        localStorage.recent = JSON.stringify(this.recent);
                    } else {
                        this.recent = this.backUpRecent.reverse().slice(0, 5);
                        localStorage.recent = JSON.stringify(this.recent);
                    }
                }
                this.loadSearch();
            }
        },
        searchRecent(search) {
            this.search = search;
            this.status = true;
            this.searchHotelsAndResorts();
        },
        searchUsingEnter() {
            this.status = true;
            this.searchHotelsAndResorts();
        },
        removeRecent(search) {
            this.Recent.splice(this.Recent.indexOf(search), 1);
            localStorage.recent = JSON.stringify(this.recent);
        },
        loadSearch() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/user_search_store", {
                search: this.search,
                type: this.type,
            }).then(res => {
                this.stores = [];
                this.stores = res.data;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 100);
            });
        },
        gotoStore(id) {
            this.$router.replace({name: "Store", params: { storeid: id }});
        },
    },
    watch: {
        search() {
            if(this.search == "") {
                this.status = false;
            }
        }
    },
})
</script>

<style lang="scss" scoped>
    ion-list-header {
        font-weight: 600;
        font-size: 16px;
    }
    .recent-list {
        padding: 10px 10px;
    }
    .search-list {
        padding: 0 10px;
    }
    ion-searchbar {
        padding: 0 !important;
    }
    .store-img img {
        height: 40vw;
        display: block;
        margin: auto;
    }
    ion-list {
        padding: 0;
    }
    .close {
        .close-sign {
            position: absolute;
            top: 0;
            background-color: rgba(0, 0, 0, 0.8);
            width: 100%;
            height: calc(100% - 65px);
            .close-text {
                width: 80%;
                text-align: center;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 3vw;
            }
        }
    }
</style>
