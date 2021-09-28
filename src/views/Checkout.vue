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
                <DatePicker v-if="load" @drag="getSelected($event)" mode="range" v-model="range" :attributes="attributes" :min-date="datenow" :disabled-dates="dates" is-range is-expanded />
            </div>
            <div v-if="show == true">
                <h2>{{ rate * nights }}</h2>
                <h2>{{ datestart }}</h2>
                <h2>{{ dateend }}</h2>
                <h2>
                    <span v-if="nights >= 2">{{ nights }} nights</span>
                    <span v-else>{{ nights }} night</span>
                </h2>
                <h2>
                    <span v-if="room >= 2">{{ room }} rooms</span>
                    <span v-else>{{ room }} room</span>
                </h2>
                <h2>
                    {{ downpayment * room }}
                </h2>
            </div>
        </ion-content>
        <ion-footer>
            <div>
                <ion-button expand="full" color="primary" @click="bookNow()">
                    Book now
                </ion-button>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonButtons, IonButton, IonBackButton } from "@ionic/vue";
import { DatePicker } from 'v-calendar';
import { useRoute } from "vue-router";
import Global from "../components/Global";
import axios from "axios";

export default {
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonButtons, IonButton, IonBackButton, DatePicker,
    },
    setup() {
        const route = useRoute();
        const productid = route.params.productid;  
        const room = route.params.room;
        const rate = route.params.rate;
        const rateType = route.params.ratetype;
        const discount = route.params.discount;
        const checkin = route.params.checkin;
        const checkout = route.params.checkout;
        const storeid = route.params.storeid;
        return {
            productid,
            room,
            rate,
            rateType,
            discount,
            checkin,
            checkout,
            storeid,
        }
    },
    data() {
        return {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            date: new Date().getDate(),
            attributes: [],
            dates: [],
            range: [],
            checker: false,
            load: false,
            show: false,
            percentage: 50,
            downpayment: 0,
            userid: "",
            datenow: "",
            datestart: "",
            dateend: "",
            nights: "",
        };
    },
    created() {
        if (typeof localStorage.user !== "undefined") {
            this.userid = JSON.parse(localStorage.user)[0].id;
        }
        this.datenow = new Date(this.year, this.month, this.date + 3);
    },
    mounted() {
        this.loadAllBooked();
    },
    methods: {
        loadAllBooked() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/already_booked_room", {
                productid: this.productid,
                room: this.room,
            }).then(res => {
                res.data.forEach(x => {
                    if (!((x.room_availability - x.room) >= this.room)) {
                        this.dates.push({
                            start: new Date(x.from_datetime),
                            end: new Date(x.to_datetime)
                        });
                    }
                });
                this.attributes.push({
                    popover: {
                        label: "This day is already book.",
                    },
                    bar: "red",
                    dates: this.dates,
                });
                this.load = true;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
        getSelected(e) {
            const customend = new Date(e.end);
            customend.setDate(customend.getDate() + 1);
            this.datestart = new Date(e.start).getFullYear() + "-" + (new Date(e.start).getMonth() + 1) + "-" + new Date(e.start).getDate() + " " + this.checkin;
            this.dateend = customend.getFullYear() + "-" + (customend.getMonth() + 1) + "-" + customend.getDate() + " " + this.checkout;
            this.nights = Math.ceil(((e.end.getTime() - e.start.getTime()) / (1000 * 3600 * 24) + 1));
            this.downpayment = ((this.rate * this.nights) * this.room) * (this.percentage / 100);
        },
        bookNow() {
            if (this.range.length != 0) {
                this.checker = false;
                this.attributes[0].dates.forEach(x => {
                    if (this.range.start <= x.start && x.end <= this.range.end) {
                        this.checker = true;
                    } else {
                        if ((x.start <= this.range.start && this.range.start <= x.end) || (x.start <= this.range.end && this.range.end <= x.end)) {
                            this.checker = true;
                        }
                    }
                });
                if (this.checker == false) {
                    axios.post(Global.methods.GetURL() + "/user_reserve_room", {
                        userid: this.userid,
                        productid: this.productid,
                        storeid: this.storeid,
                        room: this.room,
                        rate: this.rate,
                        ratetype: this.rateType,
                        discount: this.discount,
                        from: this.datestart,
                        to: this.dateend,
                        downpayment: this.downpayment,
                        checkin: this.checkin,
                        checkout: this.checkout,
                    }).then(res => {
                        if (res.data == 1) {
                            this.$router.replace({name: "Home"});
                        } else {
                            console.log("You dont have enought money");
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            } else {
                console.log("Please select a date.")
            }
        }
    },
    watch: {
        range() {
            if (this.range.length != 0) {
                this.show = true;
            } else {
                this.show = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>