'use client';
import { motion } from 'framer-motion';

type IllustratorTurntableProps = {
    isPlaying: boolean;
    currentTrack: {
        title: string;
        artist: string;
        color?: string;
    };
    onTogglePlay: () => void;
};

export default function IllustratorTurntable({
    isPlaying,
    currentTrack,
    onTogglePlay,
}: IllustratorTurntableProps) {
    return (
        <div className="absolute inset-0 w-full h-full">
            {/* Turntable Base - Full coverage as background */}
            <div
                className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat"
                style={{
                    backgroundImage: 'url(/assets/svg/turntable-base.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >

                {/* ONLY Vinyl Record - Large and centered */}
                <motion.div
                    className="absolute"  // ← Fjern w-98 h-98
                    style={{
                        width: '620px',     // ← Legg til eksplisitt bredde
                        height: '620px',    // ← Legg til eksplisitt høyde
                        top: '50%',
                        left: '50%',
                        x: '-50%',
                        y: '-50%'
                    }}
                    animate={{
                        rotate: isPlaying ? [0, 360] : 0,
                        x: '-50%',
                        y: '-50%'
                    }}
                    transition={{
                        duration: 3,
                        ease: "linear",
                        repeat: isPlaying ? Infinity : 0,
                        repeatType: "loop"
                    }}
                >
                    <img
                        src="/assets/svg/vinyl-record.svg"
                        alt="Vinyl Record"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            console.log('Vinyl record SVG not found');
                            e.currentTarget.style.display = 'none';
                        }}
                    />

                    {/* Label Rim - Layer on top of vinyl record */}
                    <div 
                        className="absolute inset-0"
                        style={{
                            top: '50%',
                            left: '50%',
                            width: '200px',  // Juster størrelse etter behov
                            height: '200px',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <img
                            src="/assets/svg/lable-rim.svg"
                            alt="Label Rim"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                console.log('Label rim SVG not found');
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>

                    {/* Record Label - Layer on top of label rim */}
                    <div 
                        className="absolute inset-0"
                        style={{
                            top: '50%',
                            left: '50%',
                            width: '180px',  // Litt mindre enn label-rim
                            height: '180px',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <img
                            src="/assets/svg/record-lable.svg"
                            alt="Record Label"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                console.log('Record label SVG not found');
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                </motion.div>

                {/* Spindel - Static (does not rotate) */}
                <div 
                    className="absolute"
                    style={{
                        top: '50%',
                        left: '50%',
                        width: '20px',   // Mindre størrelse for spindel
                        height: '20px',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10       // Øverst av alle lag
                    }}
                >
                    <img
                        src="/assets/svg/spindel.svg"
                        alt="Spindel"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            console.log('Spindel SVG not found');
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>

            </div>
        </div>
    );
}