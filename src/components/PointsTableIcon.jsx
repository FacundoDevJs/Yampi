import { RiFileListLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const PointsTableIcon = ({top}) => {

  const navigate = useNavigate()

  return (
    <div
    onClick={()=>{
      navigate('/points-table')
    }}    
    className={
      top
      ? 'fixed cursor-pointer top-5 right-4 z-10 select-none w-[48px] h-[48px] flex rounded-xl bg-white text-black shadow-xl shadow-black/20'
      : 'fixed cursor-pointer bottom-5 left-4 z-10 select-none w-[48px] h-[48px] flex rounded-xl bg-white text-black shadow-xl shadow-black/20'
    }>
      <RiFileListLine
      className="m-auto w-[24px] h-[24px]"
      />
    </div>
  )
}

export default PointsTableIcon