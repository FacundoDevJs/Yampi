import toast from "react-hot-toast"
import { VscError } from "react-icons/vsc"

const handleError = (message) => {
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

export default handleError