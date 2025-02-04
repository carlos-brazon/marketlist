import { Link } from "react-router-dom";
import arrowLeft from "../assets/arrow-left.svg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useContext, useEffect, useState } from "react";
import { AllItemsContext } from "./Contex";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import EditProfile from "./EditProfile";
import EditPassword from "./EditPassword";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const Settings = () => {
    const { userIn, setUserIn } = useContext(AllItemsContext);
    const [isDropMenuOpen, setIsDropMenuOpen] = useState(false);
    const [imgFromFirebase, setImgFromFirebase] = useState('');
    const [temporalImg, setTemporalImg] = useState('');

    const urlsFromFirebase = async () => {
        const urlArray = await getDoc(doc(db, "urlDogs", "one"));
        setImgFromFirebase(urlArray.data().urls);
        setTemporalImg([userIn.last_url || temporalImg[0]]);
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
            <div className="flex items-center justify-center">
                <Link to={"/"}>
                    <img
                        src={arrowLeft}
                        alt="Back"
                        className="w-4 h-4 absolute left-1 top-1"
                    />
                </Link>
                <div className="text-center">Editar Perfil</div>
            </div>
            <img className={`h-28 w-full relative bg-repeat ${userIn || 'pt-2'}`} src={userIn ? userIn.last_url || `${userIn.last_url}?t=${new Date().getTime()}` : ''} alt="Imagen cuadrada de fondo" />

            <DropdownMenu className=" absolute z-40" open={isDropMenuOpen} onOpenChange={(open) => {
                setIsDropMenuOpen(open);
                if (open) urlsFromFirebase();
            }}>
                <DropdownMenuTrigger className="pl-2">
                    {userIn ? <div className=' flex items-center justify-center rounded-full border-[2px] border-gray-500 bg-white w-[106px] h-[106px] absolute top-[60px]'>
                        <img className={`absolute z-10 rounded-full w-24 h-24`} src={userIn.last_url || `${userIn.last_url}?t=${new Date().getTime()}`} alt='imagen redonda' />
                    </div> : <img className='relative z-10 w-9 h-9' src={'UserDisconectedIcon'} alt='Aquí va un icono de usuario' />}
                    {/* </div> : <img className='relative z-10 w-9 h-9' src={UserDisconectedIcon} alt='Aquí va un icono de usuario' />} */}
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuLabel className="text-center">Selecciona una nueva imagen</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <div className='grid grid-cols-3 gap-2'>
                            {imgFromFirebase.length ? imgFromFirebase?.map(url => <img key={url} onClick={async () => { await updateDoc(doc(db, "userMarketList", userIn.uid), { last_url: url }), setUserIn(prev => ({ ...prev, last_url: url })) }} className='w-24 h-24 relative rounded-full' src={url} alt="" />) : ''}
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
            </DropdownMenu>

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
