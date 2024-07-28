document.addEventListener('DOMContentLoaded', function() {
    // Initialize default filter
    let currentFilter = 'All';
    let searchTerm = '';

    // Load all data by default
    loadData(currentFilter, searchTerm);

    // Filter by status when the user selects an option
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            currentFilter = this.getAttribute('data-filter');
            loadData(currentFilter, searchTerm);
            
            // Update active class
            document.querySelectorAll('.dropdown-item').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Search input event listener
    document.getElementById('search-input').addEventListener('input', function() {
        searchTerm = this.value;
        loadData(currentFilter, searchTerm);
    });
});

function loadData(filter, searchTerm) {
    // Example API endpoint (replace with your actual endpoint)
    const apiUrl = `/api/data?filter=${filter}&search=${encodeURIComponent(searchTerm)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => updateTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

function updateTable(data) {
    const tableBody = document.getElementById('maintenance-table-body');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.roomNumber}</td>
            <td>${item.requestDate}</td>
            <td>${item.issueDescription}</td>
            <td>${item.status}</td>
            <td>${item.priority}</td>
            <td>${item.notes}</td>
        `;
        tableBody.appendChild(row);
    });
}
