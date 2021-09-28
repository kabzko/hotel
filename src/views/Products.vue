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
                    <ion-col size="4" v-for="product of products" v-bind:key="product.id">
                        <router-link :to="{ name: 'Product', params: { storeid: product.store_id, productid: product.id }}">
                            <div class="product-img">
                                <img :src="product.images">
                            </div>
                            <div>
                                {{ product.name }}
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
import { IonContent, IonPage, IonBackButton, IonTitle } from "@ionic/vue";
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
        const category = route.params.category;
        return {
            category,          
        }
    },
    data() {
        return {
            products: [],
            title: ""
        }
    },
    created() {
        this.title = this.category;
        this.loadProducts();
    },
    methods: {
        loadProducts() {
            Global.methods.Loading();
            setTimeout(() => {
                axios.post(Global.methods.GetURL() + "/user_products", {
                    category: this.category,
                }).then(res => {
                    this.products = res.data;
                }).catch(err => {
                    console.log(err);
                }).finally(() => {
                    setTimeout(() => {
                        Global.methods.Unloading();
                    }, 100);
                });
            }, 500);
        }
    },
});
</script>

<style lang="scss" scoped>
    .product-img {
        border-radius: 7px;
        display: block;
    }
</style>