document.addEventListener('DOMContentLoaded', function () {
    const accessToken = localStorage.getItem("access");
    const profileDropdown = document.getElementById('profileDropdown');

    // 로그인 상태 확인 및 토큰 유효성 확인
    if (accessToken) {
        // 토큰 유효성 확인을 위한 요청
        fetch('/api/auth/validate-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access': accessToken
            }
        })
            .then(response => {
                if (response.ok) {
                    // 토큰이 유효한 경우

                    profileDropdown.innerHTML = `
<!--                    <li><a href="/mypage">My Page</a></li>--> <!-- 수정 페이지는 프로필 페이지에 배치함 -->
                    <li><a href="/profile">My Profile</a></li>
                    <li><a href="#" id="logoutButton">로그아웃</a></li>
                `;
                    document.getElementById('logoutButton').addEventListener('click', () => {
                        // 로그아웃 로직
                        handleLogout();
                    });
                } else {
                    console.log(response)
                    // 토큰이 유효하지 않은 경우, 로컬 스토리지에서 토큰 제거
                    localStorage.removeItem('access');
                    displayLoginSignupOptions();
                }
            })
            .catch(error => {
                console.error('Error validating token:', error);
                // 오류 발생 시, 로그인 버튼 유지 및 처리
                localStorage.removeItem('access');
                alert("로그인 에러 발생")
                window.location.reload()
                displayLoginSignupOptions();
            });
    } else {
        // 토큰이 없을 때 기본 설정
        displayLoginSignupOptions();
    }

    function displayLoginSignupOptions() {
        profileDropdown.innerHTML = `
            <li><a href="/login">로그인</a></li>
            <li><a href="/register">회원가입</a></li>
        `;
    }

    function handleLogout() {
        // 서버에 로그아웃 요청을 보내고 Refresh Token을 삭제
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access': accessToken
            },
            credentials: 'include' // 쿠키를 포함한 요청
        })
            .then(response => {
                if (response.ok) {
                    localStorage.removeItem('access'); // accessToken 삭제
                    window.location.href = '/'; // 로그아웃 후 로그인 페이지로 리다이렉트
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
    }
});


function click123(event){
    event.preventDefault()
    const accessToken = localStorage.getItem("access")

    if (accessToken){
        fetch("/api/auth/validate-token",{
            method : "POST",
            headers : {
                'access': accessToken
            }
        }).then(response => {
            if (response.ok){
                window.location.href = "/board/save"
            }else{
                alert("로그인 오류")
                localStorage.removeItem("access")
                window.location.href = "/login"
            }
        })
            .catch(error => {
                console.error("error:",error)
            })
    }else{
        alert("로그인 후 이용가능.")
        window.location.href = "/login"
    }
}