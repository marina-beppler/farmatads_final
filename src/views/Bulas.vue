<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import {
  IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonInput, IonItem,
  IonCard, IonPage, IonContent, toastController, IonLabel, IonList, IonNote
} from '@ionic/vue';
import { searchOutline } from 'ionicons/icons';
import NavigationMenu from '../views/components/NavigationMenu.vue';

export default defineComponent({
  name: "Bulas",
  components: {
    IonHeader, 
    IonToolbar, 
    IonButton, 
    IonIcon, 
    IonButtons, 
    IonInput,
    IonItem, 
    IonCard, 
    IonPage, 
    IonContent, 
    NavigationMenu, 
    IonLabel, 
    IonList, 
    IonNote
  },
  setup() {
    const medicamento = ref('');
    const splSetId = ref('');
    const searchResults = ref<any[]>([]);
    const splData = ref<any | null>(null); 
    const searchOutlineIcon = searchOutline;

    const presentToast = async (message: string) => {
      const toast = await toastController.create({
        message,
        duration: 1500
      });
      toast.present();
    };

    const searchMedicamento = async () => {
      if (!medicamento.value) {
        presentToast('Por favor, digite o nome do medicamento.');
        return;
      }
      try {
        const response = await axios.get(`https://api.fda.gov/drug/ndc.json?search=brand_name:${medicamento.value}&limit=3`);
        if (response.data.results && response.data.results.length > 0) {
          searchResults.value = response.data.results;
          splSetId.value = response.data.spl_id;
          presentToast('id ok, ${splSetId}');
        } else {
          searchResults.value = [];
          presentToast('Nenhum medicamento encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        presentToast('Erro ao buscar medicamento!');
      }
    };

    const fetchSPLData = async (splSetId: string) => {
      try {
        const response = await axios.get(`https://api.fda.gov/drug/ndc.json?search=spl_id:${splSetId}`);
        if (response.data.results && response.data.results.length > 0) {
          splData.value = response.data.results[0];
        } else {
          splData.value = null;
          presentToast('Dados da bula não encontrados.');
        }
      } catch (error) {
        console.error('Erro ao obter a bula do medicamento:', error);
        presentToast('Erro ao obter a bula!');
      }
    };

    return {
      medicamento,
      searchOutlineIcon,
      searchMedicamento,
      searchResults,
      splData,
      fetchSPLData
    };
  }
});
</script>

<template>
  <ion-page>
    <ion-header>
      <NavigationMenu />
    </ion-header>
    <ion-content>
      <ion-card id="background">
        <ion-card class="card">
          <div id="pesquisar">
            <ion-item id="pesquisar" lines="none">
              <ion-button @click="searchMedicamento">
                <ion-icon :icon="searchOutlineIcon" slot="start" size="large"></ion-icon>
              </ion-button>
              <ion-input v-model="medicamento" placeholder="Digite o nome do medicamento" required></ion-input>
            </ion-item>
          </div>
          <p>Clique no campo acima para pesquisar o medicamento desejado. Para pesquisar, clique na lupa!</p>
          
          <div v-if="searchResults.length">
            <ion-list>
              <ion-item v-for="med in searchResults" :key="med.spl_id" @click="fetchSPLData(med.spl_id)">
                <ion-label>
                  <h3>{{ med.brand_name }}</h3>
                </ion-label>
              </ion-item>
            </ion-list>
          </div>

          <!-- Display SPL Data -->
          <div v-if="splData">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ splData.brand_name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p><strong>Ingrediente ativo</strong> {{ splData.active_ingredient }}</p>
                <p><strong>Descrição:</strong> {{ splData.product_label }}</p>
                <p><strong>Indicação:</strong> {{ splData.indication }}</p>
                <!-- Add more fields based on available SPL data -->
              </ion-card-content>
            </ion-card>
          </div>
        </ion-card>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<style scoped>
p {
  font-family: "Kufam";
  color: #034F67;
  font-size: medium;
  margin-top: 10%;
  margin-left: 2%;
  margin-right: 2%;
  text-align: center;
}

#background {
  height: auto;
  min-height: 95%; 
  background-color: #E7F7F4;
}

.card {
  margin: auto;
  background-color: #ffffff;
  min-height: 700px;
  padding: 10px;
}

#pesquisar {
  background-color: #E7F7F4;
  font-size: large;
}

ion-button {
  --background: #E7F7F4;
  --box-shadow: 0;
}

ion-icon {
  color: black;
}

ion-item {
  --background: #E7F7F4 !important;
  --color: black;
  --ion-item-background: #E7F7F4 !important;
}

ion-list {
  --background: #E7F7F4 !important;
}
</style>
