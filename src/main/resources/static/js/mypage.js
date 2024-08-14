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
});

function loadUserProfile() {
    fetch('/api/user/profile', {
        method: "GET",
        headers: {
            "access": localStorage.getItem("access")
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').value = data.username;
            document.getElementById('email').value = data.email;
            document.getElementById('bio').value = data.bio;
            document.getElementById('accountStatus').innerText = `Status: ${data.accountStatus}`;

            // 로컬 스토리지에 저장
            const profileData = {
                username: data.username,
                email: data.email,
                bio: data.bio,
                profilePicture: data.profilePicture // 이미지 경로를 추가
            };
            localStorage.setItem('userProfile', JSON.stringify(profileData));
        })
        .catch(error => console.error('Error loading profile:', error));
}

function updateProfile() {
    const profileData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        bio: document.getElementById('bio').value,
        profilePicture: document.getElementById('profilePicture').value
    };

    // 로컬 스토리지에 데이터 저장
    localStorage.setItem('userProfile', JSON.stringify(profileData));

    fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'access': localStorage.getItem("access")
        },
        body: JSON.stringify(profileData)
    })
        .then(response => {
            if (response.ok) {
                alert('Profile updated successfully');
                window.location.reload();
            } else {
                alert('Failed to update profile');
            }
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
        method: "GET",
        headers: {
            "access": localStorage.getItem("access")
        }
    })
        .then(response => response.json())
        .then(skills => {
            const skillsList = document.getElementById('skillsList');
            skillsList.innerHTML = '';
            skills.forEach(skill => {
                const li = document.createElement('li');
                li.innerText = skill;
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = () => deleteSkill(skill);
                li.appendChild(deleteButton);
                skillsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading skills:', error));
}

function addSkill() {
    const newSkill = document.getElementById('newSkill').value;

    if (newSkill.trim() !== '') {
        const skillsList = document.getElementById('skillsList');
        const li = document.createElement('li');
        li.innerText = newSkill;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => {
            skillsList.removeChild(li);
        };

        li.appendChild(deleteButton);
        skillsList.appendChild(li);

        // Clear input field after adding
        document.getElementById('newSkill').value = '';
    }
}

function deleteSkill(skill) {
    fetch('/api/user/delete-skill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
        method: "GET",
        headers: {
            "access": localStorage.getItem("access")
        }
    })
        .then(response => response.json())
        .then(interests => {
            const interestsList = document.getElementById('interestsList');
            interestsList.innerHTML = '';
            interests.forEach(interest => {
                const li = document.createElement('li');
                li.innerText = interest;
                interestsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading interests:', error));
}

function addInterest() {
    const newInterest = document.getElementById('newInterest').value;

    if (newInterest.trim() !== '') {
        const interestsList = document.getElementById('interestsList');
        const li = document.createElement('li');
        li.innerText = newInterest;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => {
            interestsList.removeChild(li);
        };

        li.appendChild(deleteButton);
        interestsList.appendChild(li);

        // Clear input field after adding
        document.getElementById('newInterest').value = '';
    }
}

function deleteAccount() {
    const confirmation = confirm("정말 회원탈퇴를 하시겠습니까 ?");

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