import {useContext, createContext, useEffect, useState} from 'react';
import { db } from "../firebase";
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const context = createContext();

export const useUser = () => {
  const newContext = useContext(context);
  return newContext
};

const UserProvider = ({ children }) => {
  const [localUser, setLocalUser] = useState(null)
  const [users, setUsers] = useState([])
  
  const { user } = useAuth()

  const usersCounter = async () => {
    const coll = collection(db, "users");
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count
  }

  const getUser = async (id) => getDoc(doc(db, "users", id))

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

  const getUsers = async () => {
    try {
      const documents = []
      const q = query(collection(db, "users"))
      const data = await getDocs(q)
      await data.forEach((doc) => {
          const documentData = doc.data()
          documentData.id = doc.id
          documents.push(documentData)
      })
      setUsers(documents)
    } catch (error) {
        console.log(error)
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

  const updateUser = async ({name, dni, phone_number}, id) => {
    try {
      await updateDoc(doc(db, "users", id), {name, dni, phone_number});
      setUsers(users.map((user) => user.id === id ? {...user, name, dni, phone_number } : user));
    } 
    catch (error) {
      console.log(error)
    }
  }

  const deleteUser = async (id) => {
    try {
        await deleteDoc(doc(db, "users", id))
        setUsers(users.filter((user) => user.id !== id))
    }
    catch (error){
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
      users,
      usersCounter,
      getUser,
      getUserByDni,
      getUsers,
      createUser,
      deleteUser,
      updateUser,
      loginUser
    }}>
        {children}
    </context.Provider>
);
}

export default UserProvider