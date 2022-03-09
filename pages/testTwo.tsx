import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../app/styles/test.module.scss';
import axios from 'axios';

const DynamicDefaultLayout = dynamic(
    () => import('../app/components/layouts/DefaultLayout'),
    {
        ssr: false,
    }
);

const Test = () => {
    const [previewSource, setPreviewSource] = useState<any>();

    const handleFileInputChange = (e: any) => {
        const file = e.target.files[0];
        previewFile(file);
    };

    const previewFile = (file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleSubmitFile = (e: any) => {
        e.preventDefault();
        if (!previewSource) return;
        uploadImage(previewSource);
    };

    const uploadImage = async (base64EncodedImage: any) => {
        console.log(base64EncodedImage);
        try {
            const data = JSON.stringify({ data: base64EncodedImage });
            await axios.post('/api/uploadTest', data, {
                headers: { 'Content-type': 'application/json' },
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <DynamicDefaultLayout>
            <div>
                <h1 className={styles.title}>Image Uploader</h1>

                <form onSubmit={handleSubmitFile}>
                    <input
                        type='file'
                        name='image'
                        onChange={handleFileInputChange}
                    />
                    <button type='submit'>Submit</button>
                </form>
                {previewSource && (
                    <img
                        src={previewSource}
                        alt='choosen'
                        style={{ height: '300px' }}
                    />
                )}
            </div>
        </DynamicDefaultLayout>
    );
};

export default Test;
