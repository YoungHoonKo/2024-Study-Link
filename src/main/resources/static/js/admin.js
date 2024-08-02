document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('access');

    async function checkUserRole() {
        try {
            const response = await fetch('/api/auth/check-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access': token  // JWT 토큰을 Authorization 헤더에 추가합니다.
                }
            });
            console.log(response)
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

        if (role && role.includes('ROLE_USER')) {
            adminTitle.textContent = 'Admin Page';
            adminContent.style.display = 'block';
        } else {
            adminTitle.textContent = 'Access Denied';
            accessDenied.style.display = 'block';
        }
    }

    initializeAdminPage();
});