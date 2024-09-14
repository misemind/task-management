import React from 'react';

const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'jpeg':
        case 'jpg':
        case 'png':
        case 'gif':
            return 'ri-image-line'; // Image icon
        case 'zip':
        case 'rar':
            return 'ri-folder-zip-line'; // Zip icon
        case 'ppt':
        case 'pptx':
            return 'ri-file-ppt-line'; // PowerPoint icon
        case 'doc':
        case 'docx':
            return 'ri-file-word-line'; // Word document icon
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
            return 'ri-video-line'; // Video icon
        case 'mp3':
        case 'wav':
        case 'aac':
            return 'ri-file-music-line'; // Audio icon
        default:
            return 'ri-file-line'; // Default file icon
    }
};

const FileIconComponent = ({ fileName }: { fileName: string }) => {
    const iconClass = getFileIcon(fileName);

    return <i className={iconClass}></i>;
};

export default FileIconComponent;
