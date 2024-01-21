import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { IoMdAdd } from "react-icons/io";
import {TbShoppingBagPlus, TbShoppingCartPlus} from "react-icons/tb"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navigate = useNavigate()

  const handleCLick = () => {
    setIsOpen(true)
    setTimeout(()=>{
      setIsOpen(false)
    }, [5000])
  }

  return (
    <div className="fixed bottom-0 left-0 w-full transition-all">
      <div className="bg-white h-[60px] text-3xl flex justify-center">
        <div
          className={
            isOpen
            ? 'absolute cursor-pointer select-none bg-red-500 h-[72px] w-[208px] transition-all rounded-full bottom-[20px] shadow-lg shadow-black/60 text-white flex'
            : 'absolute cursor-pointer select-none bg-red-500 h-[72px] w-[72px] transition-all rounded-full bottom-[20px] shadow-lg shadow-black/60 text-white flex'
          }
          >
          {
          isOpen 
          ? 
          <div className="flex items-center m-auto">
            <TbShoppingCartPlus
          onClick={()=>{
            navigate('/add-purchase')
          }} 
          className="h-10 w-10 mx-8"/>  
          <TbShoppingBagPlus 
          onClick={()=>{
            navigate('/add-product')
          }}
          className="h-10 w-10 mx-8"/>
          </div>
          : 
          <IoMdAdd
          onClick={()=>{
            handleCLick()
          }}
          className="h-10 w-10 m-auto"
          />
          }
        </div>
      </div>
    </div>
  );
};

export default NavBar;
