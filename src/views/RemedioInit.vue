<template>
  <ion-page>
    <ion-header>
      <NavigationMenu />
    </ion-header>
    <ion-content>
      <ion-card id="background">
        <ion-card class="card">
          <div v-if="xaropeData" class="xarope-list">
            <div v-for="item in xaropeData" :key="item.id" :class="['xarope-item', `xarope-${item.cor}`]">
              <div class="xarope-info">
                <h1 class="xarope-name" :style="{ color: getColor(item.cor) }">{{ item.nome }}</h1>
              </div>
              <img :src="`src/assets/xarope-${item.cor}.png`" :alt="item.cor" class="xarope-image" />
            </div>
          </div>
          <div v-if="capsulaData" class="capsula-list">
            <div v-for="item in capsulaData" :key="item.id" :class="['capsula-item', `capsula-${item.cor}`]">
              <div class="capsula-info">
                <h1 class="capsula-name" :style="{ color: getColor(item.cor) }">{{ item.nome }}</h1>
              </div>
              <img :src="`src/assets/capsula-${item.cor}.png`" :alt="item.cor" class="capsula-image" />
            </div>
          </div>
          <div v-if="comprimidoData" class="comprimido-list">
            <div v-for="item in comprimidoData" :key="item.id" :class="['comprimido-item', `comprimido-${item.cor}`]">
              <div class="comprimido-info">
                <h1 class="comprimido-name" :style="{ color: getColor(item.cor) }">{{ item.nome }}</h1>
              </div>
              <img :src="`src/assets/comprimido-${item.cor}.png`" :alt="item.cor" class="comprimido-image" />
            </div>
          </div>
          <div class="add-medication" @click="addRemedio">
            <ion-icon :icon="addOutline" size="large"></ion-icon>
          </div>
          <br>
          <p>Para adicionar um novo medicamento clique no círculo acima</p>
        </ion-card>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { IonButton, IonHeader, IonIcon, IonPage, IonCard, IonContent } from '@ionic/vue';
import NavigationMenu from '../views/components/NavigationMenu.vue';
import { addOutline } from 'ionicons/icons';
import axios from 'axios';
import router from '@/router';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'RemedioInit',
  components: {
    IonButton,
    IonHeader,
    IonIcon,
    IonPage,
    IonCard,
    IonContent,
    NavigationMenu
  },
  setup() {
    const xaropeData = ref<any[]>([]);
    const capsulaData = ref<any[]>([]);
    const comprimidoData = ref<any[]>([]);
    const route = useRoute();

    const fetchXaropeData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/xarope'); 
        xaropeData.value = response.data;
        console.log(xaropeData.value);
      } catch (error) {
        console.error("Error fetching xarope data:", error);
      }
    };

    const fetchCapsulaData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/capsula'); 
        capsulaData.value = response.data;
        console.log(capsulaData.value);
      } catch (error) {
        console.error("Error fetching capsula data:", error);
      }
    };

    const fetchComprimidoData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/comprimido'); 
        comprimidoData.value = response.data;
        console.log(comprimidoData.value);
      } catch (error) {
        console.error("Error fetching comprimido data:", error);
      }
    };

    onMounted(() => {
      fetchXaropeData();
      fetchCapsulaData();
      fetchComprimidoData();
    });

    
    watch(route, () => {
      fetchXaropeData();
      fetchCapsulaData();
    });

    const addRemedio = () => {
      router.push('/remedioselect');
      console.log("Add new medication...");
    };

    const getColor = (color: string) => {
      const colorMap: Record<string, string> = {
        roxo: '#6A0D91',
        verde: '#228B22',
        azul: '#0000FF',
        vermelho: '#FF0000'
      };
      return colorMap[color] || '#000000';
    };

    return {
      addOutline,
      addRemedio,
      xaropeData,
      capsulaData,
      comprimidoData,
      getColor
    };
  }
});
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Kufam);

p {
  font-family: "Kufam";
  color: #034F67;
  font-size: large;
  text-align: center;
  margin: 2%;
}

h1{
  font-family: "Kufam";
  font-size: 20px;
}

#background {
  min-height: 95%; 
  background-color: #E7F7F4;
  display: flex; 
  align-items: center;
  justify-content: center;
}

.card {
  min-height: 650px;
  width: 95%; 
  background-color: #ffffff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.xarope-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px; 
}

.xarope-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
}

.xarope-image {
  width: 200px;
  height: 200px;
  margin-top: 10px; 
}

.xarope-info {
  display: flex;
  flex-direction: column; 
  align-items: center;
}

.xarope-name {
  font-family: "Kufam";
  font-size: 25px;
  text-align: center;
}

.add-medication {
  background-color: #C6ADD9;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-medication ion-icon {
  color: #9C78B8;
  font-size: 500px;
}

ion-content {
  --background: #E5F0F7 !important;
  --color: black;
}
.capsula-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px; 
}

.capsula-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
}

.capsula-image {
  width: 200px;
  height: 200px;
  margin-top: 10px; 
}

.capsula-info {
  display: flex;
  flex-direction: column; 
  align-items: center;
}

.capsula-name {
  font-family: "Kufam";
  font-size: 25px;
  text-align: center;
}

.comprimido-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px; 
}

.comprimido-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
}

.comprimido-image {
  width: 200px;
  height: 200px;
  margin-top: 10px; 
}

.comprimido-info {
  display: flex;
  flex-direction: column; 
  align-items: center;
}

.comprimido-name {
  font-family: "Kufam";
  font-size: 25px;
  text-align: center;
}
</style>

