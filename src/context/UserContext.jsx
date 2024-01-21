import {useContext, createContext, useEffect, useState} from 'react';
import { db } from "../firebase";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const context = createContext();

export const useUser = () => {
  const newContext = useContext(context);
  return newContext
};

const UserProvider = ({ children }) => {
  const [localUser, setLocalUser] = useState(null)
  
  const { user } = useAuth()

  const getUser = async (id) => getDoc(doc(db, "uesrs", id))

  const getUserByDni = async (dni) => {
    const q = query(collection(db, "users"), where("dni", "==", dni))
    const data = await getDocs(q)
    if ( data.docs.length > 0 ) {
      let userData = data?.docs[0]?.data()
      userData.id = data?.docs[0]?.id
      return userData
    } 
    else {
      return undefined
    }
  }

  const createUser = async ({name, dni, phone_number}, local)=>{  
    try {
    const doc = await addDoc(collection(db, "users"), { name, dni, phone_number, created_at: new Date(), points: 0, admin: false, client: true, orders: []});
  
    const userObject = {
      id: doc.id,
      name,
      dni,
      phone_number,
      points: 0,
      admin: false,
      orders: []
    }

    const userJSON = JSON.stringify(userObject);

    if (local) {
      localStorage.setItem('userData', JSON.stringify(userJSON));
      setLocalUser(userObject)
    } else {
      return userObject
    }

    } catch (error) {
       console.log(error)
       Promise.reject(error)
    }
 }

  const loginUser = async ({dni}) => {
    try {
      const q = query(collection(db, "users"), where("dni", "==", dni))
      const data = await getDocs(q)
      if ( data.docs.length > 0 ) {
        let userData = data?.docs[0]?.data()
        userData.id = data?.docs[0]?.id
        localStorage.setItem('userData', JSON.stringify(userData))
        setLocalUser(userData)
        return true
      }
      else {
        return undefined
      }
    } 
    catch (error) {
      console.log(error)
      Promise.reject(error)
    }
  }


  useEffect(()=>{
    const changeAdminState =  async () => {
      const storedUserJSON = localStorage.getItem('userData');
      
      if (storedUserJSON) {
        const storedUserObject = JSON.parse(storedUserJSON);
        setLocalUser(storedUserObject)
        if (storedUserObject.admin === false && user) {
          let newStoreduserObject = storedUserObject;
          newStoreduserObject.admin = true
          localStorage.setItem('userData', JSON.stringify(newStoreduserObject));
          await updateDoc(doc(db, "users", storedUserObject.id), {admin: true});   
        }
        else {
          let newStoreduserObject = storedUserObject;
          newStoreduserObject.admin = false;
          localStorage.setItem('userData', JSON.stringify(newStoreduserObject));
        }
        await loginUser({dni: storedUserObject.dni})
      }
  }
  changeAdminState()
 }, [user])

  return (
    <context.Provider value={{
      localUser,
      getUser,
      getUserByDni,
      createUser,
      loginUser
    }}>
        {children}
    </context.Provider>
);
}

export default UserProvider