<template>
  <ion-modal :is-open="isModalOpen" :showBackdrop="false">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismissModal">
            <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card id="background">
        <ion-card class="center">
          <p>Informe seu email abaixo para receber o código!</p>
          <ion-item id="input-email">
            <ion-input v-model="email" type="email" placeholder="Email:" required></ion-input>
          </ion-item>
          <ion-button id="#receber-button" expand="block" @click="codigo">Receber código</ion-button>
        </ion-card>
      </ion-card>
    </ion-content>
</ion-modal>
</template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/vue';
  import { arrowBackOutline } from 'ionicons/icons';
  import { useRouter } from 'vue-router';
  import router from '@/router';
  
  export default defineComponent({
    name: 'forgotPassword',
    components: {
      IonModal,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonButton,
      IonIcon
    },
    setup(){
      const router = useRouter();
    },
    data() {
      return {
      isModalOpen: true,
      email: '',
      arrowBackOutline: arrowBackOutline
      };
    },
    methods: {
    dismissModal() {
      router.push('/login');
      this.isModalOpen = false;

    },
    codigo() {
      if (!this.email) {
        console.log('Informe um email!');
        return;
      }
      console.log('Email enviado!');
      router.push('/resetPassword');
    }
  }
  });
  </script>


<style scoped>
       @import url(https://fonts.googleapis.com/css?family=Kufam);

p{
  font-family: "Kufam";
  color: #034F67;
  font-size: medium;
}

#background{
  height: 95%;
  background-color: #E5F0F7;
}

.center{
  margin: auto;
  text-align: center;
  height: 100%;
  background-color:#ffffff;
  padding: 10px;
}

ion-button{
  --background-activated: #bf9dda;
  --background: #C6ADD9;
  --color: black;
}

ion-content {
  --background: #E5F0F7 !important;
  --color: black;
}

ion-item {
  --background: #E3D1F1 !important;
  --color: black;
}

ion-toolbar {
  --background: #BEDDF0 !important;
  --color: black;
}

#input-email{
  position: absolute;
  top: 20%;
  left: 5%;
  -ms-transform: translate(-20%, -20%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}


#receber-button{
  position: absolute;
  top: 50%;
  left: 5%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

  </style>