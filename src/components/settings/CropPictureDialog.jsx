import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { useContext, useState } from 'react';
import getCroppedImg from "../../utils/cropImage";
import Cropper from "react-easy-crop";
import { AllItemsContext } from '../Contex';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import PropTypes from 'prop-types';
import { uploadFile } from '../../utils/util';

const CropPictureDialog = ({ setProfilePictureState, profilePictureState }) => {
    CropPictureDialog.propTypes = {
        setProfilePictureState: PropTypes.func,
        profilePictureState: PropTypes.shape({
            imageSrc: PropTypes.string,
            file: PropTypes.instanceOf(File),
        }),
    };
    const { userIn, setUserIn } = useContext(AllItemsContext)
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSaveImage = async () => {
        if (userIn.url_img_google === profilePictureState.imageSrc) { // verifico que la imagen es igual a la de google
            setProfilePictureState(prev => ({ ...prev, isLoading: true, url: userIn.url_img_google }))
            await updateDoc(doc(db, "userMarketList", userIn.uid), {
                cropp_pixel: {},
                super_list_img_selected: false,
                url_img_google: profilePictureState.imageSrc,
                url_img_super_list: ''
            });
            setTimeout(() => {

                setUserIn(prev => ({ ...prev, super_list_img_selected: false, url_img_google: profilePictureState.imageSrc, url_img_super_list: '' }));
                setProfilePictureState(prev => ({ ...prev, isCrop: false, isChange: false, isLoading: false }))
            }, 2500);

        } else {
            const croppedImage = await getCroppedImg(profilePictureState.imageSrc, croppedAreaPixels);
            setProfilePictureState(prev => ({ ...prev, isLoading: true, url: croppedImage }))

            if (profilePictureState.file) { //aqui subo imagen a supabase si viene de galeria
                try {
                    const imageUrl = await uploadFile(profilePictureState.file);
                    if (imageUrl.length > 0) {

                        await updateDoc(doc(db, "userMarketList", userIn.uid), {
                            url_img_super_list: imageUrl,
                            cropp_pixel: croppedAreaPixels,
                            super_list_img_selected: true
                        });
                        setUserIn(prev => ({ ...prev, url_img_super_list: croppedImage, super_list_img_selected: true }));
                        setProfilePictureState(prev => ({ ...prev, isCrop: false, isChange: false, isLoading: false, imageSrc: imageUrl, file: null }));

                    } else {
                        setProfilePictureState(prev => ({ ...prev, isCrop: false, isChange: false, isLoading: false }))
                    }
                } catch (error) {
                    console.log(error);
                }

            } else {// aqui gestiono las imagenes de perros 
                await updateDoc(doc(db, "userMarketList", userIn.uid), {
                    url_img_super_list: profilePictureState.imageSrc,
                    cropp_pixel: croppedAreaPixels,
                    super_list_img_selected: true
                });
                setTimeout(() => {
                    setUserIn(prev => ({ ...prev, url_img_super_list: croppedImage, super_list_img_selected: true }));
                    setProfilePictureState(prev => ({ ...prev, isCrop: false, isChange: false, isLoading: false }));
                }, 2500);
            }

        }

    };
    return (
        <DialogHeader>
            <DialogTitle>Super List Account</DialogTitle>
            <X
                onClick={() => setProfilePictureState(prev => ({ ...prev, isChange: true, isCrop: false }))}
                className="cursor-pointer w-6 h-6 absolute top-1 right-2 bg-white z-50"
            />
            <div className="flex flex-col items-center gap-8">
                <div className="text-start flex w-full text-lg font-normal">Recorta foto de perfil</div>

                <div className="relative w-full h-72 bg-gray-200">
                    <Cropper
                        image={profilePictureState.imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // Mantiene la imagen cuadrada
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                <div className="flex items-center justify-center w-full gap-2">
                    <button
                        onClick={() => setProfilePictureState(prev => ({ ...prev, isCrop: false, isChange: true }))}
                        className="relative font-medium text-gray-100 flex rounded-full bg-blue-500 px-3 py-1 items-center justify-center gap-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSaveImage}
                        className="w-full relative font-medium text-gray-100 flex rounded-full bg-blue-500 px-3 py-1 items-center justify-center gap-2"
                    >
                        Guardar imagen de perfil
                    </button>
                </div>
            </div>
        </DialogHeader>
    )
}

export default CropPictureDialog