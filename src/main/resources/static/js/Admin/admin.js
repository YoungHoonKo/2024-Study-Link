// document.addEventListener('DOMContentLoaded', function() {
//     const token = localStorage.getItem('access'); // access 키로 올바르게 가져오기
//
//     async function checkUserRole() {
//         try {
//             const response = await fetch('/api/auth/check-role', {
//                 method: 'POST', // 서버가 POST를 사용한다고 가정
//                 headers: {
//                     'access': token, // 올바른 토큰 사용
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ role: 'admin' })
//             });
//
//             console.log(response);
//             const contentType = response.headers.get('content-type');
//             console.log('Content-Type:', contentType);
//             const data = await response.json();
//             if (response.ok) {
//                 if (contentType && contentType.includes('application/json')) {
//
//                     console.log('JSON Data:', data);
//                     return data.role; // JSON 응답에서 roles를 반환
//                 } else if (contentType && contentType.includes('text/html')) {
//                     const errorText = await response.text();
//                     console.error('HTML Response received:', errorText);
//                     console.log(data.role)
//                     // HTML 응답에서 JSON을 파싱하려고 시도할 필요 없음
//                     return null;
//                 } else {
//                     const errorText = await response.text();
//                     console.error('Unexpected response format:', errorText);
//                     return null;
//                 }
//             } else {
//                 console.error('Role check failed:', response.status);
//                 return null;
//             }
//         } catch (error) {
//             console.error('Role check error:', error);
//             return null;
//         }
//     }
//
//     async function initializeAdminPage() {
//         const role = await checkUserRole();
//         console.log('Role:', role);
//
//         const adminTitle = document.getElementById('admin-title');
//         const adminContent = document.getElementById('admin-content');
//         const accessDenied = document.getElementById('access-denied');
//         const memberList = document.getElementById('member_list');
//
//         if (role === "ROLE_ADMIN") {
//             adminTitle.textContent = '관리자 페이지에 오신 것을 환영합니다';
//             adminContent.style.display = 'block';
//             memberList.style.display = 'block'; // 권한이 확인되면 버튼들이 보이도록 설정
//             accessDenied.style.display = 'none'; // 접근 거부 메시지는 숨김
//         } else if (role === null) {
//             adminTitle.textContent = '지금 role 값이 null 임..';
//             accessDenied.style.display = 'block'; // 접근 거부 메시지 보이기
//             adminContent.style.display = 'none';
//             memberList.style.display = 'none';
//         } else {
//             console.log("role = " + role);
//             adminTitle.textContent = '접근 불가';
//             accessDenied.style.display = 'block'; // 접근 거부 메시지 보이기
//             adminContent.style.display = 'none';
//             memberList.style.display = 'none';
//         }
//     }
//
//     // 비동기 함수 호출을 올바르게 처리
//     async function someFunction() {
//         try {
//             await initializeAdminPage();
//             console.log('Initialization complete');
//         } catch (error) {
//             console.error('Error initializing admin page:', error);
//         }
//     }
//
//     someFunction(); // DOMContentLoaded 안에서 호출
// });

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

        if (role && role.includes('ROLE_ADMIN')) {
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