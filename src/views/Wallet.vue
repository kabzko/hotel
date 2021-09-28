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
            <div>
                ₱ {{ formatPrice(wallet) }}
            </div>
            <div>
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <ion-button @click="cashIn()">Cash In</ion-button>
                        </ion-col>
                        <ion-col>
                            <ion-button @click="cashOut()">Cash Out</ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
            <ion-list>
                <ion-list-header>
                    Transaction history
                </ion-list-header>
                <ion-item v-for="transaction, index of transactions" :key="transaction + index">
                    <ion-label>
                        {{ transaction.name }}
                    </ion-label>
                    <ion-label class="ion-text-right">
                        <span v-if="transaction.status_id == 1">
                            OnHold (₱ {{ formatPrice(transaction.amount) }})
                        </span>
                        <span v-if="transaction.status_id == 2 || transaction.status_id == 6">
                            + ₱ {{ formatPrice(transaction.amount) }}
                        </span>
                        <span v-if="transaction.status_id == 3 || transaction.status_id == 7">
                            - ₱ {{ formatPrice(transaction.amount) }}
                        </span>
                        <span v-if="transaction.status_id == 4">
                            Cancelled (₱ {{ formatPrice(transaction.amount) }})
                        </span>
                        <span v-if="transaction.status_id == 5">
                            Declined (₱ {{ formatPrice(transaction.amount) }})
                        </span>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton, modalController } from "@ionic/vue";
import { useRoute } from "vue-router";
import Global from "../components/Global";
import axios from "axios";
import CashIn from "./CashIn";
import CashOut from "./CashOut";

export default {
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton
    },
    setup() {
        const route = useRoute();
        const transactionid = route.params.transactionid;
        return {
            transactionid,
        }
    },
    data() {
        return {
            transactions: [],
            wallet: 0,
            userid: "",
        };
    },
    created() {
        this.userid = JSON.parse(localStorage.user)[0].id;
    },
    mounted() {
        this.loadUserWallet();
    },
    methods: {
        formatPrice(value) {
            const val = (value/1).toFixed(2).replace(",", ".")
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        loadUserWallet() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/user_wallet", {
                userid: this.userid,
            }).then(res => {
                this.transactions = res.data.transactions;
                this.wallet = res.data.wallet[0].wallet;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
        async cashIn() {
            const modal = await modalController.create({
                component: CashIn,
                cssClass: "my-custom-class",
                componentProps: {
                    wallet: this.wallet,
                },
            });
            await modal.present();
            const { data } = await modal.onWillDismiss();
            if (data != undefined && data.status == "success") {
                this.loadUserWallet();
            }
        },
        async cashOut() {
            const modal = await modalController.create({
                component: CashOut,
                cssClass: "my-custom-class",
                componentProps: {
                    wallet: this.wallet,
                },
            });
            await modal.present();
            const { data } = await modal.onWillDismiss();
            if (data != undefined && data.status == "success") {
                this.loadUserWallet();
            }
        }
    },
}
</script>

<style lang="scss" scoped>

</style>