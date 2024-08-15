document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('access');


    async function checkUserRole() {
        try {
            const response = await fetch('/api/auth/check-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access': token  // JWT 토큰을 헤더에 추가합니다.
                }
            });

            if (response.ok) {

                const contentType = response.headers.get('content-type');
                const data = await response.json();  // JSON으로 응답을 처리
                console.log('Role data:', data);
                return data.role;  // 서버 응답이 JSON 객체라면 data.role로 접근
                // if (contentType && contentType.includes('application/json')) {
                //     const data = await response.json();  // JSON으로 응답을 처리
                //     console.log('Role data:', data);
                //     return data.role;  // 서버 응답이 JSON 객체라면 data.role로 접근
                // } else {
                //     // 예상하지 못한 형식의 응답일 경우
                //     const errorText = await response.text();  // 응답을 텍스트로 읽기
                //     console.error('Unexpected response format:', errorText);
                //     return null;
                // }
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
        console.log(role);
        const adminTitle = document.getElementById('admin-title');
        const adminContent = document.getElementById('admin-content');
        const accessDenied = document.getElementById('access-denied');
        const memberList = document.getElementById('member_list');


        adminTitle.textContent = '관리자 페이지에 오신 것을 환영합니다';
        adminContent.style.display = 'block';
        memberList.style.display = 'block';
        // if (role && role.includes("ROLE_ADMIN")) {
        //
        //     adminTitle.textContent = '관리자 페이지에 오신 것을 환영합니다';
        //     adminContent.style.display = 'block';
        //     memberList.style.display = 'block'; // 권한이 확인되면 버튼들이 보이도록 설정
        // } else {
        //     adminTitle.textContent = '접근 불가';
        //     accessDenied.style.display = 'block';
        // }
    }

    initializeAdminPage();
});