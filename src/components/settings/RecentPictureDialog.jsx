import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { doc, updateDoc } from 'firebase/firestore';
import { X } from 'lucide-react'
import { db } from '../../utils/firebase';
import { useContext } from 'react';
import { AllItemsContext } from '../Contex';
import PropTypes from 'prop-types';

const RecentPictureDialog = ({ profilePictureState, setProfilePictureState }) => {
    RecentPictureDialog.propTypes = {
        setProfilePictureState: PropTypes.func,
        profilePictureState: PropTypes.shape({
            recentImage: PropTypes.shape({
                url: PropTypes.string,
                crop_area_: PropTypes.shape,
                crop_img_recent: PropTypes.string
            }),
        }),
    };
    const { userIn, setUserIn } = useContext(AllItemsContext);

    const handleClick = async () => {
        setProfilePictureState(prev => ({ ...prev, isLoading: true, urlBlob: profilePictureState.recentImage.crop_img_recent }));
        await updateDoc(doc(db, "userMarketList", userIn.uid), {
            url_img_super_list: profilePictureState.recentImage.url,
            cropp_pixel: profilePictureState.recentImage.crop_area_,
            super_list_img_selected: true
        });
        setTimeout(() => {
            setUserIn(prev => ({ ...prev, url_img_super_list: profilePictureState.recentImage.crop_img_recent, super_list_img_selected: true }));
            setProfilePictureState(prev => ({ ...prev, isRecentPicture: false, isChange: false, isLoading: false }));
        }, 2000);
    }

    return (
        <DialogHeader>
            <DialogTitle>Super List Account</DialogTitle>
            <X
                onClick={() => setProfilePictureState(prev => ({ ...prev, isChange: true, isRecentPicture: false }))}
                className="cursor-pointer w-6 h-6 absolute top-1 right-2 bg-white z-50"
            />
            <div className="flex flex-col items-center gap-8">
                <div className="text-start flex w-full text-lg font-normal">Foto de perfil recortada aqui</div>
                <img
                    className="w-60 h-60"
                    src={profilePictureState.recentImage.crop_img_recent} alt=""
                />

                <div className="flex items-center justify-center w-full gap-2">
                    <button
                        onClick={() => setProfilePictureState(prev => ({ ...prev, isRecentPicture: false, isChange: true }))}
                        className="relative font-medium text-gray-100 flex rounded-full bg-blue-500 px-3 py-1 items-center justify-center gap-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleClick}
                        className="w-full relative font-medium text-gray-100 flex rounded-full bg-blue-500 px-3 py-1 items-center justify-center gap-2"
                    >
                        Guardar imagen de perfil
                    </button>
                </div>
            </div>
        </DialogHeader>

    )
}

export default RecentPictureDialog