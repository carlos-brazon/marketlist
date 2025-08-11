import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useContext } from 'react'
import { AllItemsContext } from '../Contex'
import trashIcon from "../../assets/trash-icon.svg";
import cameraAdd from "../../assets/camera-add.svg";
import editIcon from "../../assets/edit-icon-img.svg";
import { defaultSuperListImg } from '../../utils/util';
import PropTypes from 'prop-types';
import { DialogClose } from '@radix-ui/react-dialog';
import { supabase } from '../../utils/supabase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

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
                <DialogClose>
                    <img
                        onClick={() => setProfilePictureState(prev => ({ ...prev, picture: true }))}
                        className={`rounded-full w-40 h-40 ${userIn?.url_img_super_list === defaultSuperListImg && 'p-2 bg-imgBorder'}`}
                        src={userIn?.super_list_img_selected ? userIn?.url_img_super_list : userIn?.url_img_google}
                        alt="" />

                </DialogClose>
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
                            <button onClick={async () => {
                                const docRef = doc(db, "image_profile", userIn.uid);
                                const docSnap = await getDoc(docRef);
                                let currentRecents = docSnap.data()?.recents || [];
                                console.log(currentRecents);


                                const filterArrayRecents = currentRecents.filter(elem => !(elem.url == "profile_pictures/m4wB7QYrH66iccNiJT9k/_Madrid-escudo.jpeg" && elem.crop_area_.height === 168 && elem.crop_area_.width === 168 && elem.crop_area_.x === 66 && elem.crop_area_.y === 0));
                                // const filterArrayRecents = currentRecents.filter(elem => !elem.url == imageUrl.toPrint && elem.crop_area_.height === croppedAreaPixels.height && elem.crop_area_.width === croppedAreaPixels.width && elem.crop_area_.x === croppedAreaPixels.x && elem.crop_area_.y === croppedAreaPixels);
                                console.log(filterArrayRecents);

                                // await setDoc(
                                //     doc(db, "image_profile", userIn.uid),
                                //     {
                                //         recents: [{ url: imageUrl.toPrint, crop_area_: croppedAreaPixels }, ...filterArrayRecents]
                                //     },
                                //     { merge: true }
                                // );

                            }} className="p-2 bg-red-600"> traer </button>
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