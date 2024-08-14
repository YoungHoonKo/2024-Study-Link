document.addEventListener('DOMContentLoaded', function () {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");

    function reissueAccessToken() {
        return fetch("/api/auth/reissue", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to reissue access token");
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem("access", data.access);
                return data.access;
            });
    }

    function validateAndLoadData() {
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
                } else if (response.status === 401 && refreshToken) {
                    // 토큰 만료로 인한 401 응답 시, 재발행 시도
                    reissueAccessToken().then(newAccessToken => {
                        fetch("/api/auth/validate-token", {
                            method: "POST",
                            headers: {
                                'access': newAccessToken
                            }
                        })
                            .then(validateResponse => {
                                if (validateResponse.ok) {
                                    loadUserProfile();
                                    loadUserSkills();
                                    loadUserInterests();
                                } else {
                                    throw new Error("Validation failed after reissue");
                                }
                            });
                    }).catch(error => {
                        localStorage.removeItem("access");
                        localStorage.removeItem("refresh");
                        window.location.href = "/login";
                    });
                } else {
                    throw new Error("Failed to validate token");
                }
            })
            .catch(error => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
            });
    }

    if (accessToken) {
        validateAndLoadData();
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
            document.getElementById('nickname').value = data.username;
            document.getElementById('bio').value = data.bio;
            document.getElementById('job').value = data.position;
            document.getElementById('affiliation').value = data.organization;
        })
        .catch(error => {
            console.error('Error loading profile:', error.message || error);
        });
}

function updateProfile() {
    const profileData = {
        username: document.getElementById('nickname').value,
        email: document.getElementById('job').value,
        bio: document.getElementById('bio').value,
        organization :document.getElementById('affiliation').value,
        position: document.getElementById("job").value
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


document.addEventListener('DOMContentLoaded', function () {
    const availableSkills = {
        "spring boot": "Spring Boot",
        "java": "Java",
        "c": "C",
        "c++": "C++",
        "python": "Python",
        "mysql": "MySQL"
    };

    document.getElementById('addSkillButton').addEventListener('click', addSkill);

    function addSkill() {
        const skillContainer = document.getElementById('skill-container');
        const selectedSkills = Array.from(document.querySelectorAll('select[name="skills[]"]'))
            .map(select => select.value);

        const skillGroup = document.createElement('div');
        skillGroup.className = 'skill-group';

        const skillSelect = document.createElement('select');
        skillSelect.name = 'skills[]';

        Object.keys(availableSkills).forEach(skill => {
            if (!selectedSkills.includes(skill)) {
                const option = document.createElement('option');
                option.value = skill;
                option.textContent = availableSkills[skill];
                skillSelect.appendChild(option);
            }
        });

        const levelSelect = document.createElement('select');
        levelSelect.name = 'skill-levels[]';
        levelSelect.innerHTML = `
            <option value="beginner">초급</option>
            <option value="intermediate">중급</option>
            <option value="advanced">고급</option>
        `;

        // 삭제 버튼 생성
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button'; // 버튼이 폼 제출을 방해하지 않도록 설정
        deleteButton.textContent = '삭제';
        deleteButton.className = 'delete-skill-button';

        // 삭제 버튼 클릭 시 스킬 항목을 삭제하는 이벤트 핸들러
        deleteButton.addEventListener('click', function () {
            skillContainer.removeChild(skillGroup);
        });

        // skillGroup에 요소들 추가
        skillGroup.appendChild(skillSelect);
        skillGroup.appendChild(levelSelect);
        skillGroup.appendChild(deleteButton);

        // skillContainer에 skillGroup 추가
        skillContainer.appendChild(skillGroup);
    }
});