<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismissModal">
            <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card id="background">
        <ion-card class="center">
          <p>Informe seus dados abaixo para entrar na sua conta</p>
          <ion-item id="input-email" lines="none">
            <ion-input v-model="email" type="email" placeholder="Email:" required></ion-input>
          </ion-item>
          <ion-item id="input-password" lines="none">
            <ion-input v-model="password" type="password" placeholder="Senha:" required></ion-input>
          </ion-item>
          <ion-button id="input-login-button" expand="block" @click="login">Login</ion-button>
          <p id="text-fpassword">Clique no botão abaixo caso tenha esquecido sua senha:</p>
          <ion-button id="input-fpassword-button" expand="block" @click="openForgotPassword">Esqueci minha senha</ion-button>
        </ion-card>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonButton, IonIcon, IonContent, IonCard, IonItem, IonInput, IonButtons, toastController } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'Login',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonItem,
    IonInput,
    IonButtons,
  },
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const dismissModal = () => {
      router.push('/home');
    };

    const presentToast = async (message: string) => {
      const toast = await toastController.create({
        message: message,
        duration: 1500
      });
      toast.present();
    };

    const login = async () => {
  if (!email.value || !password.value) {
    await presentToast('Email e senha são necessários');
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email.value)) {
    await presentToast('E-mail inválido');
    return;
  }

  try {
    const response = await axios.post('http://10.0.2.2:3000/login', {
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('token', response.data.token);
    router.push('/menu');
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Login request error:', error.response ? error.response.data : error.message);
      await presentToast('Erro ao fazer login: ' + (error.response ? error.response.data.message : error.message));
    } else {
      console.error('Unexpected error:', error);
      await presentToast('Erro inesperado ao fazer login');
    }
  }
};


    const openForgotPassword = () => {
      router.push('/forgotPassword');
    };

    return {
      email,
      password,
      arrowBackOutline,
      dismissModal,
      presentToast,
      login,
      openForgotPassword
    };
  }
});
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Kufam);

p {
  font-family: "Kufam";
  color: #034F67;
  font-size: medium;
}

#background {
  height: 95%;
  background-color: #E5F0F7;
}

.center {
  margin: auto;
  text-align: center;
  height: 100%;
  background-color: #ffffff;
  padding: 10px;
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
  --background: #E3D1F1 !important;
  --color: black;
}

ion-toolbar {
  --background: #BEDDF0 !important;
  --color: black;
}

#input-email,
#input-password,
#input-fpassword-button,
#input-login-button,
#text-fpassword {
  position: absolute;
  left: 5px;
  right: 5px;
  width: 90%;
  margin: 15px;
}

#input-email {
  top: 20%;
}

#input-password {
  top: 35%;
}

#input-login-button {
  top: 50%;
}

#text-fpassword {
  top: 70%;
}

#input-fpassword-button {
  top: 80%;
}
</style>
