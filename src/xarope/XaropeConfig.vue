<script lang="ts">
    import { defineComponent } from 'vue';
    import { IonButton, IonButtons, IonHeader, IonIcon, IonPage, IonCard, IonContent, IonInput, IonItem, IonLabel, IonDatetime } from '@ionic/vue';
    import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';
    import { useRouter } from 'vue-router';
    import router from '@/router';

    export default defineComponent({
        name: 'XaropeConfig',
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
            IonDatetime
        },
        setup() {

            const router = useRouter();

            const arrowBackOutlineIcon = arrowBackOutline; 
            return {
                arrowBackOutline: arrowBackOutlineIcon,
                arrowForwardOutline,
                remedio: '',
                dose: '',
                qtdDoses: '',
                selectedTime: '',
            };
        },
        methods:{
            backButton(){
                router.push("/");
            },
            goToNextPage (){
                router.push("/");
            }
        }
    });
</script>

<template>
    <ion-page>
        <ion-header>
            <ion-buttons>
                <ion-button @click="backButton">
                    <ion-icon slot="icon-only" :icon="arrowBackOutline"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-header>
        <ion-content>
            <ion-card>
                <ion-button>Xarope</ion-button>
                <p>Informe os dados abaixo:</p>
                <ion-label>Nome:</ion-label>
                <ion-item>
                    <ion-input :clear-input="true" v-model="remedio"/>
                </ion-item>
                <ion-label>Dosagem:</ion-label>
                <ion-item>
                    <ion-input type="number" value="0" min="1" v-model="dose"></ion-input>
                </ion-item>
                <ion-label>Quantidade de doses:</ion-label>
                <ion-item>
                    <ion-input type="number" value="0" min="1" v-model="qtdDoses"/>
                </ion-item>
                <ion-label>Horário Inicial:</ion-label>
                <ion-datetime presentation="time" v-model="selectedTime" hourCycle="h23"></ion-datetime>
                <ion-button @click="goToNextPage">
                    Avançar
                    <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
                </ion-button>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<style scoped>
</style>
