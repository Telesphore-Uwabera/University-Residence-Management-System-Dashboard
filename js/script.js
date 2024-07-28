document.addEventListener('DOMContentLoaded', async () => {
    const menu = document.querySelector('.dropdownMenuButton');
    const navigation = document.querySelector('.dropdownMenu');
    const searchInput = document.querySelector('.search-input');
    const toggleMode = document.querySelector('.theme-switcher');
    const notificationsPanel = document.querySelector('.notifications');
    const notificationsList = document.querySelector('#notifications-list');
    const maintenanceTableBody = document.getElementById('maintenance-table-body');
    const notificationsContainer = document.querySelector('.notifications-container');
    const numberOfNotifications = document.querySelector('.nbr-notifications');
    const API_URL = 'https://669a46459ba098ed61ff0909.mockapi.io/api/request/maintenances';
    const API_URL_NOTIFICATIONS = 'https://669a46459ba098ed61ff0909.mockapi.io/api/request/notifications';
    const filterButtons = document.querySelectorAll('.dropdown-item');
    const addNoteBtn = document.getElementById('add-note-btn');
    const addNoteForm = document.getElementById('add-note-form');
    const roomNumberInput = document.getElementById('roomNumberInput');
    const noteInput = document.getElementById('noteInput');

    // Handle menu toggling
    if (menu) {
        menu.addEventListener('click', (e) => {
            e.preventDefault();
            navigation.style.display = navigation.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Handle search input focus
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            searchInput.style.border = 'none';
            searchInput.style.borderBottom = '1px solid #000';
        });
    }

    // Handle theme toggle
    if (toggleMode) {
        toggleMode.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    // Handle notifications panel
    if (notificationsPanel && notificationsList && notificationsContainer) {
        notificationsPanel.addEventListener('click', () => {
            notificationsContainer.style.display = notificationsContainer.style.display === 'block' ? 'none' : 'block';
        });

        const fetchNotifications = async () => {
            try {
                const response = await fetch(API_URL_NOTIFICATIONS);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                renderNotifications(data);
                updateNotificationCount(data.length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        const renderNotifications = (notifications) => {
            notificationsList.innerHTML = '';
            notifications.forEach(item => {
                const nots = document.createElement('div');
                nots.classList.add('notification-item');
                nots.innerHTML = `
                    <p class="text-primary">${item.sender}</p>
                    <p>${item.notifications}</p>
                    <strong>${new Date(item.createdAt).toLocaleString()}</strong>
                `;
                notificationsList.appendChild(nots);
            });
        };

        const updateNotificationCount = (count) => {
            numberOfNotifications.textContent = count;
            numberOfNotifications.style.display = count > 0 ? 'block' : 'none';
            numberOfNotifications.style.fontWeight = 'bolder';
            numberOfNotifications.style.color = 'white';
            numberOfNotifications.style.backgroundColor = 'red';
            numberOfNotifications.style.padding = '4px';
            numberOfNotifications.style.fontSize = '12px';
            numberOfNotifications.style.borderRadius = '50%';
        };

        fetchNotifications();
    }

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    const populateTable = (data) => {
        if (maintenanceTableBody) {
            maintenanceTableBody.innerHTML = '';
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.roomNumber}</td>
                    <td>${new Date(item.requestDate).toLocaleDateString()}</td>
                    <td>${item.issueDescription}</td>
                    <td>${item.status}</td>
                    <td>${item.priority ? 'Yes' : 'No'}</td>
                    <td>${item.notes}</td>
                `;
                maintenanceTableBody.appendChild(row);
            });
        }
    };

    const filterMaintenanceRequests = (criteria, value) => {
        fetchData().then(data => {
            let filteredData = data;
            if (criteria === 'status') {
                filteredData = data.filter(item => item.status === value);
            } else if (criteria === 'roomNumber') {
                filteredData = data.filter(item => item.roomNumber === value);
            } else if (criteria === 'All') {
                filteredData = data; // No filtering
            }
            populateTable(filteredData);
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterCriteria = button.getAttribute('data-filter');
            const filterValue = filterCriteria === 'All' ? 'All' : prompt(`Enter ${filterCriteria}`);
            if (filterValue !== null) {
                filterMaintenanceRequests(filterCriteria, filterValue);
            }
        });
    });

    addNoteBtn.addEventListener('click', () => {
        $('#addNoteModal').modal('show');
    });

    addNoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const roomNumber = roomNumberInput.value.trim();
        const note = noteInput.value.trim();

        if (roomNumber && note) {
            try {
                // Assuming there's an endpoint to update a maintenance request with notes
                const response = await fetch(`${API_URL}?roomNumber=${roomNumber}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ notes: note })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                $('#addNoteModal').modal('hide');
                roomNumberInput.value = '';
                noteInput.value = '';
                const updatedData = await fetchData();
                populateTable(updatedData);
            } catch (error) {
                console.error('Error adding note:', error);
            }
        }
    });

    const maintenanceData = await fetchData();
    populateTable(maintenanceData);
});

