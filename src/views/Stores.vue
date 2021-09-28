<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>{{ title }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-grid>
                <ion-row>
                    <ion-col size="4" v-for="(store, index) of stores" v-bind:key="store + index">
                        <router-link :to="{ name: 'Store', params: { storeid: store.id }}">
                            <div class="store-img">
                                <img :src="store.images">
                            </div>
                            <div>
                                {{ store.name }}
                            </div>
                        </router-link>
                    </ion-col>
                </ion-row>
            </ion-grid>  
        </ion-content>
    </ion-page>
</template>

<script>
import { useRoute } from "vue-router";
import { IonContent, IonPage, IonTitle, IonBackButton } from "@ionic/vue";
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonContent,
        IonPage,
        IonTitle,
        IonBackButton
    },
    setup() {
        const route = useRoute();
        const type = route.params.type;
        const bldgtype = route.params.bldgtype;
        return {
            type,          
            bldgtype,          
        }
    },
    async created() {
        if (typeof localStorage.users !== "undefined") {
            this.userID = JSON.parse(localStorage.users)[0].id;
        }
        if (this.type == "nearme") {
            this.title = "Near Me";
        } else {
            this.title = "Recents";
        }
        this.loadStores(JSON.parse(localStorage.mycoordinates)[0].lat, JSON.parse(localStorage.mycoordinates)[0].lng);
    },
    data() {
        return {
          stores: [],
          title: "",
          userID: "",
        }
    },
    methods: {
        timeFormat(time) {
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
            if (time.length > 1) {
                const timeparts = time.slice(1);
                const meridiem = timeparts[0] < 12 ? ' AM' : ' PM'
                return ('0' + (timeparts[0] % 12 || 12)).slice(-2) + timeparts[1] + timeparts[2] + meridiem;
            }
        },
        loadStores(lat, lng) {
            Global.methods.Loading();
            setTimeout(() => {
                if (this.type == "nearme") {
                    axios.post(Global.methods.GetURL() + "/user_stores", {
                        lat: lat,
                        lng: lng,
                        bldgtype: this.bldgtype,
                    }).then(res => {
                        this.stores = res.data;
                    }).catch(err => {
                        console.log(err);
                    }).finally(() => {
                        setTimeout(() => {
                            Global.methods.Unloading();
                        }, 100);
                    });
                } else {
                    axios.post(Global.methods.GetURL() + "/user_recents", {
                        userid: this.userID,
                        bldgtype: this.bldgtype,
                    }).then(res => {
                        this.stores = res.data.favourites;
                    }).catch(err => {
                        console.log(err);
                    }).finally(() => {
                        setTimeout(() => {
                            Global.methods.Unloading();
                        }, 100);
                    });
                }
            }, 500);
        },
    },
});
</script>

<style lang="scss" scoped>
    .store-img img {
        height: 40vw;
        display: block;
        margin: auto;
    }
</style>