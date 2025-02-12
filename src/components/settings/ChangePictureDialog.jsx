import {
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useContext } from "react"
import { AllItemsContext } from "../Contex"
import { Button } from "../ui/button"
import update from "../../assets/update.svg";
import { doc, setDoc } from "firebase/firestore"
import { db } from "../../utils/firebase"
import PropTypes from 'prop-types';
import { ramdomDog } from "../../utils/util"

const ChangePictureDialog = ({ setProfilePictureState, imgFromFirebase, setImgFromFirebase }) => {
    ChangePictureDialog.propTypes = {
        setProfilePictureState: PropTypes.func,
        setImgFromFirebase: PropTypes.func,
        imgFromFirebase: PropTypes.array,
    };
    const { userIn } = useContext(AllItemsContext);

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
                    <TabsContent value="galery">
                        <div className="h-[178px]">falta agregar</div>
                    </TabsContent>
                </Tabs>
            </div>
        </DialogHeader>
    )
}

export default ChangePictureDialog