document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault(); // 폼이 기본적으로 제출되지 않도록 방지

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const messageElement = document.getElementById('message');

    if (!username || !password) {
        messageElement.textContent = '아이디와 비밀번호를 입력하세요';
        messageElement.style.color = 'red';
        return;
    }

    const loginData = {
        username: username,
        password: password
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response)
    .then(data => {
        console.log(data.headers)
        if (data.ok) {
            messageElement.textContent = 'Login successful!';
            messageElement.style.color = 'green';
            localStorage.setItem('access', data.headers.get("access"));
            // window.location.href="/"
        } else {
            messageElement.textContent = 'Login failed: 아이디와 비밀번호가 틀립니다.';
            messageElement.style.color = 'red';
        }
    })
    .catch(error => {
        messageElement.textContent = '오류가 발생했습니다: ' + error.message;
        messageElement.style.color = 'red';
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

    document.getElementById('logo').addEventListener('click', function() {
        window.location.href = '/';
    });
});