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
}
</style>