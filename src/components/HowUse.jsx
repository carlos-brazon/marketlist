

const HowUse = () => {
    return (
        <div className='flex flex-col gap-3 p-4'>
            <div>
                <p> 1 -. Hacer un clic en un ítem de la lista lo marcará como tachado.</p>
                <p> 2 -. Doble clic elimina el ítem de la lista.</p>
                <p> 3 -. En el signo (+) puedes desplegar un nuevo campo para iniciar una nueva lista o actividad</p>
            </div>

            <div className='flex flex-col'>
                <span className='font-semibold'>Nota:</span>
                <ul className='flex flex-col gap-2 pt-2 pl-5'>
                    <li className='list-disc'> Puedes utilizar el mismo usuario simultaneamente en dos dispositivos compartiendo la información de tu lista con una persona de confianza.</li>
                    <li className='list-disc'> Desde la configuración del navegador puedes agregar el link a tu pantalla de inicio en el móvil para facilitar el acceso a la app.</li>

                </ul>

            </div>
        </div>
    )
}

export default HowUse