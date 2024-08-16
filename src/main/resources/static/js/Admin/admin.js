document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('access'); // access 키로 올바르게 가져오기

    async function checkUserRole() {
        try {
            const response = await fetch('/api/auth/check-role', {
                method: 'POST', // 서버가 GET을 사용한다고 가정하면 POST로 수정
                headers: {
                    'Authorization': `Bearer ${token}`, // 올바른 토큰 사용
                    'Content-Type': 'application/json',
                }
            });
            console.log(response);

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                console.log(contentType);
                //FIXME : contenttype = html임

                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log(data);
                    return data.roles; // JSON 응답에서 roles를 반환
                } else {
                    const errorText = await response.text();
                    console.error('Unexpected response format:', errorText);
                    return null;
                }
            } else {
                console.error('Role check failed:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Role check error:', error);
            return null;
        }
    }

    async function initializeAdminPage() {
        const role = await checkUserRole();
        console.log('Role:', role);

        const adminTitle = document.getElementById('admin-title');
        const adminContent = document.getElementById('admin-content');
        const accessDenied = document.getElementById('access-denied');
        const memberList = document.getElementById('member_list');

        if (role === "ROLE_ADMIN") {
            adminTitle.textContent = '관리자 페이지에 오신 것을 환영합니다';
            adminContent.style.display = 'block';
            memberList.style.display = 'block'; // 권한이 확인되면 버튼들이 보이도록 설정
            accessDenied.style.display = 'none'; // 접근 거부 메시지는 숨김
        } else if (role === null) {
            adminTitle.textContent = '지금 role 값이 null 임..';
            accessDenied.style.display = 'block'; // 접근 거부 메시지 보이기
            adminContent.style.display = 'none';
            memberList.style.display = 'none';
        } else {
            console.log("role = " + role);
            adminTitle.textContent = '접근 불가';
            accessDenied.style.display = 'block'; // 접근 거부 메시지 보이기
            adminContent.style.display = 'none';
            memberList.style.display = 'none';
        }
    }

    initializeAdminPage(); // DOMContentLoaded 안에서 호출
});