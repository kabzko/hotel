<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="closeModal()">
                        <ion-icon slot="icon-only" :icon="close"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-item>
                <ion-label>Amount</ion-label>
                <ion-input type="number" v-model="amount"></ion-input>
            </ion-item>
            <ion-button @click="cashOut()">Cash Out</ion-button>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonIcon, modalController } from "@ionic/vue";
import { close } from "ionicons/icons";
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonIcon
    },
    props: {
        wallet: Number
    },
    setup() {
        return {
            close,
        }
    },
    data() {
        return {
            amount: "",
            userid: "",
        }
    },
    created() {
        this.userid = JSON.parse(localStorage.user)[0].id;
    },
    methods: {
        cashOut() {
            if (this.wallet >= this.amount) {
                Global.methods.Loading();
                axios.post(Global.methods.GetURL() + "/user_cashout_wallet", {
                    userid: this.userid,
                    amount: Number(this.wallet) - (Number(this.amount)),
                    added: Number(this.amount),
                }).then(res => {
                    Global.methods.Unloading();
                    if (res.data == 1) {
                        modalController.dismiss({
                            status: "success"
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                console.log("Insufficient fund");
            }
        },
        closeModal() {
            modalController.dismiss();
        }
    },
})
</script>

<style lang="scss" scoped>

</style>