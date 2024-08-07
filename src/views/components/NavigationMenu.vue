<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonToolbar, IonTabBar, IonTabButton, IonLabel, IonIcon
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { alarm } from 'ionicons/icons';

export default defineComponent({
  name: 'NavigationMenu',
  components: {
    IonToolbar,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon
  },
  setup() {
    const router = useRouter();

    const goToRemedios = () => {
      router.push("/remedios");
    };

    const goToBulas = () => {
      router.push("/bulas");
    };

    const goToAlarmes = () => {
      router.push("/alarmes");
    };

    return {
      goToRemedios,
      goToBulas,
      goToAlarmes,
      alarm
    };
  }
});
</script>

<template>
  <ion-toolbar>
    <ion-tab-bar>
      <ion-tab-button @click="goToRemedios">
        <ion-label id="remedios">Remédios</ion-label>
      </ion-tab-button>
      <ion-tab-button @click="goToBulas">
        <ion-label id="bulas">Bulas</ion-label>
      </ion-tab-button>
      <ion-tab-button @click="goToAlarmes">
        <ion-icon size="large" :icon="alarm"></ion-icon>
        <ion-label></ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-toolbar>
</template>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Kufam);

ion-toolbar {
  --background: #BEDDF0 !important;
  --color: black;
}

ion-tab-bar {
  --background: #BEDDF0 !important;
  --color: black;
}

ion-tab-button {
  --background: #C6ADD9;
  --color: black;
}

ion-tab-button[selected] {
  --background: #bf9dda;
  --color: white;
}

#remedios{
  font-size: large;
  font-family: "Kufam";
  color: black;
}

#bulas{
  font-size: large;
  font-family: "Kufam";
  color: black;
}
</style>
