<template>
    <ion-modal :isOpen="isOpen" @ionModalDidDismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ medicationType }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-card id="background">
          <h1>{{ medicationName }}</h1>
          <h2>Remédio tomado às:</h2>
          <ion-datetime 
              presentation="time" 
              v-model="selectedTime" 
              hour-cycle="h23">
          </ion-datetime>
          <ion-card id="center">
            <ion-buttons>
              <ion-button @click="saveMedicationTime">Salvar</ion-button>
            </ion-buttons>
          </ion-card>
        </ion-card>
      </ion-content>
    </ion-modal>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { IonModal, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonDatetime, IonCard } from '@ionic/vue';
  import axios from 'axios';
  
  export default defineComponent({
    name: 'RemedioModal',
    components: {
      IonModal,
      IonButton,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonButtons,
      IonDatetime,
      IonCard
    },
    props: {
      isOpen: {
        type: Boolean,
        required: true
      },
      medicationType: {
        type: String,
        required: true
      },
      horaInicial: {
        type: String,
        default: ''
      },
      medicationId: {
        type: Number,
        default: 0
      },
      medicationName: {
        type: String,
        default: ''
      },
    },
    setup(props, { emit }) {
      const selectedTime = ref(props.horaInicial);
  
      watch(() => props.horaInicial, (newHoraInicial) => {
        selectedTime.value = newHoraInicial;
      });
  
      const closeModal = () => {
        emit('update:isOpen', false);
      };
  
      const saveMedicationTime = async () => {
        try {
          const payload = {
            id: props.medicationId,
            time: selectedTime.value,
            type: props.medicationType
          };
  
          await axios.post('http://10.0.2.2:3000/update-remedio', payload);
  
          // Close the modal after successful save
          closeModal();
        } catch (error) {
          console.error('Error saving medication time:', error);
          // Handle the error as needed
        }
      };
  
      return {
        selectedTime,
        closeModal,
        saveMedicationTime
      };
    }
  });
  </script>
  
  <style scoped>
  /* Your existing styles */
  #background{
      background-color: #FEFFFF;
      min-height: 570px;
  }
  
  ion-content {
      --background: #FEFFFF !important;
      --color: black;
  }
  
  ion-datetime {
    --background: #A1CAEF !important;
    --background-rgb: rgb(229, 240, 247);
    --ion-color-shade: #E5F0F7;
    --ion-color-tint: #E5F0F7;
    --ion-color-primary: #22619A;
  }
  
  p {
    font-family: "Kufam";
    color: #034F67;
    font-size: large;
    text-align: center;
    margin: 2%;
  }
  
  h1 {
    font-family: "Kufam";
    font-size: 25px;
    color: #034F67;
    text-align: center;
  }
  
  h2{
      font-family: "Kufam";
      font-size: 20px;
      color: black;
      text-align: center;
  }
  
  #center{
      margin: auto;
      margin-top: 3%;
      text-align: center;
      background-color: #bf9dda;
      height: 5%;
      width: 40%;
      padding: 10px;
      text-align: center;
      color: black;
  }
  
  ion-buttons{
      display: block;
  }
  
  ion-button{
      color: white;
  }
  </style>
  