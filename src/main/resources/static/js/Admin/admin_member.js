document.addEventListener("DOMContentLoaded", () => {
    const profileModal = document.getElementById('profileModal');
    const closeModal = document.querySelector('.modal .close');

    // 모달 닫기
    closeModal.onclick = () => {
        profileModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === profileModal) {
            profileModal.style.display = 'none';
        }
    };

    // 이름 클릭 시 모달 창 여는 함수
    function attachModalEvents() {
        document.querySelectorAll('#userTable tbody tr').forEach(row => {
            row.querySelector('td:nth-child(2)').onclick = () => {
                const userId = row.querySelector('td:nth-child(1)').textContent;
                const name = row.querySelector('td:nth-child(2)').textContent;
                const email = row.querySelector('td:nth-child(6)').textContent;

                const profileImage = row.dataset.profileImage;
                const bio = row.dataset.bio;
                const address = row.dataset.address;
                const organization = row.dataset.organization;
                const postcode = row.dataset.postcode;

                console.log(address); // 콘솔에서 주소를 확인
                document.getElementById('profileId').textContent = profileId;
                document.getElementById('profileImage').src = profileImage;
                document.getElementById('profileName').textContent = name;
                document.getElementById('profileBio').textContent = bio;
                document.getElementById('profileAddress').textContent = address;
                document.getElementById('profileEmail').textContent = email;
                document.getElementById('profileOrganization').textContent = organization;

                profileModal.style.display = 'block';
            };
        });
    }

    function attachRoleChangeEvents() {
        document.querySelectorAll('#userTable tbody tr').forEach(row => {
            // 현재 역할 셀과 현재 역할 값 가져오기
            const roleCell = row.querySelector('td:nth-child(5)');
            const currentRole = roleCell.textContent.trim();

            // 사용자 ID 가져오기
            const userId = row.querySelector('td:nth-child(1)').textContent;

            // 콘솔에 사용자 ID와 현재 역할 출력
            console.log(`아이디: ${userId}, 역할: ${currentRole}`);

            // 드롭다운 생성 및 설정
            const dropdown = document.createElement('select');
            dropdown.className = 'select-role';

            ['User', 'Admin'].forEach(role => {
                const option = document.createElement('option');

                // 콘솔에서 사용자 ID와 역할 출력
                console.log(`아이디 : ${userId}, optionvalue : ${role}`);

                option.value = role;
                option.textContent = role;

                // 현재 역할과 일치하는 옵션을 선택 상태로 설정
                if (currentRole === "ROLE_ADMIN" && role === "Admin") {
                    option.selected = true;
                } else if (currentRole === "ROLE_USER" && role === "User") {
                    option.selected = true;
                }

                dropdown.appendChild(option);
            });

            dropdown.onchange = () => {
                const newRole = dropdown.value; // 새 역할 값
                roleCell.textContent = newRole; // UI에서 역할 업데이트

                // 사용자 ID를 얻어 서버에 요청을 보냄
                const userId = row.querySelector('td:nth-child(1)').textContent;

                // 서버에 PUT 요청을 보내어 역할 업데이트
                fetch(`/api/admin/member/${userId}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'access': localStorage.getItem("access") // 인증 토큰 등
                    },
                    body: JSON.stringify({ role: newRole }) // 새 역할을 요청 본문에 포함
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok.');
                        }
                        return response.json(); // 서버 응답을 JSON으로 파싱
                    })
                    .then(data => {
                        console.log('서버 응답:', data); // 성공적으로 업데이트된 경우 응답 처리
                    })
                    .catch(error => {
                        console.error('요청 실패:', error); // 요청 실패 시 에러 처리
                    });
            };


            // 기존 내용 지우고 드롭다운 추가
            roleCell.innerHTML = '';
            roleCell.appendChild(dropdown);
        });
    }

    // 서버에서 회원 데이터를 가져와 테이블에 추가
    fetch("/api/admin/member", {
        method: "GET",
        headers: {
            'access': localStorage.getItem("access")
        }
    })
        .then(response => {
            // 응답 본문을 텍스트로 읽어서 검토
            return response.text().then(text => {
                console.log("Response Text:", text); // 응답 내용을 로그에 찍어 봄
                return JSON.parse(text); // JSON으로 파싱
            });
        })
        .then(data => {
            data.forEach(user => {
                populateTable(user);
            });
            attachRoleChangeEvents();
            attachModalEvents();
        })
        .catch(error => {
            console.error("Error:", error);
        });

    // 테이블에 데이터를 추가하는 함수
    function populateTable(user) {
        const tableBody = document.querySelector('#userTable tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id ? user.id : 'N/A'}</td>
            <td>${user.username ? user.username : 'N/A'}</td>
            <td>${user.password ? user.password : 'N/A'}</td>
            <td>${user.status ? user.status : 'N/A'}</td>
            <td>${user.role ? user.role : 'N/A'}</td>
            <td>${user.email ? user.email : 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    }
});
