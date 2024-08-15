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
                localStorage.removeItem("access")
                window.location.href = "/login"
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
            "access": localStorage.getItem("access")
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').value = data.username;
            document.getElementById('email').value = data.email;
            document.getElementById('bio').value = data.bio;
            document.getElementById('accountStatus').innerText = `Status: ${data.accountStatus}`;
        })
        .catch(error => console.error('Error loading profile:', error));
}

function updateProfile() {
    const profileData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        bio: document.getElementById('bio').value
    };
    console.log(profileData)
    fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'access': localStorage.getItem("access")
        },
        body: JSON.stringify(profileData)
    })
        .then(response => {
            console.log(response)
        })
        .then(data => {
            alert('Profile updated successfully')
            window.location.reload()
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
                console.log(response);
                alert('Failed to change password');
            }
        })
        .catch(error => console.error('Error changing password:', error));
}

function loadUserSkills() {
    fetch('/api/user/skills')
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

    fetch('/api/user/add-skill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({skill: newSkill})
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
        })
        .catch(error => console.error('Error adding skill:', error));
}

function deleteSkill(skill) {
    fetch('/api/user/delete-skill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({skill: skill})
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
    fetch('/api/user/interests')
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

    fetch('/api/user/add-interest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({interest: newInterest})
    })
        .then(response => response.json())
        .then(interest => {
            const interestsList = document.getElementById('interestsList');
            const li = document.createElement('li');
            li.innerText = interest;
            interestsList.appendChild(li);
        })
        .catch(error => console.error('Error adding interest:', error));
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
                    console.log(response)
                    alert("Failed to delete the account. Please try again.");
                }
            })
            .catch(error => console.error('Error deleting account:', error));
    }
}