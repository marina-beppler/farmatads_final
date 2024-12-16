<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import {
  IonButton, IonHeader, IonIcon, IonPage, IonCard, IonContent
} from '@ionic/vue';
import NavigationMenu from '../views/components/NavigationMenu.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'RemediosSelect',
  components: {
    IonButton,
    IonHeader,
    IonIcon,
    IonPage,
    IonCard,
    IonContent,
    NavigationMenu
  },
  setup() {
    const router = useRouter();
    const userId = ref(localStorage.getItem('userId') || '');

    onMounted(() => {
      const userId = localStorage.getItem('userId');
    });

    
    const selectCapsula = () => {
    localStorage.setItem('selectedMedicationType', '2');
      router.push('/capsulaconfig');
    };

    const selectComprimido = () => {
    localStorage.setItem('selectedMedicationType', '3');
      router.push('/comprimidoconfig');
    };

    const selectXarope = () => {
    localStorage.setItem('selectedMedicationType', '1');
      router.push('/xaropeconfig');
    };

    return {
      selectCapsula,
      selectComprimido,
      selectXarope
    };
  }
});
</script>

<template>
<ion-page>
    <ion-header>
    </ion-header>
    <ion-content>
        <ion-card id="background">
            <ion-card class="card">
                <p>Selecione a opção desejada do medicamento:</p>
                <ion-button expand="block" class="button-capsula" @click="selectCapsula">
                    Cápsula
                </ion-button>
                <ion-button expand="block" class="button-comprimido" @click="selectComprimido">
                    Comprimido
                </ion-button>
                <ion-button expand="block" class="button-xarope" @click="selectXarope">
                    Xarope
                </ion-button>
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
  font-size: 30px;
  text-align: center;
  margin: 2%;
  position: absolute;
  top: 10%;
  left: 5%;
  -ms-transform: translate(-35%, -35%);
  transform: translate(-5%, -5%);
  width: 90%;
  margin: 15px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.button-capsula {
  --background: #E7E7F4;
  --border-color: #8491E6;
  --border-radius: 5px;
  --border-width: 1px;
  --border-style: solid;
  margin: 20px 0;
  width: 90%;
  height: 35px;
  font-size: 18px;
  font-family: "Kufam";
  --color: black;
}

.button-comprimido {
  --background: #E7F7F4;
  --border-color: #8AE691;
  --border-radius: 5px;
  --border-width: 1px;
  --border-style: solid;
  margin: 20px 0;
  width: 90%;
  height: 35px;
  font-size: 18px;
  font-family: "Kufam";
  --color: black;
}

.button-xarope {
  --background: #F7E7E7;
  --border-color: #E68484;
  --border-radius: 5px;
  --border-width: 1px;
  --border-style: solid;
  margin: 20px 0;
  width: 90%;
  height: 35px;
  font-size: 18px;
  font-family: "Kufam";
  --color: black;
}

ion-content {
  --background: #E5F0F7 !important;
  --color: black;
}
</style>
