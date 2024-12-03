<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-2">
    <div class="bg-gray-100 rounded-lg w-full max-w-md p-3 ">
      <div class="flex flex-wrap h-14 shadow-lg shadow-gray-600">
        <!-- Carte -->
        <div class="bg-gray-800 rounded-t-lg p-1 flex-1 w-full">
          <div class="text-lg mb-2">
            <p class=" text-center text-white font-roboto pt-2"> Renouvellement de mon abonnement </p>
          </div>
        </div>
      </div>
      <div class="bg-white shadow-lg shadow-gray-600 rounded-b-lg w-full max-w-md p-3">

        <div class="space-y-1 mb-8">
          <h6 class="text-lg font-patrick-hand" style="color: #FF4200">Votre decodeur</h6>
          <div class="bg-white shadow-sm rounded-lg overflow-hidden">
            <!-- Header -->
            <div class="bg-gray-200 p-2 border-gray-400 border-b-2">
              <h6 class="text-lg text-black font-roboto mb-0 text-center">{{ decoderCode }}</h6>
            </div>

            <!-- Card Body -->
            <div class="p-4 bg-gray-200 border-gray-400 border-b-2">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 capitalize font-roboto text-left">formule</span>
                <span class="text-black uppercase font-roboto text-right">{{ decoderFormula }}</span>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-gray-600 font-roboto text-left">Date d'échéance</span>
                <span class="uppercase font-roboto text-right" style="color: #FF4200">{{ formattedExpiryDate }}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-100 p-4 text-lg text-center border-gray-400 border-b-2">
              <span class="text-gray-600 font-roboto uppercase">{{ subscriberName }}</span>
            </div>
          </div>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Formule -->
          <div>
            <label class="block text-lg font-patrick-hand" style="color: #FF4200">Choisir votre formule *</label>
            <div class="mb-8 bg-gray-950 rounded-lg border-gray-400 border-b-2 pb-2 pt-4">
              <div
                  v-for="formula in availableFormulas"
                  :key="formula"
                  class="flex items-center mb-2 w-full cursor-pointer"
                  @click="selectedFormula = formula"
              >
                <label :for="`wifi-toggle-${formula}`" class="cursor-pointer ml-3">
                  <div class="relative">
                    <input
                        type="radio"
                        :id="`wifi-toggle-${formula}`"
                        class="sr-only peer"
                        v-model="selectedFormula"
                        :value="formula"
                    />
                    <div class="block w-6 h-4 bg-gray-300 rounded-full peer-checked:bg-orange-100"></div>
                    <div class="dot absolute left-0 top-0 w-4 h-4 bg-white peer-checked:bg-orange-500 rounded-full transition-all peer-checked:translate-x-3"></div>
                  </div>
                </label>
                <span class="ml-2 text-white uppercase font-roboto text-sm">{{ formula }}</span>
                <span class="ml-auto mr-2 text-white uppercase font-roboto text-sm text-end">{{ getPriceForFormula(formula) }} XAF</span>
              </div>
            </div>
          </div>

          <!-- Bouquets -->
          <div>
            <label class="block text-lg font-patrick-hand text-gray-700" style="color: #FF4200">Ajouter des options à votre bouquet</label>
            <div class="mb-8 bg-gray-950 rounded-lg border-gray-400 border-b-2 pb-2 pt-4">
              <div
                  v-for="bouquet in availableBouquets"
                  :key="bouquet"
                  class="flex items-center mb-2 w-full cursor-pointer"
                  @click="toggleBouquet(bouquet)"
              >
                <label :for="`wifi-toggle-${bouquet}`" class="cursor-pointer ml-3">
                  <div class="relative">
                    <input
                        type="checkbox"
                        :id="`wifi-toggle-${bouquet}`"
                        class="sr-only peer"
                        :checked="selectedbouquets.includes(bouquet)"
                        @change="toggleBouquet(bouquet)"
                    />
                    <div class="block w-6 h-4 bg-gray-300 rounded-full peer-checked:bg-orange-100"></div>
                    <div class="dot absolute left-0 top-0 w-4 h-4 bg-white peer-checked:bg-orange-500 rounded-full transition-all peer-checked:translate-x-3"></div>
                  </div>
                </label>
                <span class="ml-2 text-white uppercase font-roboto text-sm">{{ bouquet }}</span>
                <span class="ml-auto mr-2 text-white uppercase font-roboto text-sm text-end">
                {{ getPriceForBouquet(bouquet) }} XAF
              </span>
              </div>
            </div>
          </div>

          <!-- Rest of the form remains the same -->
          <div class="" hidden>
            <input type="number" name="token" id="token" value="" v-model="token" disabled>
            <input type="number" name="code" id="code" value="" v-model="code" disabled>
          </div>

          <!-- Durée d'Abonnement -->
          <div>
            <label class="block text-lg font-patrick-hand text-gray-700" style="color: #FF4200">Choisir la durée (Mois)</label>
            <div class="flex mt-1 w-full mb-8">
              <button
                  v-for="month in subscriptionMonths"
                  :key="month"
                  type="button"
                  @click="selectedDuration = month"
                  :class="`p-1 w-full rounded-none ${selectedDuration === month ? 'bg-gray-950 text-white' : 'bg-gray-300 text-black'}`"
              >
                {{ month }}
              </button>
            </div>
          </div>

          <!-- Numéro Mobile -->
          <div>
            <label class="block text-lg font-patrick-hand text-gray-700" style="color: #FF4200">Entrer un numero mobile pour le payement *</label>
            <div class="relative mb-4 border-gray-600 border-2 rounded-lg">
              <div v-if="mobileOperator" class="absolute inset-y-0 left-0 pr-3 flex items-center pointer-events-none">
                <img
                    :src="mobileOperatorLogo"
                    :alt="mobileOperator"
                    class="w-14 h-14 rounded-lg"
                />
              </div>
              <input
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="Entrez votre numéro.  .  . "
                  @input="detectMobileOperator"
                  class="mt-1 p-3 text-end block font-roboto w-full rounded-lg shadow-sm text-lg focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          <!-- Bouton Payer -->
          <button
              type="submit"
              class="w-full font-roboto bg-green-500 text-white py-3 rounded-md hover:bg-green-950 transition duration-300"
          >
            PAYER {{ calculateTotal() }} XAF
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue'
import mtnLogo from '../../../src/assets/images/mtn-logo.png'
import orangeLogo from '../../../src/assets/images/orange-logo.png'
import Subscriber from '../../../src/data/model/Subscriber'

// Types pour les formules et opérateurs
type Formula = string;
type Bouquet = string;
type MobileOperator = 'MTN' | 'Orange' | null

export default defineComponent({
  name: 'interface',
  data() {
    return {
      mtnLogo,
      orangeLogo,

      // hidden id code
      code: 0 as number,
      token: '' as string,

      // Types dynamiques pour chaque propriété
      selectedFormula: '' as Formula,
      selectedbouquets: [] as Bouquet[],
      selectedDuration: '01' as string,
      phoneNumber: '' as string,
      mobileOperator: null as MobileOperator,

      // Liste des mois d'abonnement disponibles
      subscriptionMonths: ['01', '03', '06', '12', '24'] as string[],

      decoderCode: '',
      decoderFormula: '',
      formattedExpiryDate: '',
      subscriberName: '',

      // Dynamiques et initialement vides
      availableFormulas: [] as Formula[],
      availableBouquets: [] as Bouquet[],

      // Prix par défaut si non fournis par l'API
      formulaPrices: {} as Record<Formula, number>,
      bouquetPrices: {} as Record<Bouquet, number>
    }
  },
  computed: {
    // Computed property pour le logo de l'opérateur mobile
    mobileOperatorLogo(): string {
      switch(this.mobileOperator) {
        case 'MTN': return this.mtnLogo
        case 'Orange': return this.orangeLogo
        default: return ''
      }
    }
  },
  methods: {
    getPriceForFormula(formula: Formula): number {
      return this.formulaPrices[formula] || 0;
    },

    getPriceForBouquet(bouquet: Bouquet): number {
      return this.bouquetPrices[bouquet] || 0;
    },

    detectMobileOperator() {
      const regexNumberCam = /^(\+237|237)?6(2[0]\d{6}|[5-9]\d{7})$/;
      const orangeRegex = /^(\+237|237)?6(5[5-9]|8[5-9]|9[0-9])\d{6}$/;
      const mtnRegex = /^(\+237|237)?6(5[0-4]|7[0-9]|8[0-4])\d{6}$/;

      const cleanedPhoneNumber = this.phoneNumber.replace(/\s+/g, '');
      // Vérifie si le numéro est camerounais
      if (regexNumberCam.test(cleanedPhoneNumber)) {
        // Vérifie si c'est un numéro MTN
        if (mtnRegex.test(cleanedPhoneNumber)) {
          this.mobileOperator = 'MTN';
        }
        else if (orangeRegex.test(cleanedPhoneNumber)) {
          this.mobileOperator = 'Orange';
        }
        else {
          this.mobileOperator = null
        }
      }
      else {
        this.mobileOperator = null;
      }
    },

    calculateTotal(): number {
      let total = 0;
      if (this.selectedFormula) {
        total += this.getPriceForFormula(this.selectedFormula) * parseInt(this.selectedDuration);
      }

      this.selectedbouquets.forEach(bouquet => {
        total += this.getPriceForBouquet(bouquet) * parseInt(this.selectedDuration);
      });

      return total;
    },

    submitForm() {
      if (!this.phoneNumber || !this.mobileOperator) {
        alert('Veuillez entrer un numéro de mobile valide')
        return
      }

      if(!this.selectedFormula){
        alert('Veuillez choisir une formule')
        return
      }

      interface SubscriptionData {
        formula: Formula
        bouquet: Bouquet[]
        duration: number
        phoneNumber: string
        total: number
      }

      const formData: SubscriptionData = {
        formula: this.selectedFormula,
        bouquet: this.selectedbouquets,
        duration: parseInt(this.selectedDuration),
        phoneNumber: this.phoneNumber,
        total: this.calculateTotal()
      }

      console.log(formData)
      alert('Formulaire soumis avec succès!')
    },

    toggleBouquet(bouquet: Bouquet) {
      if (this.selectedbouquets.includes(bouquet)) {
        this.selectedbouquets = this.selectedbouquets.filter(b => b !== bouquet);
      } else {
        this.selectedbouquets.push(bouquet);
      }
    },

    // async fetchTokenAndDecoderDetails() {
    //   try {

    //     const urlParams = new URLSearchParams(window.location.search);
    //     const token = urlParams.get('token');
    //     console.log('Le token détecté est :', token);

    //     const isValidToken = (value: string) => {
    //       const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    //       return jwtRegex.test(value);
    //     };

    //     if (!token || !isValidToken(token)) {
    //       throw new Error('Token invalide ou absent dans l\'URL');
    //     }


    //     const subscriber = new Subscriber(
    //         0, // mobile (placeholder)
    //         '', // name (will be populated)
    //         '', // formula (will be populated)
    //         null, // bouquet (will be populated)
    //         new Date(), // expiry date (will be populated)
    //         token
    //     )

    //     const detailsFetched = await subscriber.fetchDecoderDetails()

    //     if (detailsFetched) {
    //       this.token = token
    //       this.code = subscriber.code || 0
    //       this.decoderCode = subscriber.code?.toString() || ''
    //       this.decoderFormula = subscriber.formula
    //       this.subscriberName = subscriber.name
    //       this.formattedExpiryDate = this.formatDate(subscriber.expiryDate)
    //     }
    //   } catch (error) {
    //     console.error('Error fetching decoder details:', error)
    //   }
    // },
    async fetchTokenAndDecoderDetails() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      // Validation du token
      const isValidToken = (value: string) => {
        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        return jwtRegex.test(value);
      };

      if (!token || !isValidToken(token)) {
        throw new Error('Token invalide ou absent dans l\'URL');
      }

      // Créer un nouvel abonné avec le token
      const subscriber = new Subscriber(
        0, // mobile (placeholder)
        '', // name (placeholder)
        '', // formula (placeholder)
        null, // bouquet (placeholder)
        new Date(), // expiry date (placeholder)
        token
      );

      // Récupérer les détails de l'abonné
      const detailedSubscriber = await subscriber.fetchSubscriberByToken();

      // Mettre à jour les données du composant
      this.token = token;
      this.code = subscriber.code || 0;
      this.decoderCode = subscriber.code?.toString() || '';
      this.decoderFormula = subscriber.formula;
      this.subscriberName = subscriber.name;
      this.formattedExpiryDate = this.formatDate(subscriber.expiryDate);

      // Mettre à jour les données dynamiques du formulaire
      this.availableFormulas = subscriber.availableFormulas;
      this.availableBouquets = subscriber.availableBouquets;
      this.formulaPrices = subscriber.formulaPrices;
      this.bouquetPrices = subscriber.bouquetPrices;

    } catch (error) {
      console.error('Erreur lors de la récupération des détails du décodeur :', error);
      // Gérer l'erreur (afficher un message à l'utilisateur, rediriger, etc.)
    }
  },


    formatDate(date: Date): string {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  },
  mounted() {
    this.fetchTokenAndDecoderDetails()
  }
})
</script>

