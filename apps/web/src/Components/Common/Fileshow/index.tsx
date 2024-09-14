import React, { useEffect, useState } from 'react';
import FileIconComponent from '../FileIconComponent';
import './index.scss';

interface Props {
    file?: {
        url: string;
        contentType: string;
        size: number;
        _id: string;
    };
    previewMode?: boolean;
}

const Fileshow = ({ file, previewMode = false }: Props) => {
    const [imgSrc, setImgSrc] = useState<any>(null);
    const [imgError, setImgError] = useState(false);

    // Check if the file is an image based on its content type
    const isImage = (contentType: string | undefined) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        return contentType ? imageExtensions.includes(contentType.toLowerCase()) : false;
    };

    useEffect(() => {
        if (file && isImage(file.contentType)) {
            const src = !previewMode ? `${process.env.REACT_APP_STORAGEBUCKET}/${file.url}`: file.url;
            setImgSrc(src);
            setImgError(false); // Reset error state when src changes
        } else {
            setImgSrc(null); // Set to null if src is not provided or file is not an image
        }
    }, [file]);

    return (
        <div className='fileshow-box'>
            {file && isImage(file.contentType) && !imgError ? (
                <img
                    src={imgSrc} // Assuming you're using an environment variable for your storage bucket URL
                    alt={file._id} // Using _id as alt text, or you could use a more descriptive value if available
                    className="img-fluid rounded"
                    onError={() => setImgError(true)} // Handle image load errors
                />
            ) : (
                <FileIconComponent fileName={file ? file.url.split('/').pop() || "file" : "file"} />
            )}
            {
                !previewMode && (
                    <button className='download-btn btn btn-icon text-muted btn-sm fs-18'>
                        <i className="ri-download-2-line"></i>
                    </button>
                )
            }
        </div>
    );
};

export default Fileshow;
