<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="backButton">
            <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card id="background">
        <ion-card class="center">
          <p id="text-one">Informe abaixo o código recebido no e-mail:</p>
          <ion-item :clear-input="true" id="input-codigo" lines="none">
            <ion-input v-model="codigo" placeholder="Código:" required/>
          </ion-item>
          <ion-button size="small" expand="block" @click="verifyCode" id="verifyButton">Verificar código</ion-button>
          <p id="text-two" v-if="isCodeValid">Crie uma nova senha no campo abaixo</p>
          <ion-item id="input-senha" lines="none" v-if="isCodeValid">
            <ion-input :clear-input="true" v-model="senha" type="password" placeholder="Nova senha:" required/>
          </ion-item>
          <ion-item id="input-newsenha" lines="none" v-if="isCodeValid">
            <ion-input :clear-input="true" v-model="newsenha" type="password" placeholder="Confirmar nova senha" required/>
          </ion-item>
          <ion-button size="large" id="salvar" expand="block" @click="savePassword" v-if="isCodeValid">Salvar</ion-button>
          <a id="cancelar" href="/">Cancelar</a>
        </ion-card>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonHeader, IonToolbar, IonContent, IonButton, IonButtons, IonIcon, IonCard, IonItem, IonInput, IonPage, toastController } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import axios from 'axios';
import router from '@/router';

export default defineComponent({
  name: 'ResetPassword',
  components: {
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonCard,
    IonItem,
    IonInput,
    IonPage
  },
  setup() {
    const router = useRouter();
    return {
      arrowBackOutline: arrowBackOutline
    };
  },
  data() {
    return {
      email: '',
      codigo: '',
      senha: '',
      newsenha: '',
      isCodeValid: false
    };
  },
  methods: {
    backButton() {
      router.push('/forgotPassword');
    },
    async verifyCode() {
      try {
        const response = await axios.post('http://localhost:3000/verify-code', {
          email: this.email,
          code: this.codigo
        });
        if (response.data.valid) {
          this.isCodeValid = true;
        } else {
          this.presentToast('Código inválido!');
        }
      } catch (error) {
        console.error(error);
        this.presentToast('Erro ao verificar código!');
      }
    },
    async presentToast(message: string) {
      const toast = await toastController.create({
        message: message,
        duration: 1500
      });
      toast.present();
    },
    savePassword() {
      // método de salvar nova senha
      console.log('Nova senha salva');
      router.push('/');
    }
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
  --overflow: hidden;
}

ion-item {
  --background: #E3D1F1 !important;
  --color: black;
}

ion-toolbar {
  --background: #BEDDF0 !important;
  --color: black;
}

#input-codigo {
  position: absolute;
  top: 20%;
  left: 5%;
  -ms-transform: translate(-20%, -20%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

#verifyButton {
  position: absolute;
  top: 30%;
  left: 5%;
  -ms-transform: translate(-30%, -30%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

#input-senha {
  position: absolute;
  top: 45%;
  left: 5%;
  -ms-transform: translate(-45%, -45%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

#input-newsenha {
  position: absolute;
  top: 55%;
  left: 5%;
  -ms-transform: translate(-55%, -55%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

#salvar {
  position: absolute;
  top: 70%;
  left: 5%;
  -ms-transform: translate(-70%, -70%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

a {
  color: black;
  font-family: "Kufam";
  font-size: large;
}

#cancelar {
  position: absolute;
  top: 83%;
  left: 5%;
  -ms-transform: translate(-83%, -83%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

#text-one {
  position: absolute;
  top: 10%;
  left: 5%;
  -ms-transform: translate(-10%, -10%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

#text-two {
  position: absolute;
  top: 35%;
  left: 5%;
  -ms-transform: translate(-35%, -35%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}
</style>
