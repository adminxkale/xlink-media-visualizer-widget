import { Button } from "antd";
import AudioRecorderModal from "./AudioRecorder";
import React from "react";
import { AudioOutlined } from "@ant-design/icons";

const AudioRecorderButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    return (
        <>
            <Button
                color="default" 
                variant="link"
                onClick={() => setIsModalOpen(true)}
                className="!flex !flex-col !items-center !justify-center !gap-1  !rounded-xl !h-auto !w-auto"
            >
                <AudioOutlined className="text-xl" />
                <span className="text-sm">Grabar</span>
            </Button>
            <AudioRecorderModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>

    );
}

export default AudioRecorderButton;