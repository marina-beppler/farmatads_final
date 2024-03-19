<template>
    <ion-modal :is-open="isModalOpen" :showBackdrop="false">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="dismissModal">
              <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Cadastro</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-input v-model="name" placeholder="Nome:" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="email" type="email" placeholder="Email:" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="password" type="password" placeholder="Senha:" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="passwordConf" type="password" placeholder="Confirme sua senha:" required></ion-input>
        </ion-item>
        <ion-button expand="block" @click="cadastro">Criar Conta</ion-button>
      </ion-content>
  </ion-modal>
  </template>
    
    <script lang="ts">
    import { defineComponent } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/vue';
    import { arrowBackOutline } from 'ionicons/icons';
    
    export default defineComponent({
      name: 'Cadastro',
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
        name: '',
        passwordConf: '',
        arrowBackOutline: arrowBackOutline
        };
      },
      methods: {
      dismissModal() {
        
        this.isModalOpen = false;
  
      },
      cadastro() {
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
    