export default class Notification {
    constructor() {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.notifications = [];
        this.listeners = new Set();
        this.socket.onopen = () => {
            console.log('Connected to notification server');
        };

        this.socket.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            this.notifications.push(notification);
            this.notifyListeners(notification);
        };

        this.socket.onclose = () => {
            console.log('Disconnected from notification server');
        };
    }

    addListener(callback) {
        this.listeners.add(callback);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
    }

    notifyListeners(notification) {
        this.listeners.forEach(callback => callback(notification));
    }

    getNotifications() {
        return this.notifications;
    }
    
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}


