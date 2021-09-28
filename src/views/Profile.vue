<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" color="primary"></ion-back-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button color="primary">
                        <ion-icon slot="icon-only" :icon="saveSharp"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="info">
                <ion-item lines="none">
                    <ion-label position="floating">Email</ion-label>
                    <ion-input type="email" v-model="email"></ion-input>
                </ion-item>
                <ion-item lines="none">
                    <ion-label position="floating">Firstname</ion-label>
                    <ion-input type="text" v-model="firstname"></ion-input>
                </ion-item>
                <ion-item lines="none">
                    <ion-label position="floating">Lastname</ion-label>
                    <ion-input type="text" v-model="lastname"></ion-input>
                </ion-item>
                <ion-item lines="none">
                    <ion-label position="floating">Mobile</ion-label>
                    <ion-input type="text" v-model="mobile"></ion-input>
                </ion-item>
                <ion-item lines="none">
                    <ion-label position="floating">Password</ion-label>
                    <ion-input :type="eyePass" v-model="password"></ion-input>
                    <ion-button class="eyebtn" @click.self="ShowHidePass()">
                        <ion-icon slot="icon-only" :icon="eyeIcon" color="primary"></ion-icon>
                    </ion-button>
                </ion-item>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonContent, IonPage, IonButtons, IonButton, IonItem, IonInput, IonBackButton, IonLabel, IonIcon, toastController } from "@ionic/vue";
import { eyeOutline, eyeOffOutline, saveSharp } from "ionicons/icons";
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonPage,
        IonContent,
        IonItem,
        IonLabel,
        IonButton,
        IonButtons,
        IonIcon,
        IonInput,
        IonBackButton,
    },
    setup() {
        return {
            eyeOutline,
            eyeOffOutline,
            saveSharp
        }
    },
    data() {
        return {
            eyeIcon: this.eyeOffOutline,
            eyeStatus: false,
            eyePass: "password",
            firstname: "",
            lastname: "",
            password: "",
            userID: "",
            email: "",
            mobile: "",
        }
    },
    created() {
        this.userID = JSON.parse(localStorage.user)[0].id;
        this.LoadUserProfile();
    },
    methods: {
        LoadUserProfile() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/user_profile", {
                userid: this.userID
            }).then(res => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
                this.firstname = res.data[0].firstname;
                this.lastname = res.data[0].lastname;
                this.mobile = res.data[0].mobile;
                this.email = res.data[0].email;
            }).catch(err => {
                console.log(err);
            });
        },
        ShowHidePass() {
            if (this.eyeStatus == false) {
                this.eyeStatus = true;
                this.eyeIcon = this.eyeOutline;
                this.eyePass = "text";
            } else {
                this.eyeStatus = false;
                this.eyeIcon = this.eyeOffOutline;
                this.eyePass = "password";
            }
        },
        async openToast(message) {
            const toast = await toastController.create({
                    message: message,
                    mode: "ios",
                    duration: 3000,
                    position: "bottom"
                });
            return toast.present();
        }
    }
})
</script>

<style lang="scss" scoped>
    .info {
        margin: 15px;
        ion-item {
            border: 1px solid #c8c7cc;
            border-radius: 10px;
            margin: 10px 0;
        }
    }
    .eyebtn {
        position: absolute;
        right: 15px;
        top: 12px;
        padding: 0 !important;
        --background: transparent;
        z-index: 2;
        --padding-start: 0;
        --padding-end: 0;
        --padding-top: 0;
        --padding-bottom: 0;
        --box-shadow: 0;
    }
</style>