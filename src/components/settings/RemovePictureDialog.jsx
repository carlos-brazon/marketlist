import { DialogHeader } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { useContext } from 'react'
import { AllItemsContext } from '../Contex'
import arrowRightChangeImage from "../../assets/right-md.svg";
import { defaultSuperListImg } from '../../utils/util';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import PropTypes from 'prop-types';

const RemovePictureDialog = ({ setProfilePictureState }) => {
    RemovePictureDialog.propTypes = {
        setProfilePictureState: PropTypes.func,

    };
    const { userIn, setUserIn } = useContext(AllItemsContext)

    const handleRemoveImg = async () => {
        setProfilePictureState(prev => ({ ...prev, isRemove: false, isLoading: true, url: defaultSuperListImg }));
        await updateDoc(doc(db, "userMarketList", userIn.uid), {
            url_img_super_list: defaultSuperListImg,
            cropp_pixel: {},
            super_list_img_selected: true
        });
        setTimeout(() => {
            setUserIn(prev => ({ ...prev, super_list_img_selected: true, url_img_super_list: defaultSuperListImg }))
            setProfilePictureState(prev => ({ ...prev, container: true, isRemove: false, isLoading: false }))
        }, 2500);
    }

    return (

        <DialogHeader>
            <X onClick={() => setProfilePictureState(prev => ({ ...prev, isRemove: false }))} className="cursor-pointer w-6 h-6 absolute top-2 right-2 bg-white z-50" />

            <div className='flex flex-col items-center gap-6'>

                <div className='flex items-center justify-center gap-3'>
                    <img
                        className={`rounded-full w-24 h-24 ${userIn.url_img_super_list === defaultSuperListImg && 'p-2 bg-imgBorder'}`}
                        src={userIn.super_list_img_selected ? userIn?.url_img_super_list : userIn?.url_img_google}
                        alt="" />
                    <img
                        className=' rounded-full w-7 h-7'
                        src={arrowRightChangeImage}
                        alt="" />
                    <img
                        className=' rounded-full w-24 h-24 p-2 bg-imgBorder'
                        src={defaultSuperListImg}
                        alt="" />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <h2 className="text-lg font-medium">
                        ¿Quieres eliminar tu foto de perfil?
                    </h2>
                    <span className="text-base">
                        Tu foto anterior se guardará en tu álbum de fotos de perfil anteriores y se usará esta imagen en su lugar.
                    </span>
                </div>
                <div className='flex gap-2 place-content-between w-full'>
                    <button onClick={() => setProfilePictureState(prev => ({ ...prev, isRemove: false }))} className='flex rounded-full bg-blue-400 px-3 py-1'>Cancelar</button>
                    <button onClick={() => handleRemoveImg()} className='flex rounded-full bg-blue-400 px-3 py-1'>Cambiar</button>
                </div>
            </div>
        </DialogHeader>
    )
}

export default RemovePictureDialog