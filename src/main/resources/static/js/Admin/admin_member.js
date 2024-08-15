document.addEventListener("DOMContentLoaded", function() {
    console.log("Admin JS Loaded");
});

//save 버튼눌렀을때 function
function saveChanges(userId) {
    // 사용자 ID를 기반으로 상태와 역할 값을 가져옴
    const status = document.getElementById('status_' + userId).value;
    const role = document.getElementById('role_' + userId).value;

    // 변경된 데이터를 서버로 전송 (예를 들어, AJAX를 사용하여 비동기적으로 전송)
    fetch('/admin/saveUserChanges', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: userId,
            status: status,
            role: role
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error saving changes');
            }
            return response.json();
        })
        .then(data => {
            alert('Changes saved successfully');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save changes');
        });
}