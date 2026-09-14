import React from 'react';

const UserAvatar = ({ name, className }) => {
    const getInitials = (n) => {
        if (!n) return 'U';
        return n.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
    };

    // Generate a consistent color based on the name string
    const getColor = (n) => {
        const colors = [
            '#ef4444', // red-500
            '#f97316', // orange-500
            '#f59e0b', // amber-500
            '#84cc16', // lime-500
            '#10b981', // emerald-500
            '#06b6d4', // cyan-500
            '#3b82f6', // blue-500
            '#6366f1', // indigo-500
            '#8b5cf6', // violet-500
            '#d946ef', // fuchsia-500
            '#f43f5e'  // rose-500
        ];

        if (!n) return colors[6]; // Default blue

        let hash = 0;
        for (let i = 0; i < n.length; i++) {
            hash = n.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    const characterUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'User')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

    return (
        <div 
            className={`flex items-center justify-center overflow-hidden rounded-full select-none shadow-sm bg-gray-100 ${className}`}
            title={name}
        >
            <img 
                src={characterUrl} 
                alt={name} 
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default UserAvatar;
