import { Link } from "react-router-dom";
import arrowLeft from "../assets/arrow-left.svg";
import arrowRightChangeImage from "../assets/right-md.svg";
import editIcon from "../assets/edit-icon-img.svg";
import trashIcon from "../assets/trash-icon.svg";
import cameraAdd from "../assets/camera-add.svg";
import update from "../assets/update.svg";
import { useContext, useEffect, useState } from "react";
import { AllItemsContext } from "./Contex";
import { doc, getDoc, setDoc, updateDoc, } from "firebase/firestore";
import { db } from "../utils/firebase";
import EditProfile from "./EditProfile";
import EditPassword from "./EditPassword";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { X } from "lucide-react";
import { defaultSuperListImg } from "../utils/util";
import {
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage"; // Función para obtener la imagen recortada
import { Button } from "./ui/button";

const Settings = () => {
    const { userIn, setUserIn } = useContext(AllItemsContext);
    const [imgFromFirebase, setImgFromFirebase] = useState('');
    const [temporalImg, setTemporalImg] = useState('');
    const [container, setContainer] = useState(false);
    const [removeImg, setRemoveImg] = useState(false);
    const [changeImg, setChangeImg] = useState(false);
    const [imgProfile, setImgProfile] = useState(false);

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

    const handleRemoveImg = async () => {
        setRemoveImg({ control: true, url: defaultSuperListImg });
        await updateDoc(doc(db, "userMarketList", userIn.uid), {
            url_img_super_list: defaultSuperListImg,
            cropp_pixel: {},
            super_list_img_selected: true
        });
        setTimeout(() => {
            setUserIn(prev => ({ ...prev, super_list_img_selected: true, url_img_super_list: defaultSuperListImg }))
            setContainer(prev => !prev)
            setRemoveImg(false);

        }, 2500);

    }
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    // const [showCropModal, setShowCropModal] = useState(false);

    const onCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = () => setImageSrc(reader.result);
    //         reader.readAsDataURL(file);
    //         setShowCropModal(true);
    //     }
    // };

    const handleSaveImage = async () => {
        setContainer(true)
        if (userIn.url_img_google === imageSrc) {
            setRemoveImg({ control: true, url: imageSrc });
            await updateDoc(doc(db, "userMarketList", userIn.uid), {
                cropp_pixel: {},
                super_list_img_selected: false,
                url_img_google: imageSrc,
                url_img_super_list: ''
            });
            setTimeout(() => {
                setUserIn(prev => ({ ...prev, super_list_img_selected: false, url_img_google: imageSrc, url_img_super_list: '' }));
                setRemoveImg(false);
                setContainer(prev => !prev)
                setChangeImg(prev => !prev);
                setImgProfile((prev) => !prev);

            }, 2500);

        } else {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

            setRemoveImg({ control: true, url: croppedImage });

            await updateDoc(doc(db, "userMarketList", userIn.uid), {
                url_img_super_list: imageSrc,
                cropp_pixel: croppedAreaPixels,
                super_list_img_selected: true
            });
            setTimeout(() => {
                setUserIn(prev => ({ ...prev, url_img_super_list: croppedImage, super_list_img_selected: true }));
                setRemoveImg(false);
                setContainer(prev => !prev)
                setChangeImg(prev => !prev);
                setImgProfile((prev) => !prev);

            }, 2500);
        }



    };
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
                            className={`absolute z-10 rounded-full w-24 h-24 ${userIn.url_img_super_list === defaultSuperListImg ? 'p-2 bg-imgBorder' : ''}`}
                            src={userIn.super_list_img_selected ? userIn?.url_img_super_list : userIn?.url_img_google}
                            alt='imagen redonda settings' />
                        <div className="bg-gray-600 w-8 h-8 rounded-full absolute z-10 flex items-center justify-center right-0 bottom-0 border">
                            <img className="w-5 h-5 stroke-[6px]" src={editIcon} alt="" />
                        </div>
                    </div>
                </DialogTrigger>
                {container ?
                    removeImg.control ?
                        <DialogContent className='rounded-md'>
                            <DialogHeader>

                                <div className='flex flex-col items-center justify-center gap-4'>
                                    <div className="w-6 h-6 absolute top-2 right-2 bg-white z-50"></div>

                                    <div className="flex flex-col relative items-center justify-center h-[270px] w-[270px] ">
                                        <div className="lds-dual-ring absolute"></div>
                                        <img
                                            className={`rounded-full ml-[10px] mt-[10px] w-64 h-64  ${removeImg.url === defaultSuperListImg && 'p-2 bg-imgBorder'}`}
                                            src={removeImg.url}
                                            alt=""
                                        />
                                    </div>
                                    <div>Guardando imagen de perfil...</div>
                                </div>
                            </DialogHeader>
                        </DialogContent>
                        :
                        <DialogContent className='rounded-md'>
                            <DialogHeader>
                                <X onClick={() => setContainer(prev => !prev)} className="cursor-pointer w-6 h-6 absolute top-2 right-2 bg-white z-50" />

                                <div className='flex flex-col items-center gap-6'>

                                    <div className='flex items-center justify-center gap-3'>
                                        <img
                                            className={`rounded-full w-24 h-24 ${userIn.url_img_super_list === defaultSuperListImg ? 'p-2 bg-imgBorder' : ''}`}
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
                                        <button onClick={() => setContainer(prev => !prev)} className='flex rounded-full bg-blue-400 px-3 py-1'>Cancelar</button>
                                        <button onClick={() => handleRemoveImg()} className='flex rounded-full bg-blue-400 px-3 py-1'>Cambiar</button>
                                    </div>
                                </div>
                            </DialogHeader>
                        </DialogContent>
                    :
                    changeImg
                        ?
                        imgProfile
                            ?
                            <DialogContent className="rounded-md flex flex-col">
                                <X
                                    onClick={() => setImgProfile((prev) => !prev)}
                                    className="cursor-pointer w-6 h-6 absolute top-2 right-2 bg-white z-50"
                                />
                                <DialogHeader>
                                    <DialogTitle>Super List Account</DialogTitle>
                                    <div className="flex flex-col items-center gap-8">
                                        <div className="text-start flex w-full text-lg font-normal">Recorta foto de perfil</div>

                                        <div className="relative w-full h-72 bg-gray-200">
                                            <Cropper
                                                image={imageSrc}
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
                                                onClick={() => setImgProfile((prev) => !prev)}
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
                            </DialogContent>
                            :
                            <DialogContent className='rounded-md flex flex-col'>
                                <DialogHeader>
                                    <X onClick={() => setChangeImg(prev => !prev)} className="cursor-pointer w-6 h-6 absolute top-2 right-2 bg-white z-50" />
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
                                                                setImageSrc(userIn.url_img_google)
                                                                setImgProfile(prev => !prev)
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
                                                    <div className='grid grid-cols-3 gap-2'>
                                                        {imgFromFirebase.length
                                                            ?
                                                            imgFromFirebase?.map(url =>
                                                                <img
                                                                    key={url}
                                                                    className='w-16 h-16 relative rounded-full' src={url} alt=""
                                                                    onClick={async () => {
                                                                        setImageSrc(url)
                                                                        setImgProfile(prev => !prev)
                                                                    }} />)
                                                            : ''}
                                                    </div>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="galery">
                                                <div className="h-[178px]">falta agregar</div>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                </DialogHeader>
                            </DialogContent>
                        :
                        <DialogContent className='rounded-md flex flex-col'>
                            <DialogHeader>
                                <DialogTitle>Super List Account</DialogTitle>
                                <div className='flex flex-col items-center gap-8'>
                                    <div className='text-start flex w-full text-lg font-normal'>
                                        Foto de perfil
                                    </div>
                                    <img
                                        className={`rounded-full w-40 h-40 ${userIn.url_img_super_list === defaultSuperListImg ? 'p-2 bg-imgBorder' : ''}`}
                                        src={userIn.super_list_img_selected ? userIn?.url_img_super_list : userIn?.url_img_google}
                                        alt="" />
                                    <div className='flex items-center justify-center w-full gap-2'>
                                        {userIn.url_img_super_list === defaultSuperListImg
                                            ?

                                            <button onClick={() => setChangeImg(prev => !prev)}
                                                className='w-full relative font-medium text-gray-100 flex rounded-full bg-blue-500 px-3 py-1 items-center justify-center gap-2'>
                                                <img
                                                    className="flex w-5 h-5 rounded-full"
                                                    src={cameraAdd} alt="" />
                                                Añadir foto de perfil
                                            </button>
                                            :
                                            <div className='flex items-center justify-center w-full gap-2'>
                                                <button
                                                    onClick={() => setChangeImg(prev => !prev)}
                                                    className='w-full relative font-medium text-gray-100 flex rounded-full bg-blue-500 px-3 py-1 items-center justify-center gap-2'>
                                                    <img
                                                        className="flex w-5 h-5 rounded-full"
                                                        src={editIcon} alt="" />
                                                    Cambiar
                                                </button>
                                                <button
                                                    onClick={() => setContainer(prev => !prev)}
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
                        </DialogContent>
                }
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
