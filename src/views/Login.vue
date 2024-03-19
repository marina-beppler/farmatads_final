<template>
  <ion-modal class="center" :is-open="isModalOpen" :showBackdrop="false">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismissModal">
            <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input v-model="email" type="email" placeholder="Email:" required></ion-input>
      </ion-item>
      <ion-item>
        <ion-input v-model="password" type="password" placeholder="Senha:" required></ion-input>
      </ion-item>
      <ion-button expand="block" @click="login">Login</ion-button>
      <ion-button expand="block" @click="openForgotPasswordModal">Esqueci minha senha</ion-button>
    </ion-content>
</ion-modal>
</template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/vue';
  import { arrowBackOutline } from 'ionicons/icons';
  
  export default defineComponent({
    name: 'Login',
    components: {
      IonModal,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonButton,
      IonIcon
    },
    data() {
      return {
      isModalOpen: true,
      email: '',
      password: '',
      arrowBackOutline: arrowBackOutline
      };
    },
    methods: {
    dismissModal() {
      
      this.isModalOpen = false;

    },
    login() {
      if (!this.email || !this.password) {
        console.log('Login é necessário');
        return;
      } else{
        //logica de login
        console.log('Login com:', this.email, this.password);
      }
    },
    openForgotPasswordModal() {
    
      console.log('Abrir esquecer minha senha');
    }
  }
  });
  </script>
  <style scoped>
    @import url('https://fonts.googleapis.com/css?family=Literata');
    @import url(https://fonts.googleapis.com/css?family=Kufam);
    
h1{
  color: #469FBC;
  font-family: 'Literata';
  font-size: 35px;
}

p{
  color: #034F67;
  font-family: 'Kufam';
  font-size: medium;
}
    ion-button{
      --background-activated: #C6ADD9;
      --background: #E0CFED;
      --color: black;
    }

ion-content {
  --background: #E7F7F4 !important;
  --color: black;
}

ion-item {
  --background: #E7F7F4 !important;
  --color: black;
}

ion-toolbar {
  --background: #E7F7F4 !important;
  --color: black;
}

  </style>