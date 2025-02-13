import {
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useContext, useState } from "react"
import { AllItemsContext } from "../Contex"
import { Button } from "../ui/button"
import update from "../../assets/update.svg";
import UploadIcon from "../../assets/upload.svg";
import { doc, setDoc } from "firebase/firestore"
import { db } from "../../utils/firebase"
import PropTypes from 'prop-types';
import { ramdomDog } from "../../utils/util"
import { Input } from "../ui/input"
import { useDropzone } from "react-dropzone";

const ChangePictureDialog = ({ setProfilePictureState, imgFromFirebase, setImgFromFirebase }) => {
    const MAX_FILE_SIZE = 1000000;
    const ACCEPTED_IMAGE_TYPES = { "image/*": [".jpeg", ".jpg", ".png"] };

    ChangePictureDialog.propTypes = {
        setProfilePictureState: PropTypes.func,
        setImgFromFirebase: PropTypes.func,
        imgFromFirebase: PropTypes.array,
    };
    const { userIn } = useContext(AllItemsContext);
    const [errorFile, setErrorFile] = useState(false)
    const { getRootProps, getInputProps } = useDropzone({
        accept: ACCEPTED_IMAGE_TYPES,
        maxSize: MAX_FILE_SIZE,
        onDrop: (files, rejected) => {
            if (files.length >= 1) {
                setProfilePictureState(prev => ({ ...prev, imageSrc: URL.createObjectURL(files[0]), isCrop: true, isChange: false, file: files[0] }));
            }
            if (rejected.length >= 1) {
                setErrorFile(
                    "El archivo es demasiado grande o no tiene el formato adecuado"
                );
            }
        },
    });

    return (
        <DialogHeader>
            <X onClick={() => setProfilePictureState(prev => ({ ...prev, isChange: false }))} className="cursor-pointer w-6 h-6 absolute top-2 right-2 bg-white z-50" />
            <DialogTitle>Selecciona foto de perfil</DialogTitle>
            <div className='flex flex-col items-center gap-8'>
                <Tabs defaultValue="ilustration" className="flex flex-col justify-center items-center pt-2 w-full">
                    <TabsList className="flex gap-2">
                        <TabsTrigger value="ilustration">Ilustración</TabsTrigger>
                        <TabsTrigger value="galery">Galería</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ilustration">
                        <DropdownMenuSeparator />
                        {userIn.url_img_google && <>
                            <div className="flex flex-col gap-3">
                                <div className="text-start flex w-full">Imagen de google</div>
                                <img
                                    className='w-16 h-16 relative rounded-full'
                                    src={userIn.url_img_google}
                                    alt=""
                                    onClick={async () => {
                                        setProfilePictureState(prev => ({ ...prev, isChange: false, isCrop: true, imageSrc: userIn.url_img_google }))
                                    }} />
                            </div>
                            <DropdownMenuSeparator /></>}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center">
                                <div className="text-start flex w-full">Imagenes muestra</div>
                                <Button variant='ghost' className='p-2'>
                                    <img
                                        className="w-6 h-6"
                                        src={update} alt=""
                                        onClick={async () => {
                                            const newArrayUrls = await ramdomDog();
                                            await setDoc(doc(db, "urlDogs", "one"), { urls: newArrayUrls })
                                            setImgFromFirebase(newArrayUrls)
                                        }} />
                                </Button>
                            </div>
                            {imgFromFirebase.length > 0 &&
                                <div className='grid grid-cols-3 gap-2'>
                                    {imgFromFirebase?.map(url =>
                                        <img
                                            key={url}
                                            className='w-16 h-16 relative rounded-full' src={url} alt=""
                                            onClick={async () => {
                                                setProfilePictureState(prev => ({ ...prev, isChange: false, isCrop: true, imageSrc: url }))
                                            }} />)}
                                </div>}
                        </div>
                    </TabsContent>
                    <TabsContent className="flex flex-col items-center justify-center" value="galery">
                        <div
                            className="inline-flex h-64 w-64 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200"
                            {...getRootProps()}>
                            <img className="w-20 h-20" src={UploadIcon} alt="" />
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium text-[#6B7280]">
                                    Sube tu imagen
                                </span>
                                <span className="text-sm font-normal text-[#9CA3AF]">
                                    PNG, JPG, GIF hasta 1 M
                                </span>
                            </div>
                            <Input {...getInputProps()} />
                        </div>
                        {errorFile && (
                            <p className="mx-auto pt-5 text-sm text-red-500">{errorFile}</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </DialogHeader>
    )
}

export default ChangePictureDialog