import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { error, log } from "firebase-functions/logger";
import { onCall, onRequest } from "firebase-functions/v2/https" 

import { MercadoPagoConfig, Preference } from 'mercadopago';
import axios from "axios";

initializeApp()

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
      
      const client = new MercadoPagoConfig({ accessToken: 'ACCES_TOKEN' });
    
      const preference = new Preference(client);
    
      const result = preference.create({ body: {
        items: [...request.data.items],
        back_urls: {
          success: `http://yampi-sc.web.app/success`,
          failure: `http://yampi-sc.web.app/success`,
          pending: `http://yampi-sc.web.app/success`,
        },
        notification_url: "NOTIFICATION_URL"
      }})
      
    return result
    } catch (error) {
      return error
    }
  }
)

export const notification = onRequest(
  {cors: true},
  async (req, res) => { 
    try {
      const id = req.query.id;

      const url = `https://api.mercadopago.com/merchant_orders/${id}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ACCES_TOKEN' 
        }
      })
      const preferenceId = response.data.preference_id;

       // Buscar la orden en Firestore utilizando el preferenceId
      const orderSnapshot = await getFirestore().collection('orders').where('preference_id', '==', preferenceId).get();

      // Si se encuentra una orden con el preferenceId, actualizar el atributo "paid" a true
      if (!orderSnapshot.empty) {
        const orderDoc = orderSnapshot.docs[0].data();
        log("Order found:", orderDoc);

        const orderDocRef = orderSnapshot.docs[0].ref;
        await orderDocRef.update({ paid: true });
      } else {
        log("Order empty")
      }
      res.status(200).send("Success!");
    } catch (err) {
      error(err)
    }
  }
)