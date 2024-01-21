import { useState, useEffect } from 'react';
import moment from 'moment';

const ProtectedRoute = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const checkBusinessHours = () => {
      const now = moment();
      const dayOfWeek = now.day(); // Obtiene el día de la semana (0: Domingo, 1: Lunes, ..., 6: Sábado)
      let isOpenNow = false;

      if (dayOfWeek >= 1 && dayOfWeek <= 4) {
        // De lunes a jueves: 12:00 a 23:00
        const businessStartTime = moment().set({ hour: 12, minute: 0, second: 0 });
        const businessEndTime = moment().set({ hour: 23, minute: 0, second: 0 });
        isOpenNow = now.isBetween(businessStartTime, businessEndTime);
      } else if (dayOfWeek === 5 || dayOfWeek === 6) {
        // Viernes y sábado: 12:00 a 01:30
        const businessStartTime = moment().set({ hour: 12, minute: 0, second: 0 });
        const businessEndTime = moment().set({ hour: 1, minute: 30, second: 0 }).add(1, 'day');
        isOpenNow = now.isBetween(businessStartTime, businessEndTime);
      } else {
        // Domingo: 11:00 a 00:00
        const businessStartTime = moment().set({ hour: 11, minute: 0, second: 0 });
        const businessEndTime = moment().set({ hour: 0, minute: 0, second: 0 }).add(1, 'day');
        isOpenNow = now.isBetween(businessStartTime, businessEndTime);
      }
      setIsOpen(isOpenNow);
    };

    checkBusinessHours()
    const interval = setInterval(checkBusinessHours, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isOpen ? (
        children
      ) : (
        <div className='bg-red-500 w-full h-[100vh] flex'>
          <div className='bg-white rounded-xl p-4 m-auto text-xl'>
            <h1 className='py-2 font-bold'>❌ El negocio está cerrado ❌</h1>
            <p className='font-semibold'>Horario de atención:</p>
            <div><p className='font-semibold inline'>📅 Lunes a jueves:</p> de <p className='font-semibold inline'>12:00 a 23:00 </p></div>
            <div><p className='font-semibold inline'>📅 Viernes y sábado:</p> de <p className='font-semibold inline'>12:00 a 01:30 </p></div>
            <div><p className='font-semibold inline'>📅 Domingo:</p> de <p className='font-semibold inline'>11:00 a 00:00 </p></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
