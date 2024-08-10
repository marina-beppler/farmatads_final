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
          <ion-card class="center">
            <h3>Editar Xarope</h3>
          </ion-card>
          <p>Atualize os dados abaixo:</p>
          <ion-label class="label-style">Nome:</ion-label>
          <ion-item lines="none">
            <ion-input v-model="remedio" />
          </ion-item>
          <br />
          <ion-label class="label-style">Dosagem (ml):</ion-label>
          <ion-item lines="none" class="counter-item">
            <ion-button @click="decrementDose">-</ion-button>
            <ion-input readonly :value="`${dose} ml`"></ion-input>
            <ion-button @click="incrementDose">+</ion-button>
          </ion-item>
          <br />
          <ion-label class="label-style">Quantidade de doses:</ion-label>
          <ion-item lines="none" class="counter-item">
            <ion-button @click="decrementQtdDoses">-</ion-button>
            <ion-input readonly :value="qtddose"></ion-input>
            <ion-button @click="incrementQtdDoses">+</ion-button>
          </ion-item>
          <br />
          <ion-label class="label-style">Horário Inicial:</ion-label>
          <ion-datetime presentation="time" v-model="selectedTime" hour-cycle="h23"></ion-datetime>
          <br />
          <ion-label class="label-style">Intervalo de Tempo:</ion-label>
          <ion-item lines="none" class="counter-item">
            <ion-button @click="decrementIntervalo">-</ion-button>
            <ion-input readonly :value="`${intervalo} h`"></ion-input>
            <ion-button @click="incrementIntervalo">+</ion-button>
          </ion-item>
          <br />
          <ion-label class="label-style">Cor:</ion-label>
          <ion-item lines="none" class="color-selector">
            <div v-for="color in colors" :key="color.name"
              :style="{ backgroundColor: color.hex }"
              class="color-dot"
              :class="{ selected: selectedColor === color.name }"
              @click="selectColor(color.name)">
            </div>
          </ion-item>
          <br />
          <ion-img id="xarope" :src="`src/assets/xarope-${selectedColor}.png`"/>
          <br>
          <ion-card id="right">
            <ion-button @click="saveXarope">
              Salvar
              <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
            </ion-button>
          </ion-card>
        </ion-card>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton, IonButtons,
  IonCard, IonContent,
  IonDatetime,
  IonHeader, IonIcon,
  IonImg,
  IonInput, IonItem, IonLabel,
  IonPage, IonToolbar
} from '@ionic/vue';
import axios from 'axios';
import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'EditXarope',
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
    IonDatetime,
    IonToolbar,
    IonImg
  },
  setup() {
    const router = useRouter();

    const remedio = ref('');
    const dose = ref(0);
    const qtddose = ref(0);
    const selectedTime = ref('');
    const intervalo = ref(0);
    const selectedColor = ref('vermelho');

    const colors = [
      { name: 'azul', hex: '#549EC9' },
      { name: 'vermelho', hex: '#C95554' },
      { name: 'amarelo', hex: '#FFDD54' },
      { name: 'verde', hex: '#52C957' },
      { name: 'roxo', hex: '#B02AAA' }
    ];

    onMounted(async () => {
      const xaropeId = router.currentRoute.value.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/xarope/${xaropeId}`);
        console.log(response.data); 
        const xarope = response.data;
        remedio.value = xarope.nome || '';
        dose.value = xarope.dosagem || 0;
        qtddose.value = xarope.qtddose || 0;
        selectedTime.value = convertToDatetimeFormat(xarope.horainicial) || '';
        intervalo.value = xarope.intervalotempo || 0;
        selectedColor.value = xarope.cor || 'vermelho';
      } catch (error) {
        console.error('Failed to fetch xarope data:', error);
      }
    });

    const incrementDose = () => {
      dose.value++;
    };

    const decrementDose = () => {
      if (dose.value > 0) {
        dose.value--;
      }
    };

    const incrementQtdDoses = () => {
      qtddose.value++;
    };

    const decrementQtdDoses = () => {
      if (qtddose.value > 0) {
        qtddose.value--;
      }
    };

  const incrementIntervalo = () => {
    intervalo.value++;
  };

  const decrementIntervalo = () => {
    if (intervalo.value > 0) {
      intervalo.value--;
    }
  };

    const selectColor = (color: string) => {
      selectedColor.value = color;
    };

    const backButton = () => {
      router.push('/remedios');
    };

    const saveXarope = async () => {
      const extractTime = (datetime: string): string => {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}:00`;
      };

      const xaropeId = router.currentRoute.value.params.id;
      const data = {
        nome: remedio.value,
        horainicial: extractTime(selectedTime.value), 
        intervalotempo: intervalo.value,
        cor: selectedColor.value,
        dosagem: dose.value,
        qtddose: qtddose.value
      };

    try {
      await axios.put(`http://localhost:3000/xarope/${xaropeId}`, data);
      router.push('/remedios');
    } catch (error) {
      console.error('Failed to save xarope:', error);
    }
  };

    const convertToDatetimeFormat = (time: string): string => {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      return `2024-01-01T${hours}:${minutes}:00`;
    };

    return {
      arrowBackOutline,
      arrowForwardOutline,
      remedio,
      dose,
      qtddose,
      selectedTime,
      intervalo,
      selectedColor,
      colors,
      incrementDose,
      decrementDose,
      incrementQtdDoses,
      decrementQtdDoses,
      incrementIntervalo,
      decrementIntervalo,
      selectColor,
      backButton,
      saveXarope
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
  margin: 2%;
  margin-top: 5%;
}

#background {
  min-height: 800px;
  background-color: #E7F7F4;
}

.center {
  margin: auto;
  margin-top: 3%;
  text-align: center;
  background-color: #EA6F6F;
  height: 5%;
  width: 40%;
  padding: 10px;
}

h3 {
  font-family: "Kufam";
  color: black;
  font-size: large;
  margin-top: 0px;
  margin-bottom: 0px;
}

.card {
  margin: auto;
  background-color: #ffffff;
  padding: 10px;
  max-height: 100vh;
  overflow-y: auto;
  min-height: 650px; 
  height: auto;
}


.label-style {
  font-family: "Kufam";
  font-size: medium;
  color: black;
  margin: 10%;
  margin-left: 2%;
}

#right {
  text-align: right;
  margin: auto;
  background-color: #FFFFFF;
  box-shadow: none;
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
  flex-wrap: wrap;
  justify-content: space-between; 
}

.color-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 5px;
  cursor: pointer;
  border: 2px solid transparent;
}

.color-dot.selected {
  border: 2px solid black;
}


ion-datetime {
  --background: #E5F0F7 !important;
  --background-rgb: rgb(229, 240, 247);
  --ion-color-shade: #E5F0F7;
  --ion-color-tint: #E5F0F7;
  --ion-color-primary: #22619A;
}
</style>
