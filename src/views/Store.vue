<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>
                    {{ storeName }}
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="carousel">
                <img :src="storeimage">
            </div>
            <div v-for="(category, index) of categories" :key="category + index">
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            {{ category.name }}
                        </ion-col>
                        <ion-col>
                            <router-link :to="{ name: 'Products', params: { category: category.name }}">View All</router-link>
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <ion-slides pages="true" :options="slideOpts">
                    <ion-slide v-for="(product, index) of filterCategory(category.name)" :key="product + index">
                        <router-link :to="{name: 'Product', params: { productid: product.id }}">
                            <ion-card>
                                <div class="product-img">
                                    <img :src="product.images">
                                </div>
                                <div>
                                    {{ product.name }}
                                </div>
                            </ion-card>
                        </router-link>
                    </ion-slide>
                </ion-slides>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonTitle, IonToolbar, IonContent, IonButtons, IonBackButton } from "@ionic/vue";
import { useRoute } from "vue-router";
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonPage, IonHeader, IonTitle, IonToolbar, IonContent, IonButtons, IonBackButton
    },
    setup() {
        const route = useRoute();
        const storeid = route.params.storeid;
        const slideOpts = {
            slidesPerView: "2",
            freeMode: true
        };
        return {
            storeid,
            slideOpts,
        }
    },
    data() {
        return {
            categories: [],
            products: [],
            storeName: "",
            storeimage: "",
        }
    },
    mounted() {
        this.loadStoreDetail();
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
        filterCategory(category) {
            return this.products.filter(x => x.category == category);
        },
        loadStoreDetail() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/user_store_detail", {
                storeid: this.storeid,
            }).then(res => {
                this.categories = res.data.categories;
                this.products = res.data.products;
                this.storeName = res.data.store[0].name;
                this.storeimage = res.data.store[0].images;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
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
    ion-grid ion-row {
        ion-col:nth-child(2) {
            text-align: right;
        }
    }
    .product-img img {
        height: 40vw;
        display: block;
        margin: auto;
    }
</style>
