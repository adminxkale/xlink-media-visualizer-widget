import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Segmented } from 'antd';
import AudioRecorderModal from './AudioRecorder';
import AudioRecorderButton from './AudioRecorderButton';

const Menu: React.FC = () => {

    return (
        <>
            <Flex
                align="center"
                justify="center"
            >
                <AudioRecorderButton />
                <AudioRecorderButton />
            </Flex>
        </>
    )


};

export default Menu;