import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useContext } from 'react'
import { AllItemsContext } from '../Contex'
import trashIcon from "../../assets/trash-icon.svg";
import cameraAdd from "../../assets/camera-add.svg";
import editIcon from "../../assets/edit-icon-img.svg";
import { defaultSuperListImg } from '../../utils/util';
import PropTypes from 'prop-types';

const ProfilePictureDialog = ({ setProfilePictureState }) => {
    ProfilePictureDialog.propTypes = {
        setProfilePictureState: PropTypes.func,
    };
    const { userIn } = useContext(AllItemsContext)
    return (

        <DialogHeader>
            <DialogTitle>Super List Account</DialogTitle>
            <div className='flex flex-col items-center gap-8'>
                <div className='text-start flex w-full text-lg font-normal'>
                    Foto de perfil
                </div>
                <img
                    onClick={() => setProfilePictureState(prev => ({ ...prev, picture: true }))}
                    className={`rounded-full w-40 h-40 ${userIn?.url_img_super_list === defaultSuperListImg && 'p-2 bg-imgBorder'}`}
                    src={userIn?.super_list_img_selected ? userIn?.url_img_super_list : userIn?.url_img_google}
                    alt="" />
                <div className='flex items-center justify-center w-full gap-2'>
                    {userIn?.url_img_super_list === defaultSuperListImg
                        ?

                        <button onClick={() => setProfilePictureState(prev => ({ ...prev, isChange: true }))}
                            className='w-full relative font-medium text-gray-100 flex rounded-full bg-blue-500 px-3 py-1 items-center justify-center gap-2'>
                            <img
                                className="flex w-5 h-5 rounded-full"
                                src={cameraAdd} alt="" />
                            Añadir foto de perfil
                        </button>
                        :
                        <div className='flex items-center justify-center w-full gap-2'>
                            <button
                                onClick={() => setProfilePictureState(prev => ({ ...prev, isChange: true }))}
                                className='w-full relative font-medium text-gray-100 flex rounded-full bg-blue-500 px-3 py-1 items-center justify-center gap-2'>
                                <img
                                    className="flex w-5 h-5 rounded-full"
                                    src={editIcon} alt="" />
                                Cambiar
                            </button>
                            <button
                                onClick={() => setProfilePictureState(prev => ({ ...prev, isRemove: true }))}
                                className='w-full relative font-medium text-gray-100 flex rounded-full bg-blue-500 px-3 py-1 items-center justify-center gap-2'>
                                <img
                                    className="flex w-5 h-5 rounded-full"
                                    src={trashIcon} alt="" />
                                Quitar
                            </button>
                        </div>

                    }
                </div>
            </div>
        </DialogHeader>

    )
}

export default ProfilePictureDialog