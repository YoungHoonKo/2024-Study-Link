document.getElementById('submit').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email: username,
        password: password
    };

    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
        .then(response => response.json())
        .then(data => {
            const messageElement = document.getElementById('message');
            if (data.token) {
                messageElement.textContent = 'Login successful!';
                messageElement.style.color = 'green';
                localStorage.setItem('token', data.token); // JWT 토큰을 로컬 스토리지에 저장
                window.location.href = "/test";
            } else {
                messageElement.textContent = 'Login failed: ' + data.message;
                messageElement.style.color = 'red';
            }
        })
        .catch(error => {
            document.getElementById('message').textContent = '아이디와 비밀번호를 입력하세요';
            document.getElementById('message').style.color = 'red';
        });
});

document.addEventListener('DOMContentLoaded', function() {
    var dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dropdown) {
        dropdown.addEventListener('mouseenter', function() {
            this.querySelector('.dropdown-content').style.display = 'block';
        });
        dropdown.addEventListener('mouseleave', function() {
            this.querySelector('.dropdown-content').style.display = 'none';
        });
    });
});