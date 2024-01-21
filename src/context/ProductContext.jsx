import { useState, createContext, useContext, useEffect } from "react";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    query,
  } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";


const context = createContext()

export const useProduct = ()=>{
    const newContext = useContext(context);
    if (!newContext) throw new Error("There is no Product provider");
    return newContext;
};

  
const ProductProvider = ({children})=>{

    const [products, setProducts] = useState([])
    const [listOfTastes, setListOfTastes] = useState([])

    const getListOfTastes = async () => {
        try {
            const q = await getDoc(doc(db, "listOfTstes", "aKrlVeftWXVuoKCzNgid"))
            const data = q.data()
            let goodData = data.listOfTastes
            setListOfTastes(goodData)
        } catch (error) {
            console.log(error)
        }
    }

    const addNewTaste = async (newTaste, category) => {
        let newListOfTastes = listOfTastes
        let updatedCategory = listOfTastes[category]
        updatedCategory.push(newTaste)
        newListOfTastes[category] = updatedCategory
        await updateDoc(doc(db, "listOfTstes", "aKrlVeftWXVuoKCzNgid"), {listOfTastes: newListOfTastes});
        setListOfTastes(newListOfTastes)
    }

    const deleteTaste = async (deletedTaste, category) => {
        let newListOfTastes = listOfTastes
        let updatedCategory = listOfTastes[category].filter((taste)=> taste !== deletedTaste)
        newListOfTastes[category] = updatedCategory
        await updateDoc(doc(db, "listOfTstes", "aKrlVeftWXVuoKCzNgid"), {listOfTastes: newListOfTastes});
        setListOfTastes(newListOfTastes)
        return updatedCategory
    }

    const getProduct = (id) => getDoc(doc(db, "products", id));

    const getProducts = async () => {
    try {
        const documents = []
        const q = query(collection(db, "products"))
        const data = await getDocs(q)
        await data.forEach((doc) => {
            const documentData = doc.data()
            documentData.id = doc.id
            documents.push(documentData)
          })
        setProducts(documents)
    } catch (error) {
        console.log(error)
    }};

    const addProduct = async ({name, price, points, exchangePoints, imageFile, tastes, tastesLimit}) => {
        try {
            const docRef = await addDoc(collection(db, "products"), { name, price, points, exchangePoints, created_at: new Date(), tastes, imageURL: null, tastesLimit });            
            if(imageFile){
                const storageRef = ref(storage, docRef.id)
                await uploadBytes(storageRef, imageFile)
                const imageURL = await getDownloadURL(storageRef)
                await updateDoc(docRef, {"imageURL": imageURL});
                // setProducts(products.map((product) => product.id === id ? documentData : product));
                
            }
            const newDoc = await getDoc(doc(db, "products", docRef.id))
            let documentData =  newDoc.data()
            documentData.id = docRef.id
            setProducts([...products, documentData])
            return true
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const deleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, "products", id))
            const storageRef = ref(storage, id)
            setProducts(products.filter((product)=> product.id !== id));
            await deleteObject(storageRef)
        } catch (error) {
            console.log(error)
        }
    }
    
    const updateProduct = async ({name, price, points, exchangePoints, imageFile, tastes, tastesLimit}, id) => {
        let imageURL;
        if(imageFile){
            const storageRef = ref(storage, id)
            await uploadBytes(storageRef, imageFile)
            imageURL = await getDownloadURL(storageRef)
            await updateDoc(doc(db, "products", id), {name, price, points, exchangePoints, imageURL, tastes, tastesLimit});
        } 
        else {
            await updateDoc(doc(db, "products", id), {name, price, points, exchangePoints, tastes, tastesLimit});
        }
        getDoc(doc(db, "products", id)).then((doc)=>{
            const documentData =  doc.data()
            documentData.id = id
            setProducts(products.map((product) => product.id === id ? documentData : product));
        });
    }

    useEffect(() => {
        if (listOfTastes.length === 0) {
            getListOfTastes()
        }
    }, []);

    return (
        <context.Provider value={{
            products,
            listOfTastes,
            addNewTaste,
            deleteTaste,
            getProduct,
            getProducts,
            addProduct,
            deleteProduct,
            updateProduct,
        }}>
            {children}
        </context.Provider>
    );

}

export default ProductProvider