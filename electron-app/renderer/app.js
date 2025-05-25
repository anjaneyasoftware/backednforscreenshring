const userList = document.getElementById('userList');
const createUserForm = document.getElementById('createUserForm');
const BASE_URL = 'https://your-render-app-name.onrender.com:5000';

createUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('userPassword').value;
  const role = document.getElementById('userRole').value;

  try {
    const res = await fetch(`${BASE_URL}/api/admin/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();

    if (res.ok) {
      alert('✅ User created!');
      createUserForm.reset();
      fetchUsers();
    } else {
      alert(data.error || 'Error creating user');
    }
  } catch (err) {
    console.error('Error:', err);
  }
});
async function fetchUsers() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const users = await res.json();

    if (!Array.isArray(users)) {
      throw new Error("Unexpected response structure");
    }

    userList.innerHTML = '';
    users.forEach(user => {
      const li = document.createElement('li');
      li.className = 'user-item';
      li.innerHTML = `
        <div class="user-info">
          <strong>${user.email}</strong> 
          <small>Role: ${user.role} | ID: ${user.uniqueId}</small>
        </div>
        <div class="user-actions">
          <button class="edit-btn" onclick="editUser('${user._id}')">Edit</button>
          <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
        </div>
      `;
      userList.appendChild(li);
    });
  } catch (err) {
    console.error('Fetch users error:', err);
  }
}


async function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('User deleted');
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  }
}

// Placeholder for future edit logic
function editUser(id) {
  alert('Edit function coming soon for user ID: ' + id);
}


document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token'); // Clear token
  window.location.href = 'login.html'; // Redirect to login
});


fetchUsers(); // Load users on page load
