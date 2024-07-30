document.getElementById('register').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    // const address = document.getElementById('address').value;

    if (password !== confirmPassword) {
        document.getElementById('message').textContent = 'Passwords do not match!';
        return;
    }

    const registerData = {
        email: email,
        username: name,
        password: password,
        confirmPassword: confirmPassword
    };

    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.getElementById('message');
        if (data.success) {
            messageElement.textContent = 'Registration successful!';
            messageElement.style.color = 'green';
        } else {
            messageElement.textContent = 'Registration failed: ' + data.message;
        }
    })
    .catch(error => {
        document.getElementById('message').textContent = 'An error occurred: ' + error.message;
    });
});