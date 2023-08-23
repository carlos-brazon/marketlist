import React from 'react'

const HowUse = () => {
    return (
        <div className='flex flex-col gap-3 p-4'>
            <div>
                <p> 1 - Un click tacha el producto agregado.</p>
                <p> 2 - Doble click elimina el producto de la lista de compras.</p>
            </div>

            <div className='flex flex-col'>
                <span className='font-semibold'>Nota:</span>
                <ul className='flex flex-col gap-2 pt-2 pl-5'>
                    <li className='list-disc'> Puedes utilizar el mismo usuario simultaneamente en dos dispositivos compartiendo la información de tu lista de compras.</li>
                    <li className='list-disc'> Desde la configuración del navegador puedes agregar el link a tu pantalla de inicio en el móvil para facicilar el acceso a la app.</li>

                </ul>

            </div>
        </div>
    )
}

export default HowUse