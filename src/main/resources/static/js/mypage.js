document.addEventListener('DOMContentLoaded', function () {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");

    document.getElementById('profileForm').addEventListener('submit', function(event) {
        event.preventDefault(); // 폼 제출 방지

        updateProfile(); // 프로필 업데이트 함수 호출
    });

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
        window.location.href = "/login";
    }

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
                return response.text().then(text => {
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
                document.getElementById("welcome").innerText = data.username + "님 환영합니다."
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
        // 기본 프로필 데이터를 수집합니다.
        const profileData = {
            username: document.getElementById('nickname').value,
            email: document.getElementById('job').value,
            bio: document.getElementById('bio').value,
            organization: document.getElementById('affiliation').value,
            position: document.getElementById("job").value,
            skills: [],  // 스킬 데이터를 추가하기 위한 배열
            interest: document.getElementById("interests").value
        };

        // 모든 스킬과 해당 레벨을 수집합니다.
        const skillGroups = document.querySelectorAll('.skill-group');
        skillGroups.forEach(group => {
            const skill = group.querySelector('select[name="skills[]"]').value;
            const level = group.querySelector('select[name="skill-levels[]"]').value;
            profileData.skills.push({ skill, level });
        });

        // 서버로 프로필 데이터를 전송합니다.
        fetch('/api/user/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'access': localStorage.getItem("access")
            },
            body: JSON.stringify(profileData)
        })
            .then(response => {
                if (response.ok){
                    window.location.href='/profile';
                }else{
                    alert("faild!")
                }
            })
            .catch(error => console.error('Error updating profile:', error));
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
                return response.json();
            })
            .then(skills => {
                const skillContainer = document.getElementById('skill-container');
                skillContainer.innerHTML = '';

                skills.forEach(skill => {
                    const skillGroup = document.createElement('div');
                    skillGroup.className = 'skill-group';

                    const skillSelect = document.createElement('select');
                    skillSelect.name = 'skills[]';
                    const option = document.createElement('option');
                    option.value = skill.skill;
                    option.textContent = skill.skill;
                    skillSelect.appendChild(option);
                    skillSelect.disabled = true;

                    const levelSelect = document.createElement('select');
                    levelSelect.name = 'skill-levels[]';
                    levelSelect.innerHTML = `
                    <option value="beginner" ${skill.level === 'beginner' ? 'selected' : ''}>초급</option>
                    <option value="intermediate" ${skill.level === 'intermediate' ? 'selected' : ''}>중급</option>
                    <option value="advanced" ${skill.level === 'advanced' ? 'selected' : ''}>고급</option>
                `;
                    levelSelect.disabled = true;

                    const deleteButton = document.createElement('button');
                    deleteButton.type = 'button';
                    deleteButton.textContent = '삭제';
                    deleteButton.className = 'delete-skill-button';
                    deleteButton.addEventListener('click', function () {
                        console.log(skill)
                        deleteSkill(skill);
                    });

                    skillGroup.appendChild(skillSelect);
                    skillGroup.appendChild(levelSelect);
                    skillGroup.appendChild(deleteButton);

                    skillContainer.appendChild(skillGroup);
                });
            })
            .catch(error => console.error('Error loading skills:', error));
    }


    function deleteSkill(skill) {
        fetch('/api/user/delete-skill', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'access': localStorage.getItem("access")
            },
            body: JSON.stringify({ skill: skill.skill,
                level: skill.level
            })
        })
            .then(response => {
                if (response.ok) {
                    loadUserSkills();
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
                document.getElementById("interests").value = interests.interest
            })
            .catch(error => console.error('Error loading interests:', error));
    }

// 스킬 로드 및 추가 기능 로드
    const availableSkills = {"Spring Boot": "Spring Boot",
        "Java": "Java",
        "Python": "Python",
        "C": "C",
        "C#": "C#",
        "C++": "C++",
        "MySQL": "MySQL",
        "R": "R",
        "HTML": "HTML",
        "CSS": "CSS",
        "JavaScript": "JavaScript",
        "PHP": "PHP",
        "Visual Basic": "Visual Basic",
        "Objective-C": "Objective-C",
        "Swift": "Swift",
        "Ruby": "Ruby",
        "Go": "Go",
        "Perl": "Perl",
        "Kotlin": "Kotlin",
        "Scala": "Scala",
        "Rust": "Rust",
        "Dart": "Dart",
        "TypeScript": "TypeScript",
        "SQL": "SQL",
        "NoSQL": "NoSQL",
        "MATLAB": "MATLAB",
        "Shell Script": "Shell Script",
        "Groovy": "Groovy",
        "Lua": "Lua",
        "Haskell": "Haskell",
        "Elixir": "Elixir",
        "Erlang": "Erlang",
        "F#": "F#",
        "VHDL": "VHDL",
        "Verilog": "Verilog",
        "Assembly": "Assembly",
        "COBOL": "COBOL",
        "Fortran": "Fortran",
        "Ada": "Ada",
        "Lisp": "Lisp",
        "Prolog": "Prolog",
        "Scheme": "Scheme",
        "Tcl": "Tcl",
        "VBScript": "VBScript",
        "SAS": "SAS",
        "ABAP": "ABAP",
        "Pascal": "Pascal",
        "Delphi": "Delphi",
        "XQuery": "XQuery",
        "XPath": "XPath"
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

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = '삭제';
        deleteButton.className = 'delete-skill-button';

        deleteButton.addEventListener('click', function () {
            skillContainer.removeChild(skillGroup);
        });

        skillGroup.appendChild(skillSelect);
        skillGroup.appendChild(levelSelect);
        skillGroup.appendChild(deleteButton);

        skillContainer.appendChild(skillGroup);
    }

    loadUserSkills();
});
