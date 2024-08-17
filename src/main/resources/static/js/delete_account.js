document.addEventListener("DOMContentLoaded", function (){
    const accessToken = localStorage.getItem("access")

    function validateToken() {
        fetch("/api/auth/validate-token", {
            method: "POST",
            headers:{
                'access': accessToken
            }
        })
            .then(response => {
                if(response.ok){

                }else{

                }
            })
            .catch(error => {
                localStorage.removeItem("access")
                window.location.href = "/login"
            })
    }
})

function deleteAccount(event) {
    event.preventDefault()
    const confirmation = confirm("정말 회원탈퇴를 하시겠습니까?");
    if (confirmation) {
        fetch('/api/user/delete-user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'access': localStorage.getItem("access")
            },
            body:JSON.stringify({password: document.getElementById("password").value})
        })
            .then(response => {
                console.log(response)
                if (response.ok) {
                    alert("회원탈퇴 완료");
                    localStorage.removeItem("access");
                    window.location.href = "/";
                } else if(response.status == 401) {
                    alert("비밀번호가 틀렸습니다.");
                }else{
                    alert("에러 발생")
                }
            })
            .catch(error => console.error('Error deleting account:', error));
    }
}