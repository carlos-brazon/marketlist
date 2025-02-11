import { Link } from "react-router-dom";
import arrowLeft from "../../assets/arrow-left.svg";
import editIcon from "../../assets/edit-icon-img.svg";
import alert2 from "../../assets/alert2.svg";
import { useContext, useEffect, useState } from "react";
import { AllItemsContext } from "../Contex";
import EditProfile from "../EditProfile";
import EditPassword from "../EditPassword";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { defaultSuperListImg, ramdomDog } from "../../utils/util";
import { useSearchParams } from "react-router-dom";
import ProfilePictureDialog from "./ProfilePictureDialog";
import ChangePictureDialog from "./ChangePictureDialog";
import RemovePictureDialog from "./RemovePictureDialog";
import LoadingSavePictureDialog from "./LoadingSavePictureDialog";
import CropPictureDialog from "./CropPictureDialog";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

const SettingPage = () => {
    const { userIn } = useContext(AllItemsContext);
    const [searchParams] = useSearchParams();
    const defaultTab = searchParams.get("tab") || "profile";
    const [imgFromFirebase, setImgFromFirebase] = useState('');
    const [temporalImg, setTemporalImg] = useState('');
    const [profilePictureState, setProfilePictureState] = useState({
        isProfilePicture: true,
        isRemove: false,
        isChange: false,
        isLoading: false,
        isCrop: false,
        imageSrc: null,
        url: ''
    });

    const renderDialogContent = () => {
        switch (profilePictureState.isProfilePicture) {
            case profilePictureState.isLoading:
                return <LoadingSavePictureDialog
                    profilePictureState={profilePictureState} />;
            case profilePictureState.isChange:
                return <ChangePictureDialog
                    setProfilePictureState={setProfilePictureState}
                    imgFromFirebase={imgFromFirebase}
                    setImgFromFirebase={setImgFromFirebase} />;
            case profilePictureState.isCrop:
                return <CropPictureDialog
                    setProfilePictureState={setProfilePictureState}
                    profilePictureState={profilePictureState} />;
            case profilePictureState.isRemove:
                return <RemovePictureDialog
                    setProfilePictureState={setProfilePictureState} />;
            default:
                return <ProfilePictureDialog
                    setProfilePictureState={setProfilePictureState} />;
        }
    };

    const urlsFromFirebase = async () => {
        const urlArray = await getDoc(doc(db, "urlDogs", "one"));
        setImgFromFirebase(urlArray.data().urls);
        setTemporalImg([userIn.url_img_super_list || temporalImg[0]]);
    }

    useEffect(() => {
        if (userIn) {
            const sixRamdomDogs = ramdomDog();
            setImgFromFirebase(sixRamdomDogs)
            urlsFromFirebase();
        }
    }, []);

    return (
        <div className=" w-full">
            <div className="flex items-center justify-center p-1.5">
                <Link to={"/"}>
                    <img
                        src={arrowLeft}
                        alt="Back"
                        className="w-6 h-6 absolute left-1 top-[5px]"
                    />
                </Link>
                <div className="text-center">Editar Perfil</div>
            </div>
            <div className='h-28 w-full relative bg-gradient-to-br from-slate-200 to-slate-500'>
            </div>
            <Dialog>
                <DialogTrigger className="pl-2">
                    <div className=' flex items-center justify-center rounded-full border-[2px] border-gray-500 bg-white w-[106px] h-[106px] absolute top-[70px]'>
                        <img
                            className={`absolute z-10 rounded-full w-24 h-24 ${userIn?.url_img_super_list === defaultSuperListImg ? 'p-2 bg-imgBorder' : ''}`}
                            src={userIn?.super_list_img_selected ? userIn?.url_img_super_list : userIn?.url_img_google}
                            alt='imagen redonda settings' />
                        <div className="bg-gray-600 w-8 h-8 rounded-full absolute z-10 flex items-center justify-center right-0 bottom-0 border">
                            <img className="w-5 h-5 stroke-[6px]" src={editIcon} alt="" />
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent aria-describedby={undefined} className='rounded-md flex flex-col'>
                    {renderDialogContent()}
                </DialogContent>
            </Dialog>

            <Tabs defaultValue={defaultTab} className="flex flex-col justify-center items-center pt-5">
                <TabsList className>
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger className='flex gap-1' value="password">Contraseña

                        <img className={`w-5 h-5 ${userIn?.tem_pass?.length ? '' : 'hidden'}`} src={alert2} alt="" />
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="profile">

                    <EditProfile />
                </TabsContent>
                <TabsContent value="password">
                    <EditPassword />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingPage;
