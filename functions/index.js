import { onCall } from "firebase-functions/v2/https" 
import { MercadoPagoConfig, Preference } from 'mercadopago';
// import axios from 'axios'

// const BASE_URL_MODO = 'https://merchants.playdigital.com.ar';
// const STORE_ID = '{STORE_ID}';
// const CLIENT_ID = '{CLIENT_ID}';
// const CLIENT_SECRET = '{CLIENT_SECRET}';


// const generateAccessToken = async () => {
//   const response = await axios.post(`${BASE_URL_MODO}/merchants/middleman/token`,
//     {
//       username: CLIENT_ID,
//       password: CLIENT_SECRET,
//     },
//     { headers: { 'Content-Type': 'application/json' } });
//   return response.data.accessToken;
// };


// export const createPaymentIntention = onCall(
//   {cors: true},
//   async (req) => {
//     try {
      
//   // Crear orden de compra en la base de datos de la tienda
//   const mockOrder = {
//     id: 123,
//   };

//   const accessToken = await generateAccessToken();

//   const response = await axios.post(`${BASE_URL_MODO}/merchants/ecommerce/payment-intention`,
//     {
//       productName: 'Producto botón de pago',
//       price: req.body.price,
//       quantity: 1,
//       storeId: STORE_ID,
//       currency: 'ARS',
//       externalIntentionId: mockOrder.id,
//       expirationDate: "2021-12-27 18:50",
//     },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//   return response.data;
//     } catch (error) {
//       return error
//     }
//   }
// )


export const createPreference = onCall(
  {cors: true},
  (request) => {
    return request
  }
)

export const helloWorld = onCall(
  {cors: true},
  (request) => {
    try {
      
      const client = new MercadoPagoConfig({ accessToken: 'APP_USR-8104437464594390-011519-d4bd62196e3bcc80048ac77a8683771c-136614632' });
    
      const preference = new Preference(client);
    
      const result = preference.create({ body: {
        items: [...request.data.items],
        back_urls: {
          success: `http://yampi-sc.web.app/success/${request.data.orderId}`,
          failure: `http://yampi-sc.web.app/success/${request.data.orderId}`,
          pending: `http://yampi-sc.web.app/success/${request.data.orderId}`,
        }
      }})
      
    return result
    } catch (error) {
      return error
    }
  }
)
