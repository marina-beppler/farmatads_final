<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  IonButton, IonButtons, IonHeader, IonIcon, IonPage, IonCard, IonContent, IonInput, IonItem, IonLabel, IonDatetime, IonToolbar
} from '@ionic/vue';
import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CapsulaConfig',
  components: {
    IonButton,
    IonButtons,
    IonIcon,
    IonPage,
    IonHeader,
    IonCard,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonDatetime,
    IonToolbar
  },
  setup() {
    const router = useRouter();

    const selectedMedicationType = ref('');
    const remedio = ref('');
    const qtdCapsula = ref(0);
    const selectedTime = ref('');

    onMounted(() => {
      remedio.value = '';
      qtdCapsula.value = 0;
      selectedTime.value = '';
      selectedMedicationType.value = localStorage.getItem('selectedMedicationType') || '';
    });

    const incrementQuantidade = () => {
      qtdCapsula.value++;
    };

    const decrementQuantidade = () => {
      if (qtdCapsula.value > 0) { 
        qtdCapsula.value--;
      }
    };

    const backButton = () => {
      router.push("/remedioselect");
    };

    const saveFormData = () => {
      const userId = localStorage.getItem('userId') || '';

      localStorage.setItem('capsulaConfig', JSON.stringify({
        userId,
        remedio: remedio.value,
        qtdCapsula: qtdCapsula.value,
        selectedTime: selectedTime.value
      }));

      console.log("Saved data:", {
        userId,
        remedio: remedio.value,
        qtdCapsula: qtdCapsula.value,
        selectedTime: selectedTime.value
      });
    };

    const goToNextPage = () => {
      saveFormData();
      router.push("/capsulaextra");
      console.log(selectedMedicationType.value);
    };

    return {
      arrowBackOutline,
      arrowForwardOutline,
      remedio,
      qtdCapsula,
      selectedTime,
      incrementQuantidade,
      decrementQuantidade,
      backButton,
      goToNextPage
    };
  }
});
</script>


<template>
<ion-page>
    <ion-header>
        <ion-toolbar>
            <ion-buttons>
                <ion-button @click="backButton">
                    <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content>
        <ion-card id="background">
            <ion-card class="card">
                <ion-card class="center">
                    <h3>Cápsula</h3>
                </ion-card>
                <p>Informe os dados abaixo:</p>
                <ion-label class="label-style">Nome:</ion-label>
                <ion-item lines="none">
                    <ion-input :clear-input="true" v-model="remedio"/>
                </ion-item>
                <br>
                <ion-label class="label-style">Quantidade:</ion-label>
                <ion-item lines="none" class="counter-item">
                    <ion-button @click="decrementQuantidade">-</ion-button>
                    <ion-input readonly :value="qtdCapsula" style="text-align: center;"></ion-input>
                    <ion-button @click="incrementQuantidade">+</ion-button>
                </ion-item>
                <br>
                <ion-label class="label-style">Horário Inicial:</ion-label>
                <ion-datetime presentation="time" v-model="selectedTime" hourCycle="h23"></ion-datetime>
                <br>
                <ion-card id="right">
                    <ion-button @click="goToNextPage">
                        Avançar
                        <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
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
  margin-top: 5%;
}

#background {
  min-height: 650px;
  background-color: #E7F7F4;
}

.center {
  margin: auto;
  margin-top: 3%;
  text-align: center;
  background-color: #A0BAEC;
  height: 5%;
  width: 40%;
  padding: 10px;
}

h3 {
  font-family: "Kufam";
  color: black;
  font-size: large;
  margin-top: 0px;
  margin-bottom: 0px;
}

.card {
  margin: auto;
  height: 100%;
  background-color: #ffffff;
  padding: 10px;
}

.label-style {
  font-family: "Kufam";
  font-size: medium;
  color: black;
  margin: 10%;
  margin-left: 2%;
}

#right {
  text-align: right;
  margin: auto;
  background-color: #FFFFFF;
  box-shadow: none;
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
  --background: #E5F0F7 !important;
  --color: black;
}

ion-toolbar {
  --background: #BEDDF0 !important;
  --color: black;
}

ion-datetime {
  --background: #E5F0F7 !important;
  --background-rgb: rgb(229, 240, 247);
  --ion-color-shade: #E5F0F7;
  --ion-color-tint: #E5F0F7;
  --ion-color-primary: #22619A;
}

.counter-item {
  display: flex;
  align-items: center;
}

.counter-item ion-input {
  text-align: center;
  flex: 1;
}

.counter-item ion-button {
  --padding-start: 10px;
  --padding-end: 10px;
}
</style>
