document.getElementById('register').addEventListener('click', function (event) {
    event.preventDefault(); // 폼이 기본적으로 제출되지 않도록 방지

    const email = document.getElementById('email');
    const name = document.getElementById('name');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const address = document.getElementById('address') ? document.getElementById('address') : null;
    const detailAddress = document.getElementById('detailAddress');
    const postcode = document.getElementById('postcode');

    let message = '';
    let passwordRequirementsMessage = '';

    // 입력 필드 초기화
    email.classList.remove('error');
    name.classList.remove('error');
    password.classList.remove('error');
    confirmPassword.classList.remove('error');
    if (address) {
        address.classList.remove('error');
    }
    detailAddress.classList.remove('error');
    postcode.classList.remove('error');

    if (!email.value) {
        email.classList.add('error');
        email.placeholder = 'Email is required';
    } else if (!validateEmail(email.value)) {
        email.classList.add('error');
        email.value = '';
        email.placeholder = 'Invalid email format';
        message += 'Email is incorrect.<br>';
    }
    if (!name.value) {
        name.classList.add('error');
        name.placeholder = 'Name is required';
    }
    if (!password.value) {
        password.classList.add('error');
        password.placeholder = 'Password is required';
    } else if (!validatePassword(password.value)) {
        password.classList.add('error');
        passwordRequirementsMessage = '대문자, 특수문자, 숫자를 포함해야 됩니다.';
    }
    if (!confirmPassword.value) {
        confirmPassword.classList.add('error');
        confirmPassword.placeholder = 'Confirm Password is required';
    }
    if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
        message += 'Passwords do not match!<br>';
        password.classList.add('error');
        confirmPassword.classList.add('error');
    }
    if (!postcode.value) {
        postcode.classList.add('error');
        postcode.placeholder = 'Postcode is required';
    }
    if (!address.value) {
        address.classList.add('error');
        address.placeholder = 'Address is required';
    }
    if (!detailAddress.value) {
        detailAddress.classList.add('error');
        detailAddress.placeholder = 'Detail Address is required';
    } else if (!validateAddress(detailAddress.value)) {
        detailAddress.classList.add('error');
        detailAddress.value = '';
        detailAddress.placeholder = 'Check your Address again';
    }

    const messageElement = document.getElementById('message');
    const passwordRequirementsElement = document.getElementById('passwordRequirements');

    if (message || passwordRequirementsMessage) {
        messageElement.innerHTML = message;
        messageElement.style.color = 'red';
        passwordRequirementsElement.innerHTML = passwordRequirementsMessage;
        passwordRequirementsElement.style.color = 'red';
    } else if (!email.value || !name.value || !password.value || !confirmPassword.value || !postcode.value || !address.value || !detailAddress.value) {
        messageElement.innerHTML = 'Please fill out all required fields.';
        messageElement.style.color = 'red';
        passwordRequirementsElement.innerHTML = '';
    } else {
        const registerData = {
            name: name.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
            address: address.value + ' ' + detailAddress.value,
            postcode: postcode.value
        };

        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })
            .then(response => response.json().then(data => ({ status: response.status, data })))
            .then(({ status, data }) => {
                if (status === 201) {
                    messageElement.textContent = '회원가입 성공!';
                    messageElement.style.color = 'green';
                    window.location.href = "/login"
                } else if (status === 409) {
                    messageElement.textContent = '회원가입 실패: 이미 사용 중인 이메일입니다.';
                    messageElement.style.color = 'red';
                } else if (status === 400) {
                    messageElement.textContent = '회원가입 실패: ' + (data.message || '비밀번호가 일치하지 않습니다.');
                    messageElement.style.color = 'red';
                } else {
                    messageElement.textContent = '회원가입 실패: 서버 오류가 발생했습니다.';
                    messageElement.style.color = 'red';
                }
            })
            .catch(error => {
                console.log(error);
                messageElement.textContent = 'An error occurred: ' + error.message;
                messageElement.style.color = 'red';
            });
    }
});

// 이메일 형식 확인 함수
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 비밀번호 형식 확인 함수
function validatePassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecial;
}

// 주소 형식 확인 함수 (한국어와 숫자만 허용)
function validateAddress(address) {
    const re = /^[0-9가-힣\s]+$/;
    return re.test(address);
}

// 주소 필드에서 숫자와 한국어만 입력되도록 제한
document.getElementById('address').addEventListener('input', function (event) {
    const address = event.target.value;
    const filteredAddress = address.replace(/[^0-9가-힣\s]/g, '');
    const messageElement = document.getElementById('message');
    if (address !== filteredAddress) {
        event.target.value = filteredAddress;
        messageElement.innerHTML = '주소는 한국어와 숫자로 정확하게 입력하세요.';
        messageElement.style.color = 'red';
    } else {
        messageElement.innerHTML = '';
    }
});

// 상세 주소 필드에서 숫자와 한국어만 입력되도록 제한
document.getElementById('detailAddress').addEventListener('input', function (event) {
    const detailAddress = event.target.value;
    const filteredDetailAddress = detailAddress.replace(/[^0-9가-힣\s]/g, '');
    if (detailAddress !== filteredDetailAddress) {
        event.target.value = filteredDetailAddress;
        document.getElementById('message').innerHTML = '주소를 올바르게 입력하세요.';
        document.getElementById('message').style.color = 'red';
    } else {
        document.getElementById('message').innerHTML = '';
    }
});

// 로고 클릭 시 페이지 이동
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('logo').addEventListener('click', function () {
        window.location.href = '/';
    })
});