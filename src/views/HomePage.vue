<script script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonPage, IonButton, IonCard, IonContent, IonHeader, modalController, IonImg,onIonViewWillEnter } from '@ionic/vue';
import Login from "./Login.vue";
import Cadastro from "./Cadastro.vue"

export default defineComponent({
  name: 'HomePage',
  components: {
    IonPage,
    IonButton,
  },
  setup() {
    const modalRef = ref(null);

    const openLogin = async () => {
      try {
        const modal = await modalController.create({
          component: Login
        });
        await modal.present();
        console.log('Login modal opened');
      } catch (error) {
        console.error('Error opening login modal:', error);
      }
    };

    const openCadastro = async () => {
      try {
        const modal = await modalController.create({
          component: Cadastro
        });
        await modal.present();
        console.log('Cadstro modal opened');
      } catch (error) {
        console.error('Error opening cadastro modal:', error);
      }
    };

    return {
      modalRef,
      openLogin,
      openCadastro
    };
  }
});
</script>

<template>
  <ion-page>
    <ion-header>
    </ion-header>
    <ion-content class="background">
      <ion-card class="center">
        <ion-img id="logo" src="src/assets/logo.png"/>
        <h1 id="text-center-title">Bem vindo(a) ao Farmatads!</h1>
        <br>
        <p id="text-center-cadastro">Se você é novo aqui, clique em “Criar Conta” para começar!</p>
        <ion-button size="large" id="text-center-cadastro-button" @click="openCadastro">Criar conta</ion-button>
        <p id="text-center-login">Se você já tem uma conta, clique em “Entrar” para  acessá-la!</p>
        <ion-button size="large" id="text-center-login-button" @click="openLogin">Entrar</ion-button>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Literata');
@import url(https://fonts.googleapis.com/css?family=Kufam);

#background{
  padding: 16px;
  background-color: #E7F7F4;
}
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
.center{
  margin: auto;
  text-align: center;
  height: 100%;
  background-color:#E7F7F4;
}
#text-center-title{
  margin: 0;
  position: absolute;
  top: 30%;
  left: 50%;
  -ms-transform: translate(-30%, -30%);
  transform: translate(-50%, -50%);
}

#text-center-cadastro{
  margin: 0;
  position: absolute;
  top: 45%;
  left: 50%;
  -ms-transform: translate(-45%, -45%);
  transform: translate(-50%, -50%);
}

#text-center-cadastro-button{
  margin: 0;
  position: absolute;
  top: 57%;
  left: 50%;
  -ms-transform: translate(-55%, -55%);
  transform: translate(-50%, -50%);
}

#text-center-login{
  margin: 0;
  position: absolute;
  top: 69%;
  left: 50%;
  -ms-transform: translate(-65%, -65%);
  transform: translate(-50%, -50%);
}

#text-center-login-button{
  margin: 0;
  position: absolute;
  top: 80%;
  left: 50%;
  -ms-transform: translate(-75%, -75%);
  transform: translate(-50%, -50%);
}
#logo{
  margin: auto;
  text-align: center;
  max-height: 30%;
  max-width: 80%;
  border-radius: 30%;
}
ion-button{
  --background-activated: #C6ADD9;
  --background: #E0CFED;
  --color: black;
}
</style>
