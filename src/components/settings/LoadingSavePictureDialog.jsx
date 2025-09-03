import { DialogHeader } from '@/components/ui/dialog'
import { defaultSuperListImg } from '../../utils/util'
import PropTypes from 'prop-types';

const LoadingSavePictureDialog = ({ profilePictureState }) => {
    LoadingSavePictureDialog.propTypes = {
        profilePictureState: PropTypes.shape({
            url: PropTypes.string,
        }),
    };
    
    return (
        <DialogHeader>
            <div className='flex flex-col items-center justify-center gap-4'>
                <div className="w-6 h-6 absolute top-2 right-2 bg-white z-50"></div>

                <div className="flex flex-col relative items-center justify-center h-[270px] w-[270px] ">
                    <div className="lds-dual-ring absolute"></div>
                    <img
                        className={`rounded-full ml-[10px] mt-[10px] w-64 h-64  ${profilePictureState.urlBlob === defaultSuperListImg && 'p-2 bg-imgBorder'}`}
                        src={profilePictureState.urlBlob}
                        alt=""
                    />
                </div>
                <div>Guardando imagen de perfil...</div>
            </div>
        </DialogHeader>
    )
}

export default LoadingSavePictureDialog