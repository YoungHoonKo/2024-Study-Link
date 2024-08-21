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
                //const skills = row.dataset.userSkills;
                const organization = row.dataset.organization;
                const postcode = row.dataset.postcode;
                // FIXME : adress 콘솔 로그 undefined 이렇게 뜨는 문제
                console.log(address);
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

    // 역할 드롭다운 변경 이벤트 추가 함수
    function attachRoleChangeEvents() {
        document.querySelectorAll('#userTable tbody tr').forEach(row => {
            const roleCell = row.querySelector('td:nth-child(5)');
            const currentRole = roleCell.textContent.trim();
            const dropdown = document.createElement('select');
            dropdown.className = 'select-role';
            ['User', 'Admin'].forEach(role => {
                const option = document.createElement('option');
                option.value = role;
                option.textContent = role;
                if (role === currentRole) option.selected = true;
                dropdown.appendChild(option);
            });

            dropdown.onchange = () => {
                const newRole = dropdown.value;
                roleCell.textContent = newRole;
                console.log(`Role changed to ${newRole} for user ID: ${row.querySelector('td:nth-child(1)').textContent}`);
            };
            roleCell.innerHTML = ''; // 기존 내용을 지우고 드롭다운 추가
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
            attachModalEvents();
            attachRoleChangeEvents();
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
