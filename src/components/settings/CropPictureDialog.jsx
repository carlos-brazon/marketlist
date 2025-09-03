import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { useContext, useState } from 'react';
import getCroppedImg from "../../utils/cropImage";
import Cropper from "react-easy-crop";
import { AllItemsContext } from '../Contex';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import PropTypes from 'prop-types';
import { uploadFile } from '../../utils/util';
import isEqual from 'lodash/isEqual';

const CropPictureDialog = ({ setProfilePictureState, profilePictureState, imgFromFirebase, setImgFromFirebase }) => {
    CropPictureDialog.propTypes = {
        setProfilePictureState: PropTypes.func,
        setImgFromFirebase: PropTypes.func,
        imgFromFirebase: PropTypes.object,
        profilePictureState: PropTypes.shape({
            urlBlob: PropTypes.string,
            file: PropTypes.instanceOf(Blob),
        }),
    };
    const { userIn, setUserIn } = useContext(AllItemsContext)
    const [crop, setCrop] = useState({ x: profilePictureState?.urlBlob.crop_area_?.x || 0, y: profilePictureState?.urlBlob.crop_area_?.y || 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(profilePictureState.urlBlob.crop_area_ || null);

    const onCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSaveImage = async () => {
        const croppedImage = await getCroppedImg(profilePictureState.urlBlob, croppedAreaPixels);
        setProfilePictureState(prev => ({ ...prev, isLoading: true, urlBlob: croppedImage }));
        let recentsCopy = [...(imgFromFirebase?.recents || [])];
        if (recentsCopy.length === 6) recentsCopy.pop();
        const fromGoogle = userIn.url_img_google === profilePictureState.urlBlob

        // Función para guardar imagen en Firebase y actualizar estados
        const saveImage = async (url, croppedImageRecived) => {
            await updateDoc(doc(db, "userMarketList", userIn.uid), {
                cropp_pixel: croppedAreaPixels,
                super_list_img_selected: !fromGoogle,
                url_img_super_list: fromGoogle ? '' : url,
                ...(fromGoogle && { url_img_google: profilePictureState.urlBlob })
            });
            await setDoc(
                doc(db, "image_profile", userIn.uid),
                {
                    recents: [{ url, crop_area_: croppedAreaPixels, crop_img_recent: croppedImageRecived }, ...recentsCopy]
                },
                { merge: true }
            )
                setUserIn(prev => ({ ...prev, super_list_img_selected: !fromGoogle, ...(fromGoogle && { url_img_google: profilePictureState.urlBlob }), url_img_super_list: fromGoogle ? '' : croppedImageRecived }));
                setProfilePictureState(prev => ({ ...prev, isCrop: false, isChange: false, isLoading: false, isNormalUrl: false }))
                setImgFromFirebase(prev => ({
                    ...prev,
                    recents: [{ url, crop_area_: croppedAreaPixels, crop_img_recent: croppedImageRecived }, ...recentsCopy]
                }));
        };
        const updateImage = async (url) => {
            await updateDoc(doc(db, "userMarketList", userIn.uid), {
                url_img_super_list: fromGoogle ? '' : url,
                super_list_img_selected: !fromGoogle // esto es para no hacer condicional. 
            });
                setUserIn(prev => ({ ...prev, url_img_super_list: croppedImage, super_list_img_selected: !fromGoogle }));
                setProfilePictureState(prev => ({ ...prev, isCrop: false, isChange: false, isLoading: false, isNormalUrl: false }));
        };

        // ---- Caso normal url (url Google y url Dog)----
        if (profilePictureState.isNormalUrl) {
            const imgDogExistInFirebase = recentsCopy.find(item =>
                item.url === profilePictureState.urlBlob &&
                isEqual(item.crop_area_, croppedAreaPixels)
            );

            if (imgDogExistInFirebase) {// si la imagen existe solo actualizo la url en firebase y los estados para pintar
                updateImage(profilePictureState.urlBlob)
                return;
            }
            await saveImage(profilePictureState.urlBlob, croppedImage);
            return;
        }

        // ---- Caso Galería ----
        if (profilePictureState.file) {
            const imageUrl = await uploadFile(profilePictureState.file, userIn.id, userIn.uid);
            if (imageUrl.toDelete.length > 0) {
                const imageToDelete = recentsCopy.filter(image => image.url !== imageUrl.toDelete)
                recentsCopy = imageToDelete
            }

            const existsGallery = recentsCopy.find(item =>
                item.url === imageUrl.toPrint &&
                isEqual(item.crop_area_, croppedAreaPixels)
            );

            if (existsGallery) {// si la imagen existe solo actualizo la url en firebase y los estados para pintar
                updateImage(imageUrl.toPrint)
                return;
            }
            await saveImage(imageUrl.toPrint, croppedImage);
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
                        image={profilePictureState.urlBlob}
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