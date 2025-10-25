import React, { useRef, useState, useEffect } from "react";
import { Modal, Button, message } from "antd";
import {
    AudioOutlined,
    StopOutlined,
    ReloadOutlined,
    SendOutlined,
} from "@ant-design/icons";

interface AudioRecorderModalProps {
    open: boolean;
    onClose: () => void;
}

const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({ open, onClose }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [dots, setDots] = useState(0);
    const dotsIntervalRef = useRef<number | null>(null);
    const [messageApi,messageHolder]= message.useMessage();

    
        useEffect(() => {
        if (!open) {
            // Limpiar todo al cerrar el modal
            setIsRecording(false);
            setAudioURL(null);
            setAudioBlob(null);
            audioChunksRef.current = [];
            mediaRecorderRef.current?.stop();
            mediaRecorderRef.current = null;
            if (dotsIntervalRef.current) {
                clearInterval(dotsIntervalRef.current);
                dotsIntervalRef.current = null;
            }
        }
    }, [open]);
    // Iniciar grabación
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioURL(URL.createObjectURL(blob));
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error al acceder al micrófono:", err);
            messageApi.error("No se pudo acceder al micrófono");
        }
    };

    // Detener grabación
    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    // Volver a grabar
    const resetRecording = () => {
        setAudioURL(null);
        setAudioBlob(null);
    };

    // Enviar grabación (simulación)
    const sendRecording = async () => {
        if (!audioBlob) return;
        const formData = new FormData();
        formData.append("audio", audioBlob, "grabacion.webm");

        try {
            const response = await fetch("/api/upload-audio", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                messageApi.success("Audio enviado correctamente");
                resetRecording();
                onClose();
            } else {
                messageApi.error("Error al enviar el audio");
                onClose();
            }
        } catch (error) {
            console.error("Error al enviar el audio:", error);
            messageApi.error("Error de conexión al enviar el audio");
        }
    };

    useEffect(() => {
        if (isRecording) {
            dotsIntervalRef.current = window.setInterval(() => {
                setDots(d => (d + 1) % 4); // 0..3 puntos
            }, 400);
        } else {
            setDots(0);
            if (dotsIntervalRef.current) {
                clearInterval(dotsIntervalRef.current);
                dotsIntervalRef.current = null;
            }
        }
        return () => {
            if (dotsIntervalRef.current) {
                clearInterval(dotsIntervalRef.current);
                dotsIntervalRef.current = null;
            }
        };
    }, [isRecording]);

    return (
        <>
        {messageHolder}
        <Modal
            title="Grabadora de audio"
            open={open}
            
            onCancel={onClose}
            footer={null}
            centered
        >
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                {!isRecording && !audioURL && (
                    <Button
                        type="primary"
                        icon={<AudioOutlined />}
                        onClick={startRecording}
                        size="large"
                    >
                        Iniciar grabación
                    </Button>
                )}

                {isRecording && (
                    <>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Grabando</span>
                        <span aria-hidden>{new Array(dots).fill(".").join("")}</span>
                    </div>
                        <Button
                            danger
                            type="primary"
                            icon={<StopOutlined />}
                            onClick={stopRecording}
                            size="large"
                        >
                            Detener grabación
                        </Button>
                    </>

                )}

                {!isRecording && audioURL && (
                    <>
                        <audio controls src={audioURL} className="w-full" />
                        <div className="flex justify-center gap-3">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={resetRecording}
                            >
                                Volver a grabar
                            </Button>
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={sendRecording}
                            >
                                Enviar audio
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
        </>
        
    );
};

export default AudioRecorderModal;
