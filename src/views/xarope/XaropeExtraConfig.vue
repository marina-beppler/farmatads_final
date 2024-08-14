<script lang="ts">
import {
  IonButton, IonButtons,
  IonCard, IonContent,
  IonHeader, IonIcon,
  IonImg,
  IonInput, IonItem, IonLabel,
  IonPage,
  IonToolbar,
  toastController
} from '@ionic/vue';
import axios from 'axios';
import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'XaropeExtraConfig',
  components: {
    IonButton,
    IonButtons,
    IonIcon,
    IonPage,
    IonHeader,
    IonCard,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonToolbar,
    IonImg
  },
  setup() {
    const router = useRouter();

    const remedio = ref('');
    const intervalo = ref(0);
    const selectedColor = ref('vermelho');
    const selectedTime = ref('');
    const dose = ref(0);
    const qtdDoses = ref(0);

    const presentToast = async (message: string) => {
            const toast = await toastController.create({
                message: message,
                duration: 1500
            });
            toast.present();
        };


    const colors = [
      { name: 'azul', hex: '#549EC9' },
      { name: 'vermelho', hex: '#C95554' },
      { name: 'amarelo', hex: '#FFDD54' },
      { name: 'verde', hex: '#52C957' },
      { name: 'roxo', hex: '#B02AAA' }
    ];

    onMounted(() => {
      const xaropeConfig = JSON.parse(localStorage.getItem('xaropeConfig') || '{}');
      remedio.value = xaropeConfig.remedio || '';
      selectedTime.value = xaropeConfig.selectedTime || '';
      dose.value = xaropeConfig.dose || 0;
      qtdDoses.value = xaropeConfig.qtdDoses || 0;
    });

    const incrementIntervalo = () => {
      intervalo.value++;
    };

    const decrementIntervalo = () => {
      if (intervalo.value > 0) {
        intervalo.value--;
      }
    };

    const backButton = () => {
      router.push("/xaropeconfig");
    };

    const saveXarope = async () => {
      const extractTime = (datetime: string): string => {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}:00`;
      };

      const xaropeConfig = JSON.parse(localStorage.getItem('xaropeConfig') || '{}');
      const data = {
        tipo: 1,
        nome: remedio.value,
        horaInicial: extractTime(selectedTime.value), 
        intervaloTempo: intervalo.value,
        cor: selectedColor.value,
        dosagem: xaropeConfig.dose,
        qtdDose: xaropeConfig.qtdDoses
      };

      try {
        await axios.post('http://10.0.2.2:3000/xarope', data);
      } catch (error) {
        console.error('Failed to save xarope:', error);
        presentToast('Erro ao salvar medicamento!');
      }
    };

    const goToNextPage = async () => {
      try {
        await saveXarope();
        localStorage.removeItem('selectedMedicationType');
        localStorage.removeItem('xaropeConfig');
        router.push("/remedios");
      } catch (error) {
        console.error('Failed to save xarope:', error);
        presentToast('Erro ao salvar medicamento!');
      }
    };

    const selectColor = (color: string) => {
      selectedColor.value = color;
    };

    return {
      arrowBackOutline,
      arrowForwardOutline,
      remedio,
      intervalo,
      decrementIntervalo,
      incrementIntervalo,
      selectedTime,
      backButton,
      goToNextPage,
      selectedColor,
      colors,
      selectColor
    };
  }
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-button @click="backButton">
            <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card id="background">
        <ion-card class="card">
          <p>Informe os dados abaixo:</p>
          <ion-label class="label-style">Intervalo de tempo:</ion-label>
          <ion-item lines="none" class="counter-item">
            <ion-button @click="decrementIntervalo">-</ion-button>
            <ion-input readonly :value="`${intervalo} h`"></ion-input>
            <ion-button @click="incrementIntervalo">+</ion-button>
          </ion-item>
          <br>
          <ion-label class="label-style">Cor:</ion-label>
          <ion-item lines="none" class="color-selector">
            <div v-for="color in colors" :key="color.name" 
                 :style="{ backgroundColor: color.hex }"
                 class="color-dot"
                 :class="{ selected: selectedColor === color.name }"
                 @click="selectColor(color.name)">
            </div>
          </ion-item>
          <br>
          <ion-img id="xarope" :src="`assets/xarope-${selectedColor}.png`"/>
          <br>
          <ion-card id="center">
            <ion-button @click="goToNextPage">
              Salvar
            </ion-button>
          </ion-card>
        </ion-card>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Kufam);

p {
  font-family: "Kufam";
  color: #034F67;
  font-size: large;
  margin: 2%;
  margin-top: 5%;
}

#background {
  min-height: 650px;
  background-color: #E7F7F4;
}

.card {
  margin: auto;
  height: 100%;
  background-color: #ffffff;
  padding: 10px;
}

.label-style {
  font-family: "Kufam";
  font-size: medium;
  color: black;
  margin: 10%;
  margin-left: 2%;
}

ion-button {
  --background-activated: #bf9dda;
  --background: #C6ADD9;
  --color: black;
}

ion-content {
  --background: #E5F0F7 !important;
  --color: black;
}

ion-item {
  --background: #E5F0F7 !important;
  --color: black;
}

ion-toolbar {
  --background: #BEDDF0 !important;
  --color: black;
}

.counter-item {
  display: flex;
  align-items: center;
}

.counter-item ion-input {
  text-align: center;
  flex: 1;
}

.counter-item ion-button {
  --padding-start: 10px;
  --padding-end: 10px;
}

.color-selector {
  display: flex;
  gap: 10px;
  justify-content: space-between; 
}

.color-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
}

.color-dot.selected {
  border: 2px solid black;
}

#center {
  text-align: center;
  margin: auto;
  background-color: #FFFFFF;
  box-shadow: none;
}
</style>
