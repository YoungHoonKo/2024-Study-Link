document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault(); // 폼이 기본적으로 제출되지 않도록 방지

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    // 사용자 이름과 비밀번호가 모두 입력되지 않았을 경우
    if (!username || !password) {
        messageElement.textContent = '아이디와 비밀번호를 입력하세요';
        messageElement.style.color = 'red';
        return;
    }

    const loginData = {
        username: username,
        password: password
    };

    fetch('/api/admin/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
                });
            }
            return response.json(); // 응답을 JSON으로 변환 (응답 본문을 JSON으로 파싱)
        })
        .then(data => {
            if (!data.access) {
                alert('로그인 오류');
                window.location.reload();
                return;
            }

            if (data.ok) {
                const accessToken = data.access;
                messageElement.textContent = 'Login successful!';
                messageElement.style.color = 'green';
                console.log(data.role);
                localStorage.setItem('access', accessToken);

                // 역할에 따라 리다이렉트
                if (data.role === 'ROLE_ADMIN') {
                    window.location.href = '/admin';
                } else if (data.role === 'ROLE_USER') {
                    window.location.href = '/'; // 첫화면으로 리다이렉트
                } else {
                    window.location.href = '/404';
                }
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
