import axios from "axios";

class Subscriber {
    public id: number | undefined;
    public token: string;
    public code: number | undefined;
    public mobile: number;
    public name: string;
    public formula: string;
    public bouquet: string | null;
    public expiryDate: Date;

    // New properties for dynamic formulas and prices
    public availableFormulas: string[] = [];
    public availableBouquets: string[] = [];
    public formulaPrices: Record<string, number> = {};
    public bouquetPrices: Record<string, number> = {};

    constructor(
        mobile: number,
        name: string,
        formula: string,
        bouquet: string | null,
        expiryDate: Date,
        token?: string,
        id?: number,
    ) {
        this.id = id;
        this.mobile = mobile;
        this.name = name;
        this.formula = formula;
        this.bouquet = bouquet;
        this.expiryDate = expiryDate;
        this.token = token || '';
    }

//     async fetchDecoderDetails() {
//         if (!this.token) return false;

//         try {
//             const response = await axios.put('api/subcriber/list', {
//                 token: this.token
//             });

//             if (response.data.status && response.data.response.length > 0) {
//                 const subscriberData = response.data.response[0];

//                 // Populate the details
//                 this.id = subscriberData.id;
//                 this.mobile = subscriberData.mobile;
//                 this.name = subscriberData.name;
//                 this.formula = subscriberData.formula;
//                 this.bouquet = subscriberData.bouquet;
//                 this.code = subscriberData.code;
//                 this.expiryDate = new Date(subscriberData.expiryDate);

//                 // Fetch and populate dynamic formulas and prices directly from API
//                 this.availableFormulas = subscriberData.availableFormulas || [];
//                 this.availableBouquets = subscriberData.availableBouquets || [];
//                 this.formulaPrices = subscriberData.formulaPrices || {};
//                 this.bouquetPrices = subscriberData.bouquetPrices || {};

//                 return true;
//             }
//             return false;
//         }
//         catch (error) {
//             console.error('Error fetching decoder details:', error);
//             throw error;
//         }
//     }

// // Other existing methods remain the same
//     static async fetchSubcriberData() {
//         try {
//             const response = await axios.get(`api/subscriber/`);
//             if (!response.data) return [];
//             return response.data.response;
//         }
//         catch (error) {
//             console.error('Error fetching contacts:', error);
//             throw error;
//         }
//     }

    
        async fetchSubscriberByToken() {
            if (!this.token) throw new Error('No token provided');
    
            try {
                // Premier appel API pour récupérer les données initiales avec le token
                const tokenResponse = await axios.put('api/subscriber/list', {
                    token: this.token
                });
    
                if (!tokenResponse.data.status || tokenResponse.data.response.length === 0) {
                    throw new Error('No subscriber found for this token');
                }
    
                const initialData = tokenResponse.data.response[0];
                this.code = initialData.code; // Récupère le code du décodeur
    
                // Deuxième appel API en utilisant le code du décodeur
                const decoderResponse = await axios.get(`api/decoder/${this.code}`);
    
                if (!decoderResponse.data.status) {
                    throw new Error('Failed to fetch decoder details');
                }
    
                const decoderData = decoderResponse.data.response;
    
                // Mettre à jour les détails de l'abonnement
                this.formula = decoderData.formula;
                this.expiryDate = new Date(decoderData.expiryDate);
                this.name = decoderData.name;
    
                // Troisième appel API pour recharger les données du formulaire
                const formDataResponse = await axios.get('api/subscription-form-data');
    
                if (!formDataResponse.data.status) {
                    throw new Error('Failed to fetch form data');
                }
    
                // Mettre à jour les données dynamiques du formulaire
                this.availableFormulas = formDataResponse.data.availableFormulas || [];
                this.availableBouquets = formDataResponse.data.availableBouquets || [];
                this.formulaPrices = formDataResponse.data.formulaPrices || {};
                this.bouquetPrices = formDataResponse.data.bouquetPrices || {};
    
                return true;
            } catch (error) {
                console.error('Error in subscriber data fetch:', error);
                throw error;
            }
        }
    
        // Méthode modifiée dans le composant Vue
        async fetchTokenAndDecoderDetails() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
    
                const isValidToken = (value: string) => {
                    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
                    return jwtRegex.test(value);
                };
    
                if (!token || !isValidToken(token)) {
                    throw new Error('Token invalide ou absent dans l\'URL');
                }
    
                const subscriber = new Subscriber(
                    0, // mobile (placeholder)
                    '', // name (will be populated)
                    '', // formula (will be populated)
                    null, // bouquet (will be populated)
                    new Date(), // expiry date (will be populated)
                    token
                );
    
                const detailsFetched = await subscriber.fetchSubscriberByToken();
    
                if (detailsFetched) {
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
                }
            } catch (error) {
                console.error('Error fetching decoder details:', error);
            }
        }
    

}

export default Subscriber;

