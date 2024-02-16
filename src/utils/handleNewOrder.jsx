import toast from "react-hot-toast"


const handleNewOrder = () => {
    toast(() => (
        <div className='flex text-white font-semibold items-center text-xl'>
          ❗ Nueva orden ❗
        </div>
    ), {
        style:{
            background: "#262626",
        }
    })
}

export default handleNewOrder