<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonInput, IonItem, IonCard, IonPage, IonContent, toastController, IonLabel, IonList, IonNote } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { searchOutline } from 'ionicons/icons';
import NavigationMenu from '../views/components/NavigationMenu.vue';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';


interface Medicamento {
    idProduto: number;
    nomeProduto: string;
    idBulaPacienteProtegido: string;
    idBulaProfissionalProtegido: string;
}

export default defineComponent({
    name: "Bulas",
    components: {
        IonHeader,
        IonToolbar,
        IonButton,
        IonIcon,
        IonButtons,
        IonInput,
        IonItem,
        IonCard,
        IonPage,
        IonContent,
        NavigationMenu,
        IonLabel,
        IonList,
        IonNote
    },
    setup() {
        const medicamento = ref('');
        const pagina = ref(1);
        const searchOutlineIcon = searchOutline;
        const searchResults = ref<Medicamento[]>([]);

        const presentToast = async (message: string) => {
            const toast = await toastController.create({
                message: message,
                duration: 1500
            });
            toast.present();
        };

        const searchMedicamento = async () => {
            if (!medicamento.value) {
                presentToast('Por favor, digite o nome do medicamento.');
                return;
            }
            try {
                const response = await axios.get('https://bula.vercel.app/pesquisar', {
                    params: {
                        nome: medicamento.value,
                        pagina: pagina.value
                    }
                });
                searchResults.value = response.data.content.slice(0, 3); 
            } catch (error) {
                console.error('Error fetching data:', error);
                presentToast('Erro pesquisando medicamento!');
            }
        };

        const blobToBase64 = (blob: Blob): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = (reader.result as string).split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        };

        const fetchBulaPDF = async (id: string) => {
            try {
                presentToast('Baixando bula, aguarde...');

                const response = await axios.get('https://bula.vercel.app/pdf', {
                    params: { id: id },
                    responseType: 'blob'
                });

                const base64String = await blobToBase64(response.data);

                await Filesystem.writeFile({
                    path: 'bula.pdf',
                    data: base64String,
                    directory: Directory.Documents
                });

                presentToast('Bula salva com sucesso!');
            } catch (error) {
                console.error('Error fetching PDF:', error);
                presentToast('Erro ao obter a bula do medicamento!');
            }
        };


        return {
            medicamento,
            pagina,
            searchOutlineIcon,
            searchMedicamento,
            searchResults,
            fetchBulaPDF
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
                    <div id="pesquisar">
                        <ion-item id="pesquisar" lines="none">
                            <ion-button @click="searchMedicamento">
                                <ion-icon :icon="searchOutlineIcon" slot="start" size="large"></ion-icon>
                            </ion-button>
                            <ion-input v-model="medicamento" placeholder="Digite o nome do medicamento" required></ion-input>
                        </ion-item>
                    </div>
                    <p>Clique no campo acima para pesquisar digitar o nome do medicamento desejado. Para pesquisar, clique na lupa!</p>
                    <div v-if="searchResults.length">
                        <ion-list>
                            <ion-item v-for="med in searchResults" :key="med.idProduto">
                                <ion-label @click="fetchBulaPDF(med.idBulaPacienteProtegido)">
                                    <h3>{{ med.nomeProduto }}</h3>
                                    <ion-note>ID: {{ med.idProduto }}</ion-note>
                                </ion-label>
                            </ion-item>
                        </ion-list>
                    </div>
                </ion-card>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<style scoped>
p {
  font-family: "Kufam";
  color: #034F67;
  font-size: medium;
  margin-top: 10%;
  margin-left: 2%;
  margin-right: 2%;
  text-align: center;
}

#background {
  height: auto;
  min-height: 95%; 
  background-color: #E7F7F4;
}

.card {
  margin: auto;
  background-color: #ffffff;
  min-height: 700px;
  padding: 10px;
}

#pesquisar {
  background-color: #E7F7F4;
  font-size: large;
}

ion-button {
  --background: #E7F7F4;
  --box-shadow: 0;
}

ion-icon {
  color: black;
}

ion-item {
  --background: #E7F7F4 !important;
  --color: black;
  --ion-item-background: #E7F7F4 !important;
}

ion-list {
  --background: #E7F7F4 !important;
}
</style>
