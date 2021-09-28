<template>
    <ion-app>
        <ion-menu content-id="main" type="overlay" swipeGesture="false">
            <ion-content>
                <ion-list>
                    <ion-list-header>{{ name }}</ion-list-header>
                    <ion-note>{{ username }}</ion-note>
                    <ion-menu-toggle auto-hide="false">
                        <ion-item button lines="none" router-link="/profile">Profile</ion-item>
                    </ion-menu-toggle>
                    <ion-menu-toggle auto-hide="false">
                        <ion-item button lines="none" router-link="/booked">Reservation</ion-item>
                    </ion-menu-toggle>
                    <ion-menu-toggle auto-hide="false">
                        <ion-item button lines="none" router-link="/wallet">Wallet</ion-item>
                    </ion-menu-toggle>
                    <ion-menu-toggle auto-hide="false">
                        <ion-item n-item button lines="none" router-link="/settings">Settings</ion-item>
                    </ion-menu-toggle>
                    <ion-menu-toggle auto-hide="false" @click="Logout()">
                        <ion-item button lines="none">Log out</ion-item>
                    </ion-menu-toggle>
                </ion-list>
            </ion-content>
        </ion-menu>
        <ion-router-outlet id="main"></ion-router-outlet>
    </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem } from "@ionic/vue";
import Global from "./components/Global.vue";

export default({
    components: {
        IonApp, IonRouterOutlet, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem
    },
    created() {
        if (typeof localStorage.user !== "undefined") {
            this.userid = JSON.parse(localStorage.user)[0].id;
            this.name = JSON.parse(localStorage.user)[0].firstname + " " + JSON.parse(localStorage.user)[0].lastname;
            this.username = "@" + JSON.parse(localStorage.user)[0].username;       
        }
    },
    data() {
        return {
            userid: "",
            name: "",
            username: "",
        }
    },
    methods: {
        LoadData() {
            this.userid = JSON.parse(localStorage.user)[0].id;
            this.name = JSON.parse(localStorage.user)[0].firstname + " " + JSON.parse(localStorage.user)[0].lastname;
            this.username = "@" + JSON.parse(localStorage.user)[0].username;
        },
        Logout() {
            Global.methods.Loading();
            setTimeout(() => {
                Global.methods.Unloading();
                localStorage.clear();
                location.reload();
            }, 1000);
        }
    },
    watch: {
        '$route': 'LoadData'
    }
});
</script>

<style lang="scss" scoped>
    ion-list {
        padding: 20px 10px;
    }
    ion-list-header {
        font-size: 18px;
        font-weight: 600;
        color: var(--ion-color-primary);
    }
    ion-note {
        padding-left: 9px;
        margin: 0px 0 20px 6px !important;
        display: inline-block;
    }
</style>