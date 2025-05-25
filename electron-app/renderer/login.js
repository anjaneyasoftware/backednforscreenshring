document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
const BASE_URL = 'https://your-app-name.onrender.com';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
         localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.userId);
      message.style.color = 'green';
      message.textContent = 'Login successful! Redirecting...';

      // Role-based redirect
      if (data.role === 'admin') {
        window.location.href = 'index.html';
      } else if (data.role === 'operator') {
        window.location.href = 'operator.html';
      } else if (data.role === 'viewer') {
        window.location.href = 'viewer.html';
      } else {
        message.textContent = 'Unknown role.';
      }
    } else {
      message.style.color = 'red';
      message.textContent = data.error || 'Login failed.';
    }
  } catch (err) {
    message.style.color = 'red';
    message.textContent = 'Server error.';
    console.error(err);
  }
});
