document.addEventListener('DOMContentLoaded', function (){
    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find(c => c.startsWith(`${name}=`));
        return cookie ? cookie.split('=')[1] : null;
    }

    const refreshToken = getCookie("refreshToken");
    const accessToken = localStorage.getItem("access");

    function validateToken(){
        fetch("/api/auth/validate-token", {
            method:"POST",
            headers:{
                'access':accessToken
            }
        })
            .then(response => {
                if (response.ok){

                }else{
                    localStorage.removeItem("access")
                    window.location.href="/login"
                }
            })
            .catch(error => {
                localStorage.removeItem("access")
                window.location.href="/login"
            })
    }

    if(accessToken){

    }else{
        window.location.href="/login"
    }
})

function changePassword() {
    const passwordData = {
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('newPassword').value,
        confirmPassword: document.getElementById('confirmNewPassword').value
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