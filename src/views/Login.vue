<template>
    <ion-page>
        <ion-content>
            <div>
                <label for="">Phone, email or username</label>
                <input type="text" v-model="account">
            </div>
            <div>
                <label for="">Password</label>
                <input type="password" v-model="password">
            </div>
            <div>
                <router-link to="">
                    Forgot Password?
                </router-link>
            </div>
            <div>
                <button @click="login()">Sign in</button>
            </div>
            <div>
                <button @click="gotosignup()">Sign up</button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import axios from "axios";
import Global from "../components/Global";
import { IonPage, IonContent } from "@ionic/vue";

export default({
    components: {
        IonPage, IonContent
    },
    data() {
        return {
            account: "",
            password: "",
        }
    },
    methods: {
        login() {
            axios.post(Global.methods.GetURL() + "/user_login", {
                account: this.account,
                password: this.password,
            }).then(res => {
                if (res.data != 0) {
                    localStorage.user = JSON.stringify(res.data);
                    this.$router.replace('/');
                } else {
                    this.password = "";
                    alert("Credentials not found!");
                }
            }).catch(err => {
                alert(err);
            });
        },
        gotosignup() {
            this.$router.push({name: "Register"});
        }
    },
})
</script>

<style lang="scss" scoped>

</style>