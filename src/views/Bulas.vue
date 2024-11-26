<script lang="ts">
import { defineComponent, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
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

    const resetData = () => {
      medicamento.value = '';
      searchResults.value = [];
      splData.value = null;
    };

    onBeforeRouteLeave(() => {
      resetData();
    });

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
        const response = await axios.get(`https://api.fda.gov/drug/ndc.json?search=brand_name:${medicamento.value}&limit=5`);
        if (response.data.results && response.data.results.length > 0) {
          searchResults.value = response.data.results;
          splSetId.value = response.data.spl_id;
          console.log(splSetId);
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
        const response = await axios.get(`https://api.fda.gov/drug/ndc.json?search=openfda.spl_set_id:${splSetId}`);
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
              <ion-item
                v-for="(med, index) in searchResults"
                :key="index"
                @click="fetchSPLData(med.openfda.spl_set_id[0])"
              >
                <ion-label>
                  <h1>{{ med.generic_name }}</h1>
                  <h2>{{ med.brand_name }}</h2>
                </ion-label>
              </ion-item>
            </ion-list>
          </div>

          <!-- SPL  -->
          <div v-if="splData">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ splData.generic_name }}</ion-card-title>
                <ion-card-subtitle>{{ splData.brand_name }}</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <p><strong>Ingrediente ativo:</strong> {{ splData.active_ingredients[0].name }}</p>
                <p><strong>Força:</strong> {{ splData.active_ingredients[0].strength }}</p>
                <p><strong>Forma de dosagem:</strong> {{ splData.dosage_form }}</p>
                <p><strong>Categoria de Marketing:</strong> {{ splData.marketing_category }}</p>
                <p><strong>Rota de Administração:</strong> {{ splData.route.join(', ') }}</p>
                <p><strong>Fabricante:</strong> {{ splData.openfda.manufacturer_name[0] }}</p>
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

h1{
  color: #034F67;
  font-family: 'Literata';
  font-size: medium;
  text-align: center;
}

h2 {
  font-family: "Kufam";
  color: black;
  font-size: small;
  text-align: center;
}

</style>
