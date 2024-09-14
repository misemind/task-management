import React, { ReactNode, useEffect, useState } from 'react';

interface AvatarProps {
    size?: number;
    src?: string | null;
    title?: string;
    backgroundColor?: string;
    color?: string;
    icon?: string | ReactNode;
    shape?: 'round' | 'semi-round' | 'rectangle';
    radius?: number;
    onClick?: () => void,
    style?: React.CSSProperties;
}

const Avatar: React.FC<AvatarProps> = ({
    size = 50,
    src,
    title,
    backgroundColor = '#C7C8CC',
    color = '#fff',
    icon = 'ri-user-line',
    shape = 'round',
    radius,
    onClick,
    style
}) => {
    const [imgError, setImgError] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        if (src) {
            setImgSrc(src);
            setImgError(false); // Reset error state when src changes
        } else {
            setImgSrc(null); // Set to null if src is not provided
        }
    }, [src]);

    // Determine the borderRadius based on the shape prop
    const avatarBorderRadius: any = radius
        ? `${radius}%`
        : shape === 'round'
            ? '50%'
            : shape === 'semi-round'
                ? '10px'
                : '0';

    // Explicitly type the style object
    const avatarStyle: React.CSSProperties = {
        width: size,
        height: size,
        minWidth: size,
        padding: 0,
        backgroundColor,
        color,
        borderRadius: avatarBorderRadius,
        overflow: 'hidden',
        display: 'inline-block',
        textAlign: 'center',
        lineHeight: '1',
        fontSize: size / 2,
        // cursor: onclick ? 'pointer' : 'default',
    };

    const imgStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };


    return (
        <div style={{ ...avatarStyle, ...style }} className="avatar" onClick={onClick}>
            {imgSrc && !imgError ? (
                <img
                    src={imgSrc}
                    alt="Avatar"
                    style={imgStyle}
                    onError={() => setImgError(true)} // Handle image load error
                />
            ) : title ? (
                <span className="d-flex align-items-center justify-content-center h-100 w-100 text-capitalize fw-semibold">
                    {title}
                </span>
            ) : typeof icon === 'string' ? (
                <span className="d-flex align-items-center justify-content-center h-100 w-100">
                    <i className={icon} style={{ fontSize: size / 2, color }}></i>
                </span>
            ) : (
                <span className="d-flex align-items-center justify-content-center h-100 w-100">
                    {icon}
                </span>
            )}
        </div>
    );
};

export default Avatar;