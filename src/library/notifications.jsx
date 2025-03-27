import React, { useEffect, useState } from 'react';

export function Notifications({token}) {
    const [notifications, setNotifications] = useState([]);
    const [notificationManager] = useState(() => new Notification());

    useEffect(() => {
        notificationManager.connect();
        notificationManager.addListener((notification) => {
            setNotifications(prev => [...prev, notification]);
        });

        return () => {
            notificationManager.removeListener();
            notificationManager.disconnect();
        };
    }, []);

    return (
        <div className='notifications'>
            <ul>
                {notifications.map((notification, index) => (
                <li key={index}>
                    <p>{notification.message}</p>
                </li>
                ))}
            </ul>
        </div>
    )
}
