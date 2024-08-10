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
                const data = await response.text();
                return data;  // role 값을 반환합니다.
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

        if (role && role.includes('ROLE_USER')) {
            adminTitle.textContent = '관리자 페이지에 오신 것을 환영합니다';
            adminContent.style.display = 'block';
            memberList.style.display = 'block'; // 권한이 확인되면 버튼들이 보이도록 설정
        } else {
            adminTitle.textContent = '접근 불가';
            accessDenied.style.display = 'block';
        }
    }

    initializeAdminPage();
});