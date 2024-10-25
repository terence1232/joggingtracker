document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    const loginSection = document.getElementById('loginSection');
    const adminSection = document.getElementById('adminSection');
    const memberSection = document.getElementById('memberSection');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const joggingForm = document.getElementById('joggingForm');
    const logoutButton = document.getElementById('logoutButton');
    const memberRecords = document.getElementById('memberRecords');
    const userRecords = document.getElementById('userRecords');

    let currentUser = null;
    let users = JSON.parse(localStorage.getItem('users')) || [
        { username: 'admin', password: 'admin123', isAdmin: true }
    ];
    let records = JSON.parse(localStorage.getItem('records')) || [];

    function hideLoadingScreen() {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';
        loginSection.style.display = 'block';
    }

    setTimeout(hideLoadingScreen, 2000);

    function showSection(section) {
        loginSection.style.display = 'none';
        adminSection.style.display = 'none';
        memberSection.style.display = 'none';
        section.style.display = 'block';
        logoutButton.style.display = section !== loginSection ? 'block' : 'none';
    }

    function displayMemberRecords() {
        memberRecords.innerHTML = '<table><tr><th>Username</th><th>Date</th><th>Distance (km)</th><th>Duration</th></tr></table>';
        const table = memberRecords.querySelector('table');
        records.forEach(record => {
            const row = table.insertRow();
            row.insertCell().textContent = record.username;
            row.insertCell().textContent = record.date;
            row.insertCell().textContent = record.distance;
            row.insertCell().textContent = record.duration;
        });
    }

    function displayUserRecords() {
        userRecords.innerHTML = '<table><tr><th>Date</th><th>Distance (km)</th><th>Duration</th></tr></table>';
        const table = userRecords.querySelector('table');
        records.filter(record => record.username === currentUser.username).forEach(record => {
            const row = table.insertRow();
            row.insertCell().textContent = record.date;
            row.insertCell().textContent = record.distance;
            row.insertCell().textContent = record.duration;
        });
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            if (user.isAdmin) {
                showSection(adminSection);
                displayMemberRecords();
            } else {
                showSection(memberSection);
                displayUserRecords();
            }
        } else {
            alert('Invalid username or password');
        }
        loginForm.reset();
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        if (users.some(u => u.username === username)) {
            alert('Username already exists');
        } else {
            users.push({ username, password, isAdmin: false });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Member registered successfully');
            registerForm.reset();
        }
    });

    joggingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const distance = document.getElementById('distance').value;
        const duration = document.getElementById('duration').value;
        records.push({ username: currentUser.username, date, distance, duration });
        localStorage.setItem('records', JSON.stringify(records));
        displayUserRecords();
        joggingForm.reset();
    });

    logoutButton.addEventListener('click', () => {
        currentUser = null;
        showSection(loginSection);
    });
});