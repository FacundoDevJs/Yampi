import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'
import { useAuth } from "../context/AuthContext";
import image from "./logo2.png"

import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai'
import {VscError} from 'react-icons/vsc'

const Signin = () => {

  const { login, resetPassword } = useAuth();
  const [user, setUser] = useState({
      email: "",
      password: "",
    });

    const [inputType, setInputType] = useState('password')
    
    const navigate = useNavigate();
  
    const handleError = (message)=>{
      toast(() => (
          <div className='flex text-white items-center'>
              <div className='w-[20%] h-full flex items-center'>
                  <VscError className='text-white w-8 h-8'/>
              </div>
                <div className='w-[80%]'>
                    <div className='font-semibold text-[15px]'>{message}</div>
                </div>
          </div>
      ), {
          style:{
              background: "#262626",
          }
      })
  }

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await login(user.email, user.password);
        navigate('/tus-productos');
      } catch (error) {
        console.log(error)
        if(error.message == 'Firebase: Error (auth/wrong-password).') handleError('Contraseña incorrecta')
        else if (error.message == 'Firebase: Error (auth/user-not-found).') handleError('Email incorrecto')
        else if (error.message == 'Firebase: Error (auth/invalid-login-credentials).') handleError('Email o contraseña incorrectos')
        
        else handleError(error.message);
      }
    };
  
    const handleResetPassword = async (e) => {
      e.preventDefault();
      if (!user.email) return handleError("Escribe un mail para reestablecer tu contraseña");
      try {
        await resetPassword(user.email);
        handleError('Te enviamos un mail. Revisa tu bandeja de entrada')
      } catch (error) {
        if (error.message == 'Firebase: Error (auth/invalid-email).') handleError('Email incorrecto')
        else handleError(error.message);
      }
    };
  
    return (
      <div className="w-full min-h-[100vh] flex flex-col items-center justify-around text-black bg-red-500 py-10">
        <img src={image} className="w-32"/>
          <form
            onSubmit={handleSubmit}
            className="w-[90%] max-w-[600px] flex flex-col  shadow-lg shadow-black/50 rounded-2xl px-8 py-6 bg-white text-xl"
          >
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-2xl font-bold mb-2"
              >
              Email
            </label>
            <input
              autoComplete="off"
              type="email"
              name="email"
              id="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full shadow appearance-none border rounded p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="tuemail@compania.tld"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-2xl font-bold mb-2"
            >
              Contraseña
            </label>
            <div className="w-full flex border rounded items-center shadow">
              <input
                autoComplete="off"
                type={inputType}
                name="password"
                id="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="appearance-none w-[90%] p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="*************"
              />
              <div className="text-neutral-500">
                {
                  inputType == 'password'
                  &&
                  <AiFillEyeInvisible
                  className="h-8 w-8"
                  onClick={()=>setInputType('text')}
                  />
                }
                {
                  inputType == 'text'
                  &&
                  <AiFillEye 
                  className="h-8 w-8"
                  onClick={()=>setInputType('password')}
                  />
                }
              </div>
            </div>
          </div>

  
          <button className="bg-red-500  transition-allmy-3 text-white font-bold py-2 px-2 rounded outline-none" type="submit">
            Inicia sesión
          </button>
          <a
            className="inline-block align-baseline font-bold mt-4 text-red-500"
            href="#!"
            onClick={handleResetPassword}
          >
            Olvidaste tu contraseña?
          </a>
        </form>
        <p className="w-[90%] max-w-[600px] my-2 flex justify-between px-4 py-6 bg-white text-xl font-bold rounded-2xl shadow-lg shadow-black/50">
          No tienes una cuenta?
          <Link to="/signup" className="text-red-500 hover:text-blue-900">
            Registrarse
          </Link>
        </p>
      </div>
    );
}

export default Signin