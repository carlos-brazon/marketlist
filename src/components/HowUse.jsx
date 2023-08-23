import React from 'react'

const HowUse = () => {
    return (
        <div className='flex flex-col gap-3 p-4'>
            <div>
                <p> 1 - Un click tacha el producto agregado</p>
                <p> 2 - Dos clicks elimina el producto de la lista de compras</p>
            </div>

            <div>
                <p><span className='font-semibold'>Nota</span>: Puedes utilizar el mismo usuario simultaneamente en dos dispositivos diferentes</p>
                <p><span className='font-semibold'>Nota</span>: Desde el navegador puedes agregar el link a tu pantalla de inicio en el movil para facicilar el acceso a al app</p>

            </div>
        </div>
    )
}

export default HowUse