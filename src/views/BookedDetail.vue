<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>
                    {{ building }}
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-grid>
                <ion-row>
                    <ion-col>
                        {{ booked }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        {{ roomname }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        {{ rate }} {{ ratetype }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        Booked {{ room }}
                        <span v-if="room == 1">
                            room
                        </span>
                        <span v-else>
                            rooms
                        </span>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton} from "@ionic/vue";
import { useRoute } from "vue-router";
import Global from "../components/Global";
import axios from "axios";

export default {
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton
    },
    setup() {
        const route = useRoute();
        const orderid = route.params.orderid;
        return {
            orderid,
        }
    },
    data() {
        return {
            dayname: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            monthname: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            userid: "",
            booked: "",
            building: "",
            roomname: "",
            rate: "",
            ratetype: "",
            room: "",
            checkIn: "",
            checkOut: "",
        };
    },
    created() {
        if (typeof localStorage.user !== "undefined") {
            this.userid = JSON.parse(localStorage.user)[0].id;
        }
    },
    mounted() {
        this.loadBookedDetail();
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
        formatPrice(value) {
            const val = (value/1).toFixed(2).replace(",", ".")
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        loadBookedDetail() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/user_booked_room_detail", {
                orderid: this.orderid,
            }).then(res => {
                this.booked = this.dayname[new Date(res.data[0].from_datetime).getDay()] + ", " + this.monthname[new Date(res.data[0].from_datetime).getMonth()] + " " + new Date(res.data[0].from_datetime).getDate() + " @ " + this.timeFormat(res.data[0].checkin) + " - " + this.dayname[new Date(res.data[0].to_datetime).getDay()] + ", " + this.monthname[new Date(res.data[0].to_datetime).getMonth()] + " " + new Date(res.data[0].to_datetime).getDate() + " @ " + this.timeFormat(res.data[0].checkout);
                this.building = res.data[0].building;
                this.roomname = res.data[0].roomname;
                this.rate = res.data[0].rate;
                this.ratetype = res.data[0].rate_type;
                this.room = res.data[0].room;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
    },
}
</script>

<style lang="scss" scoped>

</style>