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
              <h3>Editar Comprimido</h3>
            </ion-card>
            <p>Atualize os dados abaixo:</p>
            <ion-label class="label-style">Nome:</ion-label>
            <ion-item lines="none">
              <ion-input v-model="remedio" />
            </ion-item>
            <br />
            <ion-label class="label-style">Quantidade de Comprimidos:</ion-label>
            <ion-item lines="none" class="counter-item">
              <ion-button @click="decrementQtdComprimido">-</ion-button>
              <ion-input readonly :value="qtdcomprimido"></ion-input>
              <ion-button @click="incrementQtdComprimido">+</ion-button>
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
            <ion-img id="comprimido" :src="`src/assets/comprimido-${selectedColor}.png`"/>
            <br>
            <ion-card id="right">
              <ion-button @click="saveComprimido">
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
    name: 'EditComprimido',
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
      const qtdcomprimido = ref(0);
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
        const comprimidoId = router.currentRoute.value.params.id;
        try {
          const response = await axios.get(`http://localhost:3000/comprimido/${comprimidoId}`);
          const comprimido = response.data;
          remedio.value = comprimido.nome || '';
          qtdcomprimido.value = comprimido.qtdcomprimido || 0;
          selectedTime.value = convertToDatetimeFormat(comprimido.horainicial) || '';
          intervalo.value = comprimido.intervalotempo || 0;
          selectedColor.value = comprimido.cor || 'vermelho';
        } catch (error) {
          console.error('Failed to fetch comprimido data:', error);
        }
      });
  
      const incrementQtdComprimido = () => {
        qtdcomprimido.value++;
      };
  
      const decrementQtdComprimido = () => {
        if (qtdcomprimido.value > 0) {
          qtdcomprimido.value--;
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
  
      const saveComprimido = async () => {
        const extractTime = (datetime: string): string => {
          const date = new Date(datetime);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}:00`;
        };
  
        const comprimidoId = router.currentRoute.value.params.id;
        const data = {
          nome: remedio.value,
          qtdcomprimido: qtdcomprimido.value,
          horainicial: extractTime(selectedTime.value),
          intervalotempo: intervalo.value,
          cor: selectedColor.value
        };
  
        try {
          await axios.put(`http://localhost:3000/comprimido/${comprimidoId}`, data);
          router.push('/remedios'); 
        } catch (error) {
          console.error('Failed to save comprimido:', error);
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
        qtdcomprimido,
        selectedTime,
        intervalo,
        selectedColor,
        colors,
        incrementQtdComprimido,
        decrementQtdComprimido,
        incrementIntervalo,
        decrementIntervalo,
        selectColor,
        backButton,
        saveComprimido
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
  