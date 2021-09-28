<template>
    <ion-page>
        <ion-content>
            <div>
                <label for="">Username</label>
                <input type="text" placeholder="Enter Username" v-model="username">
            </div>
            <div>
                <label for="">Firstname</label>
                <input type="text" placeholder="Enter firstname" v-model="firstname">
            </div>
            <div>
                <label for="">Lastname</label>
                <input type="text" placeholder="Enter lastname" v-model="lastname">
            </div>
            <div>
                <button @click="register()">Sign up</button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonContent } from "@ionic/vue";
import { useRoute } from "vue-router";
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonPage, IonContent
    },
    setup() {
        const route = useRoute();
        const email = route.params.email;
        const password = route.params.password;
        return {
            email,
            password,
        }
    },
    data() {
        return {
            username: "",
            firstname: "",
            lastname: "",
        }
    },
    methods: {
        register() {
            if (this.firstname != "" && this.lastname != "") {
                axios.post(Global.methods.GetURL() + "/user_register_account", {
                    email: this.email,
                    password: this.password,
                    username: this.username,
                    firstname: this.firstname,
                    lastname: this.lastname,
                }).then(res => {
                    localStorage.user = JSON.stringify(res.data);
                    location.replace("/");
                }).catch(err => {
                    alert(err);
                });
            } else {
                console.log("please fill empty fields");
            }
        },
        gotosignin() {
            this.$router.back();
        }
    }
})
</script>

<style lang="scss" scoped>

</style>
