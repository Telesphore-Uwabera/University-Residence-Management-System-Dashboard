document.addEventListener('DOMContentLoaded', async () => {
    const numberOfNotifications = document.querySelector('.nbr-notifications');
    const API_URL_NOTIFICATIONS = 'https://669a46459ba098ed61ff0909.mockapi.io/api/request/notifications';
    const fetchNotifications = async () => {
        try {
            const response = await fetch(API_URL_NOTIFICATIONS);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    };

    const updateNotificationCount = async () => {
        const notifications = await fetchNotifications();
        numberOfNotifications.textContent = notifications.length;
        numberOfNotifications.style.display = notifications.length > 0 ? 'block' : 'none';
        numberOfNotifications.style.fontSize = '12px';
        numberOfNotifications.style.fontWeight = 'bolder';
        numberOfNotifications.style.padding = '2px';
    };

    await updateNotificationCount();
});
