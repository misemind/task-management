
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
interface IconDetails {
    icon: string;
    iconBackgroundClass: string;
}

interface ProjectStatusInfo {
    badgeText: string;
    badgeClass: string;
    cardBorderColor: string;
}


export const getIconDetailsByType = (type: string): IconDetails => {
    const typeToIconMap: Record<string, IconDetails> = {
        "application/zip": { icon: "ri-file-zip-fill", iconBackgroundClass: "primary" },
        "application/pdf": { icon: "ri-file-pdf-fill", iconBackgroundClass: "danger" },
        "video/mp4": { icon: "ri-video-line", iconBackgroundClass: "secondary" },
        "application/vnd.ms-excel": { icon: "ri-file-excel-fill", iconBackgroundClass: "success" },
        "folder": { icon: "ri-folder-line", iconBackgroundClass: "info" },
        "image/png": { icon: "ri-image-2-fill", iconBackgroundClass: "danger" },
        "image/jpeg": { icon: "ri-image-2-fill", iconBackgroundClass: "danger" },
        // Add more types as needed
    };

    return typeToIconMap[type] || { icon: "ri-file-line", iconBackgroundClass: "dark" };
};

const avatars = [avatar2, avatar3, avatar4, avatar5, avatar7, avatar8];

export const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatars.length);
    return avatars[randomIndex];
};



export function getProjectStatusInfo(status: string): ProjectStatusInfo {
    switch (status.toLowerCase()) {
        case 'new':
            return {
                badgeText: 'New',
                badgeClass: 'info',
                cardBorderColor: 'primary',
            };
        case 'inprogress':
            return {
                badgeText: 'In Progress',
                badgeClass: 'warning',
                cardBorderColor: 'info',
            };
        case 'complete':
            return {
                badgeText: 'Completed',
                badgeClass: 'success',
                cardBorderColor: 'success',
            };
        case 'process':
            return {
                badgeText: 'In Process',
                badgeClass: 'primary',
                cardBorderColor: 'success',
            };
        default:
            return {
                badgeText: 'Unknown',
                badgeClass: 'secondary',
                cardBorderColor: 'secondary',
            };
    }
}

export const getTimeAgo = (date: string | Date): string => {
    const now = new Date();
    const pastDate = new Date(date);
    const secondsAgo = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

    if (secondsAgo < 60) {
        return `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 7) {
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    }

    const weeksAgo = Math.floor(daysAgo / 7);
    return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
};