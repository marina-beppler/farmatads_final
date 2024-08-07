<template>
    <ion-page>
      <ion-header>
        <NavigationMenu />
      </ion-header>
      <ion-content>
        <ion-card id="background">
          <ion-card class="card">
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
  import { defineComponent } from 'vue';
  import {
    IonButton, IonHeader, IonIcon, IonPage, IonCard, IonContent
  } from '@ionic/vue';
  import NavigationMenu from '../views/components/NavigationMenu.vue';
  import { addOutline } from 'ionicons/icons';
  import router from '@/router';
  
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
      const addRemedio = () => {
        router.push('/remedioselect');
        console.log("Add new medication...");
      };
  
      return {
        addOutline,
        addRemedio
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
  