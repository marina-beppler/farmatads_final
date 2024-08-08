<template>
  <ion-page>
    <ion-header>
      <NavigationMenu />
    </ion-header>
    <ion-content>
      <ion-card id="background">
        <ion-card class="card">
          <!-- Xarope List -->
          <div v-if="xaropeData.length" class="xarope-list">
            <div v-for="item in xaropeData" :key="item.id" :class="['xarope-item', `xarope-${item.cor}`]">
              <div class="xarope-info">
                <h1 class="xarope-name" :style="{ color: getColor(item.cor) }">{{ item.nome }}</h1>
              </div>
              <img :src="`src/assets/xarope-${item.cor}.png`" :alt="item.cor" class="xarope-image" />
              <ion-button color="danger" @click="deleteItem('xarope', item.id)" class="delete-button">
                <ion-icon :icon="trashOutline"></ion-icon>
              </ion-button>
            </div>
          </div>

          <!-- Capsula List -->
          <div v-if="capsulaData.length" class="capsula-list">
            <div v-for="item in capsulaData" :key="item.id" :class="['capsula-item', `capsula-${item.cor}`]">
              <div class="capsula-info">
                <h1 class="capsula-name" :style="{ color: getColor(item.cor) }">{{ item.nome }}</h1>
              </div>
              <img :src="`src/assets/capsula-${item.cor}.png`" :alt="item.cor" class="capsula-image" />
              <ion-button color="danger" @click="deleteItem('capsula', item.id)" class="delete-button">
                <ion-icon :icon="trashOutline"></ion-icon>
              </ion-button>
            </div>
          </div>

          <!-- Comprimido List -->
          <div v-if="comprimidoData.length" class="comprimido-list">
            <div v-for="item in comprimidoData" :key="item.id" :class="['comprimido-item', `comprimido-${item.cor}`]">
              <div class="comprimido-info">
                <h1 class="comprimido-name" :style="{ color: getColor(item.cor) }">{{ item.nome }}</h1>
              </div>
              <img :src="`src/assets/comprimido-${item.cor}.png`" :alt="item.cor" class="comprimido-image" />
              <ion-button color="danger" @click="deleteItem('comprimido', item.id)" class="delete-button">
                <ion-icon :icon="trashOutline"></ion-icon>
              </ion-button>
            </div>
          </div>

          <!-- Add Medication Button -->
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
import { addOutline, trashOutline } from 'ionicons/icons';
import axios from 'axios';
import router from '@/router';
import { useRoute } from 'vue-router';
import { alertController } from '@ionic/vue';

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
      } catch (error) {
        console.error("Error fetching xarope data:", error);
      }
    };

    const fetchCapsulaData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/capsula'); 
        capsulaData.value = response.data;
      } catch (error) {
        console.error("Error fetching capsula data:", error);
      }
    };

    const fetchComprimidoData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/comprimido'); 
        comprimidoData.value = response.data;
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
      fetchComprimidoData();
    });

    const addRemedio = () => {
      router.push('/remedioselect');
    };

    const getColor = (color: string) => {
      const colorMap: Record<string, string> = {
        roxo: '#6A0D91',
        verde: '#228B22',
        azul: '#0000FF',
        vermelho: '#FF0000',
        amarelo: '#FFDD54'
      };
      return colorMap[color] || '#000000';
    };

    const deleteItem = async (type: string, id: number) => {
      const confirm = await presentAlertConfirm(type, id);
      if (!confirm) return;

      try {
        await axios.delete(`http://localhost:3000/${type}/${id}`);
        if (type === 'xarope') {
          fetchXaropeData();
        } else if (type === 'capsula') {
          fetchCapsulaData();
        } else if (type === 'comprimido') {
          fetchComprimidoData();
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    };

    const presentAlertConfirm = async (type: string, id: number) => {
      const alert = await alertController.create({
        header: 'Confirmar Exclusão',
        message: 'Você tem certeza que deseja excluir este item?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          },
          {
            text: 'Excluir',
            handler: () => {
              return true;
            }
          }
        ]
      });

      await alert.present();
      const { role } = await alert.onDidDismiss();
      return role !== 'cancel';
    };

    return {
      addOutline,
      trashOutline,
      addRemedio,
      xaropeData,
      capsulaData,
      comprimidoData,
      getColor,
      deleteItem
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

h1 {
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

.xarope-list, .capsula-list, .comprimido-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px; 
}

.xarope-item, .capsula-item, .comprimido-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
}

.xarope-image, .capsula-image, .comprimido-image {
  width: 200px;
  height: 200px;
  margin-top: 10px; 
}

.xarope-info, .capsula-info, .comprimido-info {
  display: flex;
  flex-direction: column; 
  align-items: center;
}

.xarope-name, .capsula-name, .comprimido-name {
  font-family: "Kufam";
  font-size: 25px;
  text-align: center;
}

.delete-button {
  margin-top: 10px;
  align-self: center;
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
</style>

