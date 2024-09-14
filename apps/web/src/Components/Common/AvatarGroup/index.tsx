import React from 'react'
import './index.scss'
import Avatar from '../Avatar'

interface AvatarGroupProps {
    users: any,
    size: number,
    radius: number,
    onClick?: () => void,
    style?: React.CSSProperties,
    tooltip?: string,
    className?: string
}

const AvatarGroup = () => {
    return (
        <div className='avatar-group-container'>
            {
                Array(5).fill(0).map((_, index) => (
                    <Avatar key={index} size={30} />
                ))
            }
        </div>
    )
}

export default AvatarGroup