import { IoIosArrowBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"

const ArrowBack = () => {
  const navigate = useNavigate()

  return (
      <div
      onClick={()=>{navigate(-1)}} 
      className='fixed text-2xl cursor-pointer top-5 left-4 z-10 select-none  w-[48px] h-[48px] flex rounded-xl bg-white shadow-xl shadow-black/20'>
        <IoIosArrowBack
        className="m-auto w-[24px] h-[24px]"
        />
      </div>
  )
}

export default ArrowBack