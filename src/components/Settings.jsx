import { Link } from "react-router-dom";
import arrowLeft from "../assets/arrow-left.svg";
import arrowRightChangeImage from "../assets/right-md.svg";
import { useContext, useEffect, useState } from "react";
import { AllItemsContext } from "./Contex";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import EditProfile from "./EditProfile";
import EditPassword from "./EditPassword";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"



const Settings = () => {
    const { userIn, setUserIn } = useContext(AllItemsContext);
    const [isDropMenuOpen, setIsDropMenuOpen] = useState(false);
    const [imgFromFirebase, setImgFromFirebase] = useState('');
    const [temporalImg, setTemporalImg] = useState('');
    const [container, setContainer] = useState(false);

    const urlsFromFirebase = async () => {
        const urlArray = await getDoc(doc(db, "urlDogs", "one"));
        setImgFromFirebase(urlArray.data().urls);
        setTemporalImg([userIn.url_img_super_list || temporalImg[0]]);
    }

    const ramdomDog = async () => {
        try {
            const response = await fetch('https://dog.ceo/api/breed/hound/images/random/6');
            const data = await response.json();
            setTemporalImg(data.message);
            return data.message
        } catch (error) {
            console.error("Error fetching the image:", error);
        }
    }
    useEffect(() => {
        if (userIn) {
            ramdomDog();
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
                        <img className={`absolute z-10 rounded-full w-24 h-24`} src={userIn.url_img_super_list || `${userIn.url_img_super_list}?t=${new Date().getTime()}`} alt='imagen redonda settings' />
                    </div>
                </DialogTrigger>
                {container ? <DialogContent className='rounded-md'>
                    <DialogHeader>

                        <div className='flex flex-col items-center gap-3'>

                            <div className='flex items-center justify-center gap-3'>
                                <img className=' rounded-full w-28 h-28' src={userIn.super_list_img_selected ? userIn?.url_img_super_list : userIn?.url_img_google} alt="" />
                                <img className=' rounded-full w-8 h-8' src={arrowRightChangeImage} alt="" />
                                <img className=' rounded-full w-28 h-28 p-2 bg-imgBorder' src='https://res.cloudinary.com/dcilysqzl/image/upload/v1738698398/eaf0b15c155449c9bb8fe13ccdb821cc-free_2_fiswiy.png' alt="" />
                            </div>
                            <div className='flex gap-2 place-content-between w-full'>
                                <button className='flex rounded-full bg-blue-400 px-3 py-1'>Remover</button>
                                <button onClick={() => setContainer(prev => !prev)} className='flex rounded-full bg-blue-400 px-3 py-1'>Cambiar</button>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent> : <DialogContent className='rounded-md'>
                    <DialogHeader>
                        <DialogTitle>Super List Account</DialogTitle>
                        <div className='flex flex-col items-center gap-3'>
                            <div className='text-start flex w-full text-lg font-normal'>
                                Foto de perfil
                            </div>
                            <img className=' rounded-full w-40 h-40' src={userIn.super_list_img_selected ? userIn?.url_img_super_list : userIn?.url_img_google} alt="" />
                            <div className='flex gap-2'>
                                <button className='flex rounded-full bg-blue-400 px-3 py-1'>Remover</button>
                                <button onClick={() => setContainer(prev => !prev)} className='flex rounded-full bg-blue-400 px-3 py-1'>Cambiar</button>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>}
            </Dialog>


            {/* <DropdownMenu className=" absolute z-40" open={isDropMenuOpen} onOpenChange={(open) => {
                setIsDropMenuOpen(open);
                if (open) urlsFromFirebase();
            }}>
                <DropdownMenuTrigger className="pl-2">
                    {userIn ? <div className=' flex items-center justify-center rounded-full border-[2px] border-gray-500 bg-white w-[106px] h-[106px] absolute top-[70px]'>
                        <img className={`absolute z-10 rounded-full w-24 h-24`} src={userIn.url_img_super_list || `${userIn.url_img_super_list}?t=${new Date().getTime()}`} alt='imagen redonda' />
                    </div> : <img className='relative z-10 w-9 h-9' src={'UserDisconectedIcon'} alt='Aquí va un icono de usuario' />}
          
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuLabel className="text-center">Selecciona una nueva imagen</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <div className='grid grid-cols-3 gap-2'>
                            {imgFromFirebase.length ? imgFromFirebase?.map(url => <img key={url} onClick={async () => { await updateDoc(doc(db, "userMarketList", userIn.uid), { url_img_super_list: url, super_list_img_selected: true }), setUserIn(prev => ({ ...prev, url_img_super_list: url })) }} className='w-24 h-24 relative rounded-full' src={url} alt="" />) : ''}
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <div className={userIn || 'hidden'} onClick={async () => {
                            const newArrayUrls = await ramdomDog();
                            await setDoc(doc(db, "urlDogs", "one"), { urls: newArrayUrls })
                        }}>
                            Cambiar imagenes de muestra
                        </div>

                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu> */}

            <Tabs defaultValue="profile" className="flex flex-col justify-center items-center pt-5">
                <TabsList className>
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger value="password">Contraseña</TabsTrigger>
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

export default Settings;
