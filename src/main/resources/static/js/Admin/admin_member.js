document.addEventListener("DOMContentLoaded", function() {
    fetch("/api/admin/member", {
        method: "GET",
        headers: {
            'access': localStorage.getItem("access")
        }
    })
        .then(response => response.json())  // 비동기 JSON 변환
        .then(data => {
            console.log(data);
            // 데이터를 반복하면서 테이블에 추가
            data.forEach(user => {
                populateTable(user);
            });
        })
        .catch(error => {
            console.error("error", error);
        });
});

// 테이블에 데이터를 추가하는 함수
function populateTable(user) {
    const tableBody = document.querySelector('#userTable tbody');

    // 행 추가
    const row = document.createElement('tr');

    // 각 데이터를 테이블에 추가
    row.innerHTML = `
        <td>${user.email ? user.email : 'N/A'}</td>
        <td>${user.username ? user.username : 'N/A'}</td>
        <td>${user.role ? user.role : 'N/A'}</td>
        <td>${user.status ? user.status : 'N/A'}</td>
    `;

    // 테이블에 행 추가
    tableBody.appendChild(row);
}