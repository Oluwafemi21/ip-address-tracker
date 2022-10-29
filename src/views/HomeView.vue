<template>
    <header>
        <div class="container mx-auto px-6">
            <h1>IP Address Tracker</h1>

            <!-- The Input Field -->
            <form @submit.prevent="getIpInfo">
                <input
                    type="text"
                    placeholder="Search for any IP address or domain"
                    v-model="ipAddress"
                />
                <button>
                    <img src="@/assets/images/icon-arrow.svg" alt="" />
                </button>
            </form>
            <!-- The Information card -->
            <section
                class="bg-white mt-5 rounded-xl z-20 justify-around gap-5 py-5 md:p-6 grid md:grid-cols-4 relative max-w-5xl mx-auto shadow-xl"
            >
                <article class="md:border-r-2">
                    <h4 class="info-title">ip address</h4>
                    <p class="info-content">
                        {{ loading ? info.ip : "Fetching Data..." }}
                    </p>
                </article>

                <article class="md:border-r-2 md:pl-3">
                    <h4 class="info-title">location</h4>
                    <p class="info-content md:max-w-[150px]">
                        <span v-if="loading"
                            >{{ info.location.city }},
                            {{ info.location.country }}
                            {{ info.location.postalCode }}</span
                        >
                        <span v-else>Fetching Data...</span>
                    </p>
                </article>

                <article class="md:border-r-2 md:pl-3">
                    <h4 class="info-title">timezone</h4>
                    <p class="info-content">
                        {{
                            loading
                                ? "UTC " + info.location.timezone
                                : "Fetching Data..."
                        }}
                    </p>
                </article>

                <article class="md:pl-3">
                    <h4 class="info-title">isp</h4>
                    <p class="info-content md:max-w-[120px]">
                        {{ loading ? info.isp : "Fetching Data..." }}
                    </p>
                </article>
            </section>
        </div>
    </header>

    <!-- The Map Area -->
    <div id="map" class="z-10 h-full"></div>
</template>

<script>
const baseUrl =
    "https://geo.ipify.org/api/v2/country,city?apiKey=at_bOSscDqFSmOdnrxhvzbbWOkw5VcAf";

// Importing Dependencies
import axios from "axios";
import leaflet from "leaflet";

export default {
    name: "HomeView",
    data() {
        return {
            info: [],
            baseUrl,
            ipAddress: "",
            loading: false,
            latitude: "",
            longitude: "",
            map: null,
        };
    },
    methods: {
        async getPersonalIpInfo() {
            this.loading = false;
            try {
                let res = await axios.get(`${this.baseUrl}`);
                this.info = res.data;
                this.ipAddress = this.info.ip;
                this.latitude = this.info.location.lat;
                this.longitude = this.info.location.lng;

                this.loading = true;
                this.map.setView([this.latitude, this.longitude], 9);
                leaflet
                    .tileLayer(
                        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        {
                            maxZoom: 18,
                            attribution: "© OpenStreetMap",
                        }
                    )
                    .addTo(this.map);
                leaflet.marker([this.latitude, this.longitude]).addTo(this.map);
                this.ipAddress = "";
            } catch (error) {
                console.error(error.message);
            }
        },
        async getIpInfo() {
            if (this.ipAddress !== "") {
                this.loading = false;
                try {
                    let res = await axios.get(
                        `${this.baseUrl}&ipAddress=${this.ipAddress}`
                    );
                    this.info = res.data;
                    this.ipAddress = "";
                    this.latitude = this.info.location.lat;
                    this.longitude = this.info.location.lng;

                    this.loading = true;
                    this.map.setView([this.latitude, this.longitude], 9);

                    leaflet
                        .tileLayer(
                            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            {
                                maxZoom: 18,
                                attribution: "© OpenStreetMap",
                            }
                        )
                        .addTo(this.map);
                    leaflet
                        .marker([this.latitude, this.longitude])
                        .addTo(this.map);
                } catch (error) {
                    console.error(error.message);
                }
            }
        },
    },

    //Map
    mounted() {
        this.map = leaflet.map("map");
        this.getPersonalIpInfo();
    },
};
</script>
