import React, { useEffect, useState } from 'react'
import { Input, Label } from 'reactstrap';
import Avatar from '../Avatar';

interface IProps {
    previewUrl?: string | null;
    onFileChange?: (file: File | null) => void;
}

const ProfilePhotoUpload: React.FC<IProps> = ({ previewUrl, onFileChange }) => {
    const [avatarSrc, setAvatarSrc] = useState<any>(null);
    useEffect(() => {
        if (previewUrl?.includes('object') || previewUrl === null) {
            return
        } else {
            setAvatarSrc(previewUrl);
        }
    }, [previewUrl]);

    const handleAvatarClick = () => {
        // Trigger the file input click
        document.getElementById('project-thumbnail-img')?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setAvatarSrc(fileUrl);
            if (onFileChange) {
                onFileChange(file);
            }
        } else {
            setAvatarSrc(null);
            if (onFileChange) {
                onFileChange(null); // Notify parent component of the null value if no file is selected
            }
        }
    };
    return (
        <div className="mb-3">
            <div className="d-flex align-items-center gap-2">
                <Avatar
                    src={avatarSrc}
                    onClick={handleAvatarClick}
                    size={75}
                    style={{
                        cursor: 'pointer',
                        border: '3px solid lightgray'
                    }}
                    icon="ri-upload-cloud-2-line"
                />
                <Input
                    className="form-control"
                    id="project-thumbnail-img"
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/png, image/gif, image/jpeg"
                    name="thumbnailImage"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    )
}

export default ProfilePhotoUpload