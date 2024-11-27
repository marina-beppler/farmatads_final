<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  IonButton, IonHeader, IonIcon, IonPage, IonCard, IonContent, IonImg
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { powerOutline } from 'ionicons/icons';
import NavigationMenu from '../views/components/NavigationMenu.vue';

export default defineComponent({
  name: 'MainMenu',
  components: {
    IonButton,
    IonHeader,
    IonIcon,
    IonPage,
    IonCard,
    IonContent,
    IonImg,
    NavigationMenu
  },
  setup() {
    const router = useRouter();
    const userId = ref(0);

    onMounted(() => {
      const storedUserId = localStorage.getItem('userId');
      userId.value = storedUserId ? Number(storedUserId) : 0;
      localStorage.setItem('test', 'testValue');
      console.log(localStorage.getItem('test'));
    });

    const exitApp = () => {
      localStorage.removeItem('userId');
      localStorage.clear(); 
      router.push('/');     
    };

    return {
      userId,
      exitApp,
      powerOutline
    };
  }
});
</script>


<template>
<ion-page>
    <ion-header>
        <NavigationMenu />
    </ion-header>
    <ion-content>
        <ion-card id="background">
            <ion-card class="card">
                <ion-img id="logo" src="assets/logo.png"/>
                <div id="first">
                    <p>Para acessar suas cartelas digitais clique no botão “Remédios” no lado superior esquerdo.</p>
                </div>
                <p>Para acessar suas cartelas digitais clique no botão “Remédios” no lado superior esquerdo.</p>
                <br>
                <p>Para acessar as bulas de seus medicamentos clique no botão “Bulas” no centro do menu.</p>
                <br>
                <p>Para acessar as configurações de notificações e alarmes clique no botão de relógio no lado superior direito</p>
                <ion-card id="center">
                    <ion-button @click="exitApp">
                        <ion-icon :icon="powerOutline" slot="start"></ion-icon>
                        Sair do aplicativo
                    </ion-button>
                </ion-card>
            </ion-card>
        </ion-card>
    </ion-content>
</ion-page>
</template>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Kufam);

p {
  font-family: "Kufam";
  color: #034F67;
  font-size: large;
  margin: 2%;
  text-align: center;
}

#background {
  height: 95%;
  background-color: #E7F7F4;
}

.card {
  margin: auto;
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

#center {
  text-align: center;
  margin: auto;
  background-color: #FFFFFF;
  box-shadow: none;
}

#first{
    margin-top: 5%;
}

#logo{
  margin: auto;
  text-align: center;
  max-height: 20%;
  max-width: 60%;
  border-radius: 30%;
}
</style>
