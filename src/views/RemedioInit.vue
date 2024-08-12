<template>
  <ion-page>
    <ion-header>
      <NavigationMenu />
    </ion-header>
    <ion-content>
      <ion-card id="background">
        <ion-card class="card">
          <h1>Remédios</h1>
          <p>Para registrar um medicamento tomado, clicar nele para registar o horário. Para adicionar novos medicamentos, dirija-se até o fim da página</p>
          <!-- Xarope -->
          <div v-if="xaropeDataWithTimes.length" class="xarope-list">
            <div v-for="item in xaropeDataWithTimes" :key="item.id" :class="['xarope-item', `xarope-${item.cor}`]" @click="openModal('xarope', item)">
              <div class="xarope-info">
                <h1 class="xarope-name" :style="{ color: getColor(item.cor) }">{{ item.nome }}</h1>
                <p>Próximo às: {{ item.proximoAs }}</p>
                <p>Quantidade de doses restante: {{ item.qtddose }}</p>
              </div>
              <img :src="`src/assets/xarope-${item.cor}.png`" :alt="item.cor" class="xarope-image" />
              <div class="buttons-container">
                <ion-button color="primary" @click.stop="editItem('xarope', item)" class="edit-button">
                  <ion-icon :icon="pencilOutline"></ion-icon>
                </ion-button>
                <ion-button color="danger" @click.stop="deleteItem('xarope', item.id)" class="delete-button">
                  <ion-icon :icon="trashOutline"></ion-icon>
                </ion-button>
              </div>
            </div>
          </div>

          <!-- Capsula -->
          <div v-if="capsulaDataWithTimes.length" class="capsula-list">
            <div v-for="item in capsulaDataWithTimes" :key="item.id" :class="['capsula-item', `capsula-${item.cor}`]" @click="openModal('capsula', item)">
              <div class="capsula-info">
                <h1 class="capsula-name" :style="{ color: getColor(item.cor) }">{{ item.nome }}</h1>
                <p>Próximo às: {{ item.proximoAs }}</p>
                <p>Quantidade de cápsulas restantes: {{ item.qtdcapsula }}</p>
              </div>
              <img :src="`src/assets/capsula-${item.cor}.png`" :alt="item.cor" class="capsula-image" />
              <div class="buttons-container">
                <ion-button color="primary" @click.stop="editItem('capsula', item)" class="edit-button">
                  <ion-icon :icon="pencilOutline"></ion-icon>
                </ion-button>
                <ion-button color="danger" @click.stop="deleteItem('capsula', item.id)" class="delete-button">
                  <ion-icon :icon="trashOutline"></ion-icon>
                </ion-button>
              </div>
            </div>
          </div>

          <!-- Comprimido -->
          <div v-if="comprimidoDataWithTimes.length" class="comprimido-list">
            <div v-for="item in comprimidoDataWithTimes" :key="item.id" :class="['comprimido-item', `comprimido-${item.cor}`]" @click="openModal('comprimido', item)">
              <div class="comprimido-info">
                <h1 class="comprimido-name" :style="{ color: getColor(item.cor) }">{{ item.nome }}</h1>
                <p>Próximo às: {{ item.proximoAs }}</p>
                <p>Quantidade de comprimidos restantes: {{ item.qtdcomprimido }}</p>
              </div>
              <img :src="`src/assets/comprimido-${item.cor}.png`" :alt="item.cor" class="comprimido-image" />
              <div class="buttons-container">
                <ion-button color="primary" @click.stop="editItem('comprimido', item)" class="edit-button">
                  <ion-icon :icon="pencilOutline"></ion-icon>
                </ion-button>
                <ion-button color="danger" @click.stop="deleteItem('comprimido', item.id)" class="delete-button">
                  <ion-icon :icon="trashOutline"></ion-icon>
                </ion-button>
              </div>
            </div>
          </div>

          <!-- Botão adicionar -->
          <div class="add-medication" @click="addRemedio">
            <ion-icon :icon="addOutline" size="large"></ion-icon>
          </div>
          <br>
          <p>Para adicionar um novo medicamento clique no círculo acima</p>
        </ion-card>
      </ion-card>

      <!-- Medication Modal -->
      <RemedioModal
        :isOpen="isModalOpen"
        :medicationType="selectedMedicationType"
        :horaInicial="selectedHoraInicial"
        :medicationId="selectedMedicationId"
        :medicationName="selectedNome"
        @update:isOpen="isModalOpen = $event"
      />

    </ion-content>
  </ion-page>
</template>



<script lang="ts">
import router from '@/router';
import { IonButton, IonCard, IonContent, IonHeader, IonIcon, IonPage } from '@ionic/vue';
import axios from 'axios';
import { addOutline, pencilOutline, trashOutline } from 'ionicons/icons';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavigationMenu from '../views/components/NavigationMenu.vue';
import RemedioModal from '../views/modals/RemedioModal.vue';

export default defineComponent({
  name: 'RemedioInit',
  components: {
    IonButton,
    IonHeader,
    IonIcon,
    IonPage,
    IonCard,
    IonContent,
    NavigationMenu,
    RemedioModal
  },
  setup() {
    const xaropeData = ref<any[]>([]);
    const capsulaData = ref<any[]>([]);
    const comprimidoData = ref<any[]>([]);
    const isModalOpen = ref(false);
    const selectedMedicationType = ref('');
    const selectedHoraInicial = ref('');
    const selectedNome = ref('');
    const selectedMedicationId = ref(0);
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

    

    const calculateProximoAs = (horainicial: string | undefined, intervaloTempo: number | undefined): string => {
  if (!horainicial || intervaloTempo === undefined) {
    console.error("horainicial or intervaloTempo is undefined");
    return "00:00:00";
  }

  const horaAtual = new Date();

  const [hours, minutes] = horainicial.split(':').map(Number);
  const horaInicial = new Date();
  horaInicial.setHours(hours, minutes, 0, 0);

  // Converter intervaloTempo de horas para milisegundos
  const intervaloEmMilissegundos = intervaloTempo * 60 * 60 * 1000;

  let proximoAs = new Date(horaInicial);

  if (horaAtual > horaInicial) {
    while (proximoAs <= horaAtual) {
      proximoAs = new Date(proximoAs.getTime() + intervaloEmMilissegundos);
    }
  } else {
    proximoAs = new Date(horaInicial);
  }

  const hoursStr = proximoAs.getHours().toString().padStart(2, '0');
  const minutesStr = proximoAs.getMinutes().toString().padStart(2, '0');
  const secondsStr = proximoAs.getSeconds().toString().padStart(2, '0');

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

const openModal = (type: string, item: any) => {
  selectedMedicationType.value = type;
  selectedHoraInicial.value = item.horainicial || '';
  selectedMedicationId.value = item.id || 0;
  selectedNome.value = item.nome || '';
  isModalOpen.value = true;
};

const refetchData = () => {
    fetchXaropeData();
    fetchCapsulaData();
    fetchComprimidoData();
  };

    watch(route, () => {
      fetchXaropeData();
      fetchCapsulaData();
      fetchComprimidoData();
    });

    watch(isModalOpen, (newVal) => {
    if (!newVal) {
      refetchData();
    }
    });

    onMounted(() => {
      fetchXaropeData();
      fetchCapsulaData();
      fetchComprimidoData();
      refetchData();
    });

    const xaropeDataWithTimes = computed(() => 
      xaropeData.value.map(item => ({
        ...item,
        proximoAs: calculateProximoAs(item.horainicial, item.intervalotempo)
      }))
    );

    const capsulaDataWithTimes = computed(() => 
      capsulaData.value.map(item => ({
        ...item,
        proximoAs: calculateProximoAs(item.horainicial, item.intervalotempo)
      }))
    );

    const comprimidoDataWithTimes = computed(() => 
      comprimidoData.value.map(item => ({
        ...item,
        proximoAs: calculateProximoAs(item.horainicial, item.intervalotempo)
      }))
    );

    const addRemedio = () => {
      router.push('/remedioselect');
      console.log("Add new medication...");
    };

    const editItem = (type: string, item: any) => {
      console.log(`Edit ${type}:`, item);
      let path = '';
      if (type === 'xarope') {
        path = `/editxarope/${item.id}`;
      } else if (type === 'capsula') {
        path = `/editcapsula/${item.id}`;
      } else if (type === 'comprimido') {
        path = `/editcomprimido/${item.id}`;
      }

      router.push(path);
    };

    const deleteItem = async (type: string, id: number) => {
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

    return {
      addOutline,
      pencilOutline,
      trashOutline,
      addRemedio,
      editItem,
      deleteItem,
      xaropeDataWithTimes,
      capsulaDataWithTimes,
      comprimidoDataWithTimes,
      getColor,
      isModalOpen,
      openModal,
      selectedMedicationType,
      selectedHoraInicial,
      selectedMedicationId,
      selectedNome
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
  font-size: 30px;
  color: #034F67;
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

.buttons-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.edit-button, .delete-button {
  margin: 0 5px;
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


