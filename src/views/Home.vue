<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-menu-button slot="start"></ion-menu-button>
                <ion-title @click="ChangeAddress()">
                    <span>{{ route }}</span><br>
                    <small>{{ address }}</small>
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-segment v-model="types">
                <ion-segment-button value="hotel">
                    Hotel
                </ion-segment-button>
                <ion-segment-button value="resort">
                    Resort
                </ion-segment-button>
            </ion-segment>
            <div v-if="types == 'hotel'">
                <router-link :to="{ name: 'SearchShoRes', params: { type: 'Hotel' } }">
                    <ion-searchbar placeholder="Search Hotels" disabled></ion-searchbar>
                </router-link>  
                <div v-if="nearHotel.length != 0">
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                Near Me
                            </ion-col>
                            <ion-col>
                                <router-link :to="{ name: 'Stores', params: { type: 'nearme', bldgtype: 'Hotel' }}">View All</router-link>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                    <ion-slides pages="true" :options="slideOpts">
                        <ion-slide v-for="(hotel, index) of nearHotel" :key="hotel + index">
                            <router-link :to="{name: 'Store', params: { storeid: hotel.id }}">
                                <ion-card>
                                    <div class="store-img">
                                        <img :src="hotel.images">
                                    </div>
                                    <div>
                                        {{ hotel.name }}
                                    </div>
                                </ion-card>
                            </router-link>
                        </ion-slide>
                    </ion-slides>
                </div>
                <div v-if="recentHotel.length != 0">
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                Recent
                            </ion-col>
                            <ion-col>
                                <router-link to="">View All</router-link>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                    <ion-slides pages="true" :options="slideOpts">
                        <ion-slide>
                            <ion-card>
                                <ion-card-header>
                                    <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                                    <ion-card-title>Card Title</ion-card-title>
                                </ion-card-header>
                                <ion-card-content>
                                    Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a week in the woods. Wash your spirit clean.
                                </ion-card-content>
                            </ion-card>
                        </ion-slide>
                    </ion-slides>
                </div>
            </div>
            <div v-else>
                <router-link :to="{ name: 'SearchShoRes', params: { type: 'Resort' }}">
                    <ion-searchbar placeholder="Search Resorts" disabled></ion-searchbar>
                </router-link>
                <div v-if="nearResort.length != 0">
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                Near Me
                            </ion-col>
                            <ion-col>
                                <router-link :to="{ name: 'Stores', params: { type: 'nearme', bldgtype: 'Resort' }}">View All</router-link>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                    <ion-slides pages="true" :options="slideOpts">
                        <ion-slide v-for="(resort, index) of nearResort" :key="resort + index">
                            <router-link :to="{name: 'Store', params: { storeid: resort.id }}">
                                <ion-card>
                                    <div class="store-img">
                                        <img :src="resort.images">
                                    </div>
                                    <div>
                                        {{ resort.name }}
                                    </div>
                                </ion-card>
                            </router-link>
                        </ion-slide>
                    </ion-slides>
                </div>
                <div v-if="recentResort.length != 0">
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                Recent
                            </ion-col>
                            <ion-col>
                                <router-link to="">View All</router-link>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                    <ion-slides pages="true" :options="slideOpts">
                        <ion-slide>
                            <ion-card>
                                <ion-card-header>
                                    <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                                    <ion-card-title>Card Title</ion-card-title>
                                </ion-card-header>
                                <ion-card-content>
                                    Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a week in the woods. Wash your spirit clean.
                                </ion-card-content>
                            </ion-card>
                        </ion-slide>
                    </ion-slides>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonContent, IonToolbar, IonSegment, IonSegmentButton, IonSearchbar, IonCard, IonSlides, IonSlide, alertController, modalController } from "@ionic/vue";
import Global from "../components/Global";
import axios from "axios";
import Coordinator from "./Coordinator";

export default({
    components: {
        IonPage, IonHeader, IonContent, IonToolbar, IonSegment, IonSegmentButton, IonSearchbar, IonCard, IonSlides, IonSlide
    },
    setup() {
        const slideOpts = {
            slidesPerView: "2",
            freeMode: true
        };
        return {
            slideOpts,
        }
    },
    data() {
        return {
            nearHotel: [],
            nearResort: [],
            recentHotel: [],
            recentResort: [],
            types: "hotel",
            userid: "",
            route: "",
            address: "",
        }
    },
    created() {
        this.userid = JSON.parse(localStorage.user)[0].id;
    },
    beforeMount() {
        this.route = JSON.parse(localStorage.mycoordinates)[0].route + " " + JSON.parse(localStorage.mycoordinates)[0].street;
        this.address = JSON.parse(localStorage.mycoordinates)[0].city + " " + JSON.parse(localStorage.mycoordinates)[0].province + " " + JSON.parse(localStorage.mycoordinates)[0].country;
        this.loadHomeDetail(JSON.parse(localStorage.mycoordinates)[0].lat, JSON.parse(localStorage.mycoordinates)[0].lng);
    },
    methods: {
        loadHomeDetail(lat, lng) {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/user_home_detail", {
                userid: this.userid,
                lat: lat,
                lng: lng,
            }).then(res => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
                this.nearHotel = res.data.hotel;
                this.nearResort = res.data.resort;
            }).catch(err => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
                console.log(err);
            });
        },
        async ChangeAddress() {
            const alert = await alertController.create({
                cssClass: "my-custom-class",
                message: "Do you wish to change your location?",
                buttons: [
                    {
                        text: "No",
                        role: "cancel",
                        cssClass: "secondary"
                    },
                    {
                        text: "Yes",
                        handler: () => {
                            this.findMyLocation();
                        },
                    },
                ],
            });
            await alert.present();
        },
        async findMyLocation() {
            const modal = await modalController.create({
                component: Coordinator,
                cssClass: "my-custom-class",
            });
            await modal.present();
            const { data } = await modal.onWillDismiss();
            if (data != undefined && data.status == "success") {
                this.route = JSON.parse(localStorage.mycoordinates)[0].route + " " + JSON.parse(localStorage.mycoordinates)[0].street;
                this.address = JSON.parse(localStorage.mycoordinates)[0].city + " " + JSON.parse(localStorage.mycoordinates)[0].province + " " + JSON.parse(localStorage.mycoordinates)[0].country;
                this.loadHomeDetail(JSON.parse(localStorage.mycoordinates)[0].lat, JSON.parse(localStorage.mycoordinates)[0].lng);
            }
        }
    },
})
</script>

<style lang="scss" scoped>
    ion-grid ion-row {
        ion-col:nth-child(2) {
            text-align: right;
        }
    }
    .store-img img {
        height: 40vw;
        display: block;
        margin: auto;
    }
</style>