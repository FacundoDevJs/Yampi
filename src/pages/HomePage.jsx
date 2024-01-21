import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { FaCircle } from "react-icons/fa";
import image from "./logo2.png";
import './HomePage.css'; // Agrega un archivo CSS para las animaciones

const HomePage = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const { user } = useAuth();
  const { localUser } = useUser();
  const navigate = useNavigate();

  return (
    <div className='bg-neutral-900 w-full min-h-[100vh] pt-12'>
      <img src={image} className="h-24 m-auto" alt="Logo" />
      <div className="max-w-[500px] m-auto text-white pt-20 px-4 flex flex-col items-start">
        {localUser ? (
          <div>
            <div className="font-bold text-3xl pb-12">
              Bienvenido de nuevo a la aplicación de <b className="text-red-500">Yampi San Cristobal</b>
            </div>
            <Link
              className="bg-red-500 rounded-xl p-4 font-bold mt-12 text-xl"
              to={user ? '/tus-productos' : '/productos'}
            >
              {user ? 'Tus Productos' : 'Explora nuestro catálogo'}
            </Link>
          </div>
        ) : (
          <div>
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`px-4 font-bold h-[230px] text-3xl pb-12 fade ${
                  slideIndex === index ? 'visible' : 'invisible'
                }`}
              >
                {index === 0 && (
                  <>
                    Bienvenido al paraíso helado: la aplicación de
                    <b className="text-red-500"> Yampi San Cristobal 🌟</b>
                  </>
                )}
                {index === 1 && (
                  <>
                    Haz tus momentos más dulces con solo unos clics.
                    <b className="text-red-500"> ¡Explora nuestro catálogo, elige y disfruta! 🍧</b>
                  </>
                )}
                {index === 2 && (
                  <>
                    Cada compra cuenta para obtener productos gratuitos.
                    <b className="text-red-500"> ¡Acumula puntos a toda marcha! 🏆</b>
                  </>
                )}
                {index === 3 && (
                  <>
                    Canjea tus puntos por productos <b className="text-red-500"> Gratis</b> que te esperan tanto en el local como en nuestra aplicación.
                    🌟
                  </>
                )}
              </div>
            ))}
            <div className="flex justify-around items-center pr-8">
              <div className="flex transition-all">
                {[...Array(4)].map((_, i) => (
                  <FaCircle
                    key={i}
                    className={`w-4 h-4 text-${
                      slideIndex === i ? 'red' : 'neutral'
                    }-500 mx-1 transition-all`}
                  />
                ))}
              </div>

              <button
                className="bg-red-500 rounded-xl p-4 font-bold text-xl ml-auto"
                onClick={() => {
                  if (slideIndex < 3) {
                    setSlideIndex(slideIndex + 1);
                  } else {
                    navigate('create-user')
                  }
                }}
              >
                {slideIndex === 3 ? 'Crear Usuario' : 'Siguiente'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
