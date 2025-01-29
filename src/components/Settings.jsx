import { Link } from 'react-router-dom';
import arrowLeft from "../assets/arrow-left.svg";

const Settings = () => {

    return (
        <div className=" p-2">

            <div className="flex items-center">
                <Link to={'/'}>
                    <img src={arrowLeft} alt="" className="w-4 h-4 absolute left-3 top-3" />
                </Link>
                <div>Editar Perfil</div>
            </div>
        </div>
    )
}

export default Settings