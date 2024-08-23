document.addEventListener('DOMContentLoaded', function () {
    console.log('Profile Page Loaded');
    function loadUserProfile() {
        fetch('/api/user/profile', {
            method: "GET",
            headers: {
                "access": localStorage.getItem("access"),
                "Content-Type": "application/json"
            }
        }
        ).then(response => {
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
            .then(data=>{
                document.getElementById("name").innerText = data.username;
                document.getElementById("position").innerText = data.position;
                document.getElementById("organization").innerText = data.organization;
                document.getElementById("bio").innerText = data.bio;

            }).catch(error => {
                console.error("에러");
        })
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
                const a = [];
                for (i=0;i<skills.length;i++){
                    a.push(skills[i].skill);
                }
                document.getElementById('skills').innerText = a;
            })
            .catch(error => console.error('Error loading skills:', error));
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
                document.getElementById("interests").innerText = interests.interest
            })
            .catch(error => console.error('Error loading interests:', error));
    }
    loadUserSkills();
    loadUserProfile();
    loadUserInterests();
});

