<template>
  <header>
    <div class="container mx-auto px-6">
      <h1>IP Adress Tracker</h1>

      <!-- The Input Field -->
      <form @submit.prevent="getMapInfo">
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
        class="
          bg-white
          mt-5
          rounded-xl
          z-20
          justify-around
          gap-5
          py-5
          md:p-6
          grid
          md:grid-cols-4
          relative
          max-w-5xl
          mx-auto
          shadow-xl
        "
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
              >{{ info.location.city }}, {{ info.location.country }}
              {{ info.location.postalCode }}</span
            >
            <span v-else>Fetching Data...</span>
          </p>
        </article>

        <article class="md:border-r-2 md:pl-3">
          <h4 class="info-title">timezone</h4>
          <p class="info-content">
            {{ loading ? "UTC " + info.location.timezone : "Fetching Data..." }}
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
    };
  },
  methods: {
    async getMapInfo() {
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
        leaflet.map("map").setView([this.latitude, this.longitude], 9);
        leaflet.marker([this.latitude, this.longitude]).addTo(map);
      } catch (error) {
        console.error(error.message);
      }
    },
  },
  async created() {
    console.log("component created");
    try {
      let res1 = await axios.get("https://api.ipify.org/?format=json");
      let res = await axios.get(`${this.baseUrl}&ipAddress=${res1.data.ip}`);
      this.info = res.data;
      this.loading = true;
    } catch (error) {
      console.error(error.message);
    }
  },
  //Map
  mounted() {
    try {
      const map = leaflet.map("map").setView([6.45407, 3.39467], 9);
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "© OpenStreetMap",
        })
        .addTo(map);
      leaflet.marker([6.45407, 3.39467]).addTo(map);
    } catch (error) {
      console.error(error.message);
    }

    // Leaflet Icon
    // var locationIcon = L.icon({
    //   iconUrl: "@/assets/images/icon-location.svg",

    //   iconSize: [38, 95], // size of the icon
    //   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    //   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    // });
    // leaflet
    //   .marker([this.latitude, this.longitude], { icon: locationIcon })
    //   .addTo(map);
  },
};
</script>
