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
                <Calendar v-if="load" ref="calendar" @update:to-page="movePage" :attributes="attributes" is-expanded />
            </div>
            <div>
                <ion-segment @ionChange="segmentChanged($event)" v-model="segment">
                    <ion-segment-button value="active">
                        Active
                    </ion-segment-button>
                    <ion-segment-button value="past">
                        Past
                    </ion-segment-button>
                </ion-segment>
            </div>
            <div v-if="segment == 'active'">
                <ion-list>
                    <ion-list-header>
                        <ion-label>
                            <h2>Active appointments this month</h2>
                        </ion-label>
                    </ion-list-header>
                    <ion-item button v-for="appointment, index of activeappointments" :key="appointment + index" @click="bookedDetail(appointment.id)">
                        <ion-label>
                            <h2>{{ appointment.startday }}, {{ appointment.startdate }} @ {{ timeFormat(appointment.checkin) }}  - {{ appointment.endday }}, {{ appointment.enddate }} @ {{ timeFormat(appointment.checkout) }}</h2>
                            <h3>{{ appointment.building }}</h3>
                            <p>Booked {{ appointment.room }} 
                                <span v-if="appointment.room == 1">room</span>
                                <span v-else>rooms</span>
                                at {{ appointment.roomname }} <br> Rate of ₱ {{ formatPrice(appointment.rate) }} {{ appointment.rate_type }}
                            </p>
                            <h2>Status: {{ appointment.statusname }}</h2>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </div>
            <div v-if="segment == 'past'">
                <ion-list>
                    <ion-list-header>
                        <ion-label>
                            <h2>Past appointments this month</h2>
                        </ion-label>
                    </ion-list-header>
                    <ion-item button v-for="appointment, index of pastappointments" :key="appointment + index" @click="bookedDetail(appointment.id)">
                        <ion-label>
                            <h2>{{ appointment.startday }}, {{ appointment.startdate }} @ {{ timeFormat(appointment.checkin) }}  - {{ appointment.endday }}, {{ appointment.enddate }} @ {{ timeFormat(appointment.checkout) }}</h2>
                            <h3>{{ appointment.building }}</h3>
                            <p>Booked {{ appointment.room }} 
                                <span v-if="appointment.room == 1">room</span>
                                <span v-else>rooms</span>
                                at {{ appointment.roomname }} <br> Rate of ₱ {{ formatPrice(appointment.rate) }} {{ appointment.rate_type }}
                            </p>
                            <h2>Status: {{ appointment.statusname }}</h2>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton, IonList, IonListHeader, IonLabel, IonSegment, IonSegmentButton } from "@ionic/vue";
import { Calendar } from 'v-calendar';
import Global from "../components/Global";
import axios from "axios";

export default {
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton, IonList, IonListHeader, IonLabel, IonSegment, IonSegmentButton, Calendar,
    },
    data() {
        return {
            dayname: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            monthname: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            attributes: [],
            activeattributes: [],
            pastattributes: [],
            activeappointments: [],
            pastappointments: [],
            load: false,
            segment: "active",
            userid: "",
        };
    },
    created() {
        if (typeof localStorage.user !== "undefined") {
            this.userid = JSON.parse(localStorage.user)[0].id;
        }
    },
    beforeMount() {
        this.loadAllBooked(new Date().getMonth() + 1);
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
        loadAllBooked(month) {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/user_booked_room", {
                userid: this.userid,
                month: month,
            }).then(res => {
                this.activeappointments = [];
                this.pastappointments = [];
                this.attributes = [];
                this.activeattributes = [];
                this.pastattributes = [];
                res.data.active.forEach(x => {
                    this.activeappointments.push({
                        id: x.id,
                        startday: this.dayname[new Date(x.from_datetime).getDay()],
                        endday: this.dayname[new Date(x.to_datetime).getDay()],
                        startdate: this.monthname[new Date(x.from_datetime).getMonth()] + " " + new Date(x.from_datetime).getDate(),
                        enddate: this.monthname[new Date(x.to_datetime).getMonth()] + " " + new Date(x.to_datetime).getDate(),
                        room: x.room,
                        building: x.building,
                        roomname: x.roomname,
                        rate: x.rate,
                        rate_type: x.rate_type,
                        statusname: x.statusname,
                        checkin: x.checkin,
                        checkout: x.checkout,
                    });
                    if (x.status_id == 1) {
                        this.activeattributes.push({
                            popover: {
                                label: "Status: Pending",
                            },
                            highlight: {
                                color: "orange",
                                fillMode: "solid",
                            },
                            dates: [{
                                start: new Date(x.from_datetime),
                                end: new Date(x.to_datetime)
                            }]
                        });
                    } else if (x.status_id == 2) {
                        this.activeattributes.push({
                            popover: {
                                label: "Status: Ongoing",
                            },
                            highlight: {
                                color: "blue",
                                fillMode: "solid",
                            },
                            dates: [{
                                start: new Date(x.from_datetime),
                                end: new Date(x.to_datetime)
                            }]
                        });
                    }
                });
                res.data.past.forEach(x => {
                    this.pastappointments.push({
                        id: x.id,
                        startday: this.dayname[new Date(x.from_datetime).getDay()],
                        endday: this.dayname[new Date(x.to_datetime).getDay()],
                        startdate: this.monthname[new Date(x.from_datetime).getMonth()] + " " + new Date(x.from_datetime).getDate(),
                        enddate: this.monthname[new Date(x.to_datetime).getMonth()] + " " + new Date(x.to_datetime).getDate(),
                        room: x.room,
                        building: x.building,
                        roomname: x.roomname,
                        rate: x.rate,
                        rate_type: x.rate_type,
                        statusname: x.statusname,
                        checkin: x.checkin,
                        checkout: x.checkout,
                    });
                    if (x.status_id == 3) {
                        this.pastattributes.push({
                            popover: {
                                label: "Status: Completed",
                            },
                            highlight: {
                                color: "green",
                                fillMode: "solid",
                            },
                            dates: [{
                                start: new Date(x.from_datetime),
                                end: new Date(x.to_datetime)
                            }]
                        });
                    } else if (x.status_id == 4) {
                        this.pastattributes.push({
                            popover: {
                                label: "Status: Declined",
                            },
                            highlight: {
                                color: "red",
                                fillMode: "solid",
                            },
                            dates: [{
                                start: new Date(x.from_datetime),
                                end: new Date(x.to_datetime)
                            }]
                        });
                    }
                     else if (x.status_id == 5) {
                        this.pastattributes.push({
                            popover: {
                                label: "Status: Cancelled",
                            },
                            highlight: {
                                color: "red",
                                fillMode: "solid",
                            },
                            dates: [{
                                start: new Date(x.from_datetime),
                                end: new Date(x.to_datetime)
                            }]
                        });
                    }
                });
                if (this.segment == "active") {
                    this.attributes = this.activeattributes;
                } else {
                    this.attributes = this.pastattributes;
                }
                this.load = true;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
        movePage() {
            const calendar = this.$refs.calendar;
            if (typeof calendar !== "undefined") {
                this.loadAllBooked(calendar.pages[0].month);
            }
        },
        segmentChanged(e) {
            if (e.detail.value == "active") {
                this.attributes = this.activeattributes;
            } else {
                this.attributes = this.pastattributes;
            }
        },
        bookedDetail(id) {
            this.$router.push({ name: "BookedDetail", params: { orderid: id }});
        }
    },
}
</script>

<style lang="scss" scoped>

</style>