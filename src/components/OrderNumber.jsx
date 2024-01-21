import { useOrder } from "../context/OrderContext"

const OrderNumber = ({white}) => {

  const { orderedProducts } = useOrder()

  return orderedProducts.length > 0 &&
  (
    <div
    className={
      white
      ? 'fixed cursor-pointer top-12 right-3 z-10 select-none w-8 h-8 flex rounded-full bg-white text-black shadow-xl shadow-black/20'
      : 'fixed cursor-pointer top-12 right-3 z-10 select-none w-8 h-8 flex rounded-full bg-red-500 text-white shadow-xl shadow-black/20'
    }>
      <div className="m-auto">
        { orderedProducts.length } 
      </div>
    </div>
  )
}

export default OrderNumber