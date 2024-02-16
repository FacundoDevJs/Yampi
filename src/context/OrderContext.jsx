import {useState, useContext, createContext, useEffect} from 'react';
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    onSnapshot,
    orderBy,
    query,
    where,
  } from "firebase/firestore";
import { db, functions } from "../firebase";
import { httpsCallable } from "firebase/functions";
import handleNewOrder from '../utils/handleNeworder';
import { useAuth } from "../context/AuthContext"
import sound from "../assets/sound.wav"

const context = createContext()

export const useOrder = ()=>{
    const newContext = useContext(context)
    return newContext
}


const OrderProvider = ({children})=>{
   
    const [orders, setOrders] = useState([])
    const [purchases, setPurchases] = useState([])
    const [orderedProducts, setOrderedProducts] = useState([])
    const [price, setPrice] = useState(0)
    const [points, setPoints] = useState(0)
    const [clientInfo, setClientInfo] = useState(null);
    const [wasCalled, setWasCalled] = useState(false)

    const { user } = useAuth()


    const storedUserJSON = localStorage.getItem('userData');
    const localUser = JSON.parse(storedUserJSON);

    const resetValues = () => {
        setOrderedProducts([])
        setPrice(0)
        setPoints(0)
    }

    const addToOrder = (data) => {
        setOrderedProducts([...orderedProducts, data])
    }

    const deleteProduct = (id, productPrice, productPoints)=>{
        try{
            for (let orderedProduct of orderedProducts) {
                if (orderedProduct.productId === id) {
                    addPrice(orderedProduct.quantity * - productPrice)
                    addPoints((orderedProduct.quantity * - productPoints))
                }
            }
            setOrderedProducts(orderedProducts.filter((orderedProduct)=> orderedProduct.productId !== id));
        }
        catch(error){
            Promise.reject(error)
        }
    }

    const addPrice = (productPrice)=>{
        setPrice(price + productPrice)
    }

    const addPoints = (productPoints)=>{
        setPoints(points + productPoints)
    }

    const getOrder = async (id)=> getDoc(doc(db, "orders", id))

    const getOrders = async ()=>{
            try {
                const documents = [];
                const q = query(collection(db, "orders"), orderBy("created_at", "desc"), where("purchase", "==", false))
                const data = await getDocs(q)
                data.forEach((doc) => {
                    const documentData = doc.data()
                    documentData.id = doc.id
                    documents.push(documentData)
                  })
                setOrders(documents)
            } catch (error) {
                console.log(error)
        }
    }

    const getPurchases = async ()=>{
            try {
                const documents = [];
                const q = query(collection(db, "orders"), orderBy("created_at", "desc"), where("purchase", "==", true))
                const data = await getDocs(q)
                data.forEach((doc) => {
                    const documentData = doc.data()
                    documentData.id = doc.id
                    documents.push(documentData)
                  })
                setPurchases(documents)
            } catch (error) {
                console.log(error)
        }
    }

    const addOrder = async ({name, dni, address, phone_number}, paymentMethod)=>{  
       try {
        setWasCalled(false)

        if (paymentMethod === 'mercadopago') {

            let items = [];

             for await (let item of orderedProducts) {
                if ( item.product.price > 0 ) {
                    items.push({
                        id: item.productId,
                        title: item.product.name,
                        currency_id: "ARS",
                        picture_url: item.product.imageURL,
                        quantity: item.quantity,
                        unit_price: Number(item.product.price),

                    })
                }
            }

            items.push({
                id: crypto.randomUUID(),
                title: 'Envío',
                currency_id: "ARS",
                quantity: 1,
                unit_price: 400,
            })
            // items.push({
            //     id: crypto.randomUUID(),
            //     title: 'Envío',
            //     currency_id: "ARS",
            //     quantity: 1,
            //     unit_price: 1,
            // })

            resetValues()
            if (items.length > 0) {
                const createPreference = httpsCallable(functions, 'helloWorld');
                const preference = await createPreference({items})
                await addDoc(collection(db, "orders"), { 
                    orderedProducts, 
                    price, 
                    points,
                    name, 
                    dni, 
                    address, 
                    phone_number, 
                    created_at: new Date(), 
                    completed: false, 
                    paymentMethod, 
                    paid: false,
                    seen: false,
                    purchase: false,
                    preference_id: preference.data.id
                });
                return preference.data
            } else {
                return false
            }
        } else {
            await addDoc(collection(db, "orders"), { 
                orderedProducts, 
                price, 
                points,
                name, 
                dni, 
                address, 
                phone_number, 
                created_at: new Date(), 
                completed: false, 
                paymentMethod, 
                seen: false,
                purchase: false
            });
            resetValues()
            return true
        }
       } catch (error) {
          console.log(error)
          Promise.reject(error)
       }
    }

    const saveClientInfo = (userData) => {
        setClientInfo(userData)
    }

    const addPurchase = async () => {
        const { name, dni, phone_number, id } = clientInfo;
        
        try {
            setWasCalled(false)
            const newOrder = await addDoc(collection(db, "orders"), { 
                orderedProducts, 
                price, 
                points,
                name, 
                dni, 
                phone_number, 
                created_at: new Date(), 
                paid: true,
                seen: false,
                purchase: true,
            });
            await updateDoc(doc(db, "users", id), {
                points: clientInfo.points + points,
                orders: [...clientInfo.orders, newOrder.id]
            });   
            resetValues()
            return true
            
        } catch (error) {
            console.log(error)
            Promise.reject(error)
        }
    }

    const payOrder = async (id) => {
        try {
            setWasCalled(false)
            await updateDoc(doc(db, "orders", id), {paid: true});      
        } catch (error) {
            console.log(error)
        }
    }

    const setAsSeenOrder = async (id) => {
        try {
            setWasCalled(false)
            await updateDoc(doc(db, "orders", id), {seen: true});      
        } catch (error) {
            console.log(error)
        }
    }

    const updateOrder = async (id, data)=>{
        try {
        setWasCalled(false)
        await updateDoc(doc(db, "orders", id), data);           
        await getDoc(doc(db, "orders", id)).then((doc)=>{
            const documentData =  doc.data()
            documentData.id = id
            setOrders(orders.map((order) => order.id === id ? documentData : order ))
        })
        } catch (error) {
            Promise.reject(error)
        }
    }

    const deleteOrder = async (id)=>{
        try{
            setWasCalled(false)
            await deleteDoc(doc(db, "orders", id))
            setPurchases(purchases.filter((purchase) => purchase.id !== id))
        }
        catch(error){
            console.log(error)
            Promise.reject(error)
        }
    }

  
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'orders'), () => {
          getOrders()
        });
    
        return () => unsubscribe();
      }, []);

    useEffect(()=>{
        if (user) {
            setTimeout(()=>{
                setWasCalled(true)
            }, 5000)
        }
        if (user && wasCalled) {
            handleNewOrder()
            const play = () => {
              new Audio(sound).play()
            }
            play()
        }
    }, [orders])


    return (
        <context.Provider value={{
            clientInfo,
            orders,
            purchases,
            price,
            addPrice,
            addPoints,
            deleteProduct,
            orderedProducts,
            setOrderedProducts,
            addToOrder,
            getOrder,
            getOrders,
            getPurchases,
            addOrder,
            addPurchase,
            saveClientInfo,
            payOrder,
            updateOrder,
            deleteOrder,
            setAsSeenOrder,
        }}>
            {children}
        </context.Provider>
    );
}

export default OrderProvider