document.addEventListener('DOMContentLoaded', function () {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
        fetch("/api/auth/validate-token", {
            method: "POST",
            headers: {
                'access': accessToken
            }
        })
            .then(response => {
                if (response.ok) {
                    loadUserProfile();
                    loadUserSkills();
                    loadUserInterests();
                } else {
                    console.log(response);
                }
            })
            .catch(error => {
                localStorage.removeItem("access");
                window.location.href = "/login";
            });
    } else {
        window.location.href = "/";
    }

    // 초기 데이터 로드
});

function loadUserProfile() {
    fetch('/api/user/profile', {
        method: "GET",
        headers: {
            "access": localStorage.getItem("access"),
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            const contentType = response.headers.get("content-type");

            // 응답 본문을 텍스트로 먼저 출력
            return response.text().then(text => {
                console.log('Response body as text:', text);
                // JSON일 경우 파싱 시도
                if (contentType && contentType.includes("application/json")) {
                    try {
                        return JSON.parse(text);
                    } catch (error) {
                        throw new Error(`Failed to parse JSON: ${error.message}`);
                    }
                } else {
                    throw new Error(`Expected JSON, but got: ${text}`);
                }
            });
        })
        .then(data => {
            document.getElementById('username').value = data.username;
            document.getElementById('email').value = data.email;
            document.getElementById('bio').value = data.bio;
            document.getElementById('accountStatus').innerText = `Status: ${data.accountStatus}`;
        })
        .catch(error => {
            console.error('Error loading profile:', error.message || error);
        });
}

function updateProfile() {
    const profileData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        bio: document.getElementById('bio').value
    };
    fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'access': localStorage.getItem("access")
        },
        body: JSON.stringify(profileData)
    })
        .then(response => response.json())
        .then(data => {
            alert('Profile updated successfully');
            window.location.reload();
        })
        .catch(error => console.error('Error updating profile:', error));
}

function changePassword() {
    const passwordData = {
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('newPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    fetch('/api/user/password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'access': localStorage.getItem("access")
        },
        body: JSON.stringify(passwordData)
    })
        .then(response => {
            if (response.ok) {
                alert('Password changed successfully');
            } else {
                alert('Failed to change password');
            }
        })
        .catch(error => console.error('Error changing password:', error));
}

function loadUserSkills() {
    fetch('/api/user/skills', {
        method: 'GET',
        headers: {
            'access': localStorage.getItem("access")
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON으로 파싱
        })
        .then(skills => {
            console.log('Fetched skills:', skills);
            const skillsList = document.getElementById('skillsList');
            skillsList.innerHTML = '';

            skills.forEach(skill => {
                const li = document.createElement('li');
                li.innerText = skill.skill; // UserSkillDTO의 skillName 필드 사용
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = () => deleteSkill(skill);
                li.appendChild(deleteButton);
                skillsList.appendChild(li);
            });

            // 이미 선택한 스킬을 모달에서 제외
            const allSkills = ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'C++', 'Spring Boot', 'React', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Flask', 'SQL', 'MongoDB', 'Linux', 'Docker', 'Kubernetes', 'Git', 'MySQL', 'PostgreSQL'];
            const availableSkills = allSkills.filter(skill => !skills.map(s => s.skillName).includes(skill));

            updateSkillModal(availableSkills);
        })
        .catch(error => console.error('Error loading skills:', error));
}

function updateSkillModal(skills) {
    const skillModalList = document.getElementById('skillModalList');
    skillModalList.innerHTML = ''; // 모달의 기존 내용을 지움
    skills.forEach(skill => {
        const li = document.createElement('li');
        li.innerText = skill;
        li.onclick = () => addSkill(skill);
        skillModalList.appendChild(li);
    });
}

function showSkillModal() {
    document.getElementById('skillModal').style.display = 'flex';
}

function closeSkillModal() {
    document.getElementById('skillModal').style.display = 'none';
}

function addSkill(skillName) {
    fetch('/api/user/add-skill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'access': localStorage.getItem("access")
        },
        body: JSON.stringify({ skill: skillName })
    })
        .then(response => response.json())
        .then(skill => {
            const skillsList = document.getElementById('skillsList');
            const li = document.createElement('li');
            li.innerText = skill;
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.onclick = () => deleteSkill(skill);
            li.appendChild(deleteButton);
            skillsList.appendChild(li);
            closeSkillModal(); // 스킬 선택 후 모달 닫기
            loadUserSkills(); // 스킬 리스트 갱신
        })
        .catch(error => console.error('Error adding skill:', error));
}

function deleteSkill(skill) {
    fetch('/api/user/delete-skill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'access': localStorage.getItem("access")
        },
        body: JSON.stringify({ skill: skill })
    })
        .then(response => {
            if (response.ok) {
                loadUserSkills(); // 스킬 목록을 다시 로드하여 갱신
            } else {
                alert('Failed to delete skill');
            }
        })
        .catch(error => console.error('Error deleting skill:', error));
}

function loadUserInterests() {
    fetch('/api/user/interests', {
        method: 'GET',
        headers: {
            'access': localStorage.getItem("access")
        }
    })
        .then(response => response.json())
        .then(interests => {
            const interestsList = document.getElementById('interestsList');
            interestsList.innerHTML = '';
            interests.forEach(interest => {
                const li = document.createElement('li');
                li.innerText = interest;
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = () => deleteInterest(interest);
                li.appendChild(deleteButton);
                interestsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading interests:', error));
}

function showInterestModal() {
    document.getElementById('interestModal').style.display = 'flex';
}

function closeInterestModal() {
    document.getElementById('interestModal').style.display = 'none';
}

function addInterest(interestName) {
    fetch('/api/user/add-interest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'access': localStorage.getItem("access")
        },
        body: JSON.stringify({ interest: interestName })
    })
        .then(response => response.json())
        .then(interest => {
            const interestsList = document.getElementById('interestsList');
            const li = document.createElement('li');
            li.innerText = interest;
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.onclick = () => deleteInterest(interest);
            li.appendChild(deleteButton);
            interestsList.appendChild(li);
            closeInterestModal(); // 흥미 선택 후 모달 닫기
        })
        .catch(error => console.error('Error adding interest:', error));
}

function deleteInterest(interest) {
    fetch('/api/user/delete-interest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'access': localStorage.getItem("access")
        },
        body: JSON.stringify({ interest: interest })
    })
        .then(response => {
            if (response.ok) {
                loadUserInterests(); // 흥미 목록을 다시 로드하여 갱신
            } else {
                alert('Failed to delete interest');
            }
        })
        .catch(error => console.error('Error deleting interest:', error));
}

function deleteAccount() {
    const confirmation = confirm("정말 회원탈퇴를 하시겠습니까?");

    if (confirmation) {
        fetch('/api/user/delete-user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'access': localStorage.getItem("access")
            }
        })
            .then(response => {
                if (response.ok) {
                    alert("Your account has been successfully deleted.");
                    localStorage.removeItem("access"); // 로그아웃 처리
                    window.location.href = "/"; // 홈 페이지로 리다이렉트
                } else {
                    alert("Failed to delete the account. Please try again.");
                }
            })
            .catch(error => console.error('Error deleting account:', error));
    }
}