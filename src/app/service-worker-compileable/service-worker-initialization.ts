export class ServiceWorkerInitializingService {
    private static serviceWorkerRegistration: ServiceWorkerRegistration;

    static async initialize(): Promise<void> {
        this.checkIfBrowserCompatible();
        await this.registerServiceWorker();
        await this.requestNotificationPermission();
    }

    private static checkIfBrowserCompatible(): void {
        if (!('serviceWorker' in navigator)) {
            throw new Error('No Service Worker support!')
            }
        if (!('PushManager' in window)) {
            throw new Error('No Push API Support!')
        }
    }

    private static async registerServiceWorker(): Promise<void> {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('./service-worker.js');
    }

    private static async requestNotificationPermission(): Promise<void> {
        const permission = await window['Notification']['requestPermission']();
        // value of permission can be 'granted', 'default', 'denied'
        // granted: user has accepted the request
        // default: user has dismissed the notification permission popup by clicking on x
        // denied: user has denied the request.
        if (permission !== 'granted') {
            throw new Error('Permission not granted for Notification');
        }
    }

    static sendPushNotification(title: string, options: object): void {
        this.serviceWorkerRegistration.showNotification(title, options as NotificationOptions);
    }
}
