import React, { useEffect, useState } from 'react';

export function Notifications({token}) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetch('/api/notifications')
            .then(response => response.json())
            .then(data => setNotifications(data));
    }, [token]);

    return (
        <div>
            <ul>
                {notifications.map((notification, index) => (
                <li key={index}>
                    <p>{notification}</p>
                </li>
                ))}
            </ul>
        </div>
    )
}
