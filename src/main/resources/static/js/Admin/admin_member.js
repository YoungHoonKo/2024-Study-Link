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
                document.getElementById('profileId').textContent = userId;
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
            const roleCell = row.querySelector('td:nth-child(5)');
            const currentRole = roleCell.textContent.trim();
            const userId = row.querySelector('td:nth-child(1)').textContent;

            const dropdown = document.createElement('select');
            dropdown.className = 'select-role';

            ['User', 'Admin'].forEach(role => {
                const option = document.createElement('option');
                option.value = role;
                option.textContent = role;

                if (currentRole === role) {
                    option.selected = true;
                }

                dropdown.appendChild(option);
            });

            dropdown.onchange = () => {
                const newRole = dropdown.value;
                roleCell.textContent = newRole;
                console.log(newRole);

                if (newRole === 'Admin') {
                    // Admin으로 변경된 경우
                    fetch(`/api/admin/member/${userId}/add-admin`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'access': localStorage.getItem("access")
                        },
                        body: JSON.stringify({ role: newRole })
                    })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(errorData => {
                                    throw new Error('Network response was not ok: ' + JSON.stringify(errorData));
                                });
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('관리자 추가 성공:', data);
                        })
                        .catch(error => {
                            console.error('관리자 추가 실패:', error);
                        });
                } else if (newRole === 'User') {
                    // User로 변경된 경우
                    fetch(`/api/admin/member/${userId}/remove-admin`, {
                        method: "DELETE",
                        headers: {
                            'Content-Type': 'application/json',
                            'access': localStorage.getItem("access")
                        }
                    })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(errorData => {
                                    throw new Error('Network response was not ok: ' + JSON.stringify(errorData));
                                });
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('관리자 삭제 성공:', data);
                        })
                        .catch(error => {
                            console.error('관리자 삭제 실패:', error);
                        });
                }
            };

            // 기존 역할 변경 API 호출은 여기에 위치할 필요 없음
            // roleCell.innerHTML = '';
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
        row.dataset.profileImage = user.profileImage || ''; // 추가된 데이터 속성
        row.dataset.bio = user.bio || '';
        row.dataset.address = user.address || '';
        row.dataset.organization = user.organization || '';
        row.dataset.postcode = user.postcode || '';

        row.innerHTML = `
            <td>${user.id || 'N/A'}</td>
            <td>${user.username || 'N/A'}</td>
            <td>${user.password || 'N/A'}</td>
            <td>${user.status || 'N/A'}</td>
            <td>${user.role || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    }
});
