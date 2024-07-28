document.addEventListener('DOMContentLoaded', async () => {
    const roomContainer = document.getElementById('room-table-body'); // Corrected

    const API_URL = 'https://66a3a4a844aa63704581ff08.mockapi.io/api/rooms';

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
        if (roomContainer) {
            roomContainer.innerHTML = '';
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.RoomNo}</td>
                    <td>${item.studentNo}</td>
                    <td>${item.Status}</td>
                    <td>${item.MaintainanceNeeded}</td>
                    <td>${item.AmenitiesProvided}</td>
                `;
                roomContainer.appendChild(row);
            });
        } else {
            console.error('Room container not found.');
        }
    };

    const maintenanceData = await fetchData();
    populateTable(maintenanceData);
});
