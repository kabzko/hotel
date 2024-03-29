<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="carousel">
                <img :src="productimage">
            </div>
            <div>
                <div>
                    {{ name }}
                </div>
                <div>
                    {{ rate + " " + rateType }}
                </div>
                <hr>
                <div>
                    <div v-if="entry >= 2">
                        Good for {{ entry }} persons
                    </div>
                    <div v-else>
                        Good for {{ entry }} person
                    </div>
                </div>
                <div v-for="(facility, index) of facilities" :key="facility + index">
                    {{ facility }}
                </div>
                <div>
                    <div v-if="entry >= 2">
                        {{ roomAvailability }} Rooms Available
                    </div>
                    <div v-else>
                        {{ roomAvailability }} Room Available
                    </div>
                </div>
            </div>
        </ion-content>
        <ion-footer>
            <div class="footer">
                <ion-grid>
                    <ion-row>
                        <ion-col size="10" class="room-quantity-text">
                            <div>
                                How many rooms you want to book?
                            </div>
                        </ion-col>
                        <ion-col size="2">
                            <ion-item lines="none">
                                <ion-input type="number" v-model="room"></ion-input>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <ion-button expand="full" color="primary" @click="gotoCheckout()">Reserve</ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonItem, IonInput } from "@ionic/vue";
import { useRoute } from "vue-router";
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonItem, IonInput
    },
    setup() {
        const route = useRoute();
        const productid = route.params.productid;
        const carouselopts = {
            loop: true,
            pagination: {
                el: ".swiper-pagination",
                "dynamicBullets": true
            }
        };
        return {
            productid,
            carouselopts,
        }
    },
    data() {
        return {
            facilities: [],
            room: 1,
            name: "",
            entry: "",
            rate: "",
            rateType: "",
            roomAvailability: "",
            discount: "",
            checkIn: "",
            checkOut: "",
            productimage: "",
            storeid: "",
        }
    },
    mounted() {
        this.loadProductDetail();
    },
    methods: {
        formatPrice(value) {
            const val = (value/1).toFixed(2).replace(",", ".")
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        loadProductDetail() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/user_product_detail", {
                productid: this.productid,
            }).then(res => {
                this.name = res.data[0].name;
                this.facilities = res.data[0].facility.split(";");
                this.entry = res.data[0].entry;
                this.rate = res.data[0].rate;
                this.rateType = res.data[0].rate_type;
                this.roomAvailability = res.data[0].room_availability;
                this.checkIn = res.data[0].checkin;
                this.checkOut = res.data[0].checkout;
                this.productimage = res.data[0].images;
                this.storeid = res.data[0].store_id;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
        gotoCheckout() {
            this.$router.push({name: "Checkout", params: { productid: this.productid, room: this.room, rate: this.rate, ratetype: this.rateType, discount: this.discount, checkin: this.checkIn, checkout: this.checkOut, storeid: this.storeid }});
        }
    },
})
</script>

<style lang="scss" scoped>
    .carousel img {
        height: 48vw;
        display: block;
        margin: auto;
    }
    ion-footer .footer {
        margin: 10px;
    }
    ion-grid, ion-col {
        padding: 0;
    }
    ion-item {
        border: 1px solid #c8c7cc;
        border-radius: 10px;
    }
    ion-input {
        text-align: center;
        font-size: 24px;
    }
    .room-quantity-text {
        display: flex;
        align-items: center;
        padding-left: 5px;
        div {
            font-size: 20px;
        }
    }
    ion-row {
        margin: 5px 0;
    }
</style>