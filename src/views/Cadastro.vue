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
          <p>Informe seus dados abaixo para criar sua conta</p>
          <ion-item id="input-name" lines="none">
            <ion-input v-model="name" placeholder="Nome:" required></ion-input>
          </ion-item>
          <ion-item id="input-email" lines="none">
            <ion-input v-model="email" type="email" placeholder="Email:" required></ion-input>
          </ion-item>
          <ion-item id="input-password" lines="none">
            <ion-input v-model="password" type="password" placeholder="Senha:" required></ion-input>
          </ion-item>
          <ion-item id="input-password-conf" lines="none">
            <ion-input v-model="passwordConf" type="password" placeholder="Confirme sua senha:" required></ion-input>
          </ion-item>
          <ion-button id="cadastro-button" expand="block" @click="cadastro">Criar Conta</ion-button>
        </ion-card>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonButton, IonIcon, IonContent, IonCard, IonItem, IonInput, IonButtons } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'Cadastro',
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
    IonButtons
  },
  setup() {
    const router = useRouter();
    return {
      email: '',
      password: '',
      name: '',
      passwordConf: '',
      arrowBackOutline: arrowBackOutline
    };
  },
  methods: {
    dismissModal() {
      this.$router.push('/');
    },
    async cadastro() {
      if (!this.email || !this.password || !this.name || !this.passwordConf) {
        console.log('É necessário preencher todos os campos!');
        return;
      }

      const padrao = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!padrao.test(this.email)) {
        console.log('E-mail inválido!');
        return;
      }

      if (this.password !== this.passwordConf) {
        console.log('As senhas não coincidem!');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/register', {
          username: this.name,
          password: this.password,
          email: this.email,
        });
        console.log(response.data);
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
      }
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

#input-name {
  position: absolute;
  top: 15%;
  left: 5%;
  -ms-transform: translate(-15%, -15%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

#input-email {
  position: absolute;
  top: 30%;
  left: 5%;
  -ms-transform: translate(-30%, -30%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

#input-password {
  position: absolute;
  top: 45%;
  left: 5%;
  -ms-transform: translate(-45%, -45%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

#input-password-conf {
  position: absolute;
  top: 60%;
  left: 5%;
  -ms-transform: translate(-60%, -60%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}

#cadastro-button {
  position: absolute;
  top: 75%;
  left: 5%;
  -ms-transform: translate(-75%, -75%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
}
</style>
