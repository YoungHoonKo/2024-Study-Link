document.addEventListener("DOMContentLoaded", function() {
    fetch("/api/admin/admin", {  // URL 수정
        method: "GET",
        headers: {
            'access': localStorage.getItem("access")
        }
    })
        .then(response => response.json())  // 비동기 JSON 변환
        .then(data => {
            console.log(data);
            // 데이터를 반복하면서 테이블에 추가
            data.forEach(board => {
                populateTable(board);
            });
        })
        .catch(error => {
            console.error("error", error);
        });
});

// 테이블에 데이터를 추가하는 함수
function populateTable(admin) {
    const tableBody = document.querySelector('#boardTable tbody');

    // 행 추가
    const row = document.createElement('tr');

    // 각 데이터를 테이블에 추가
    row.innerHTML = `
        <td>${admin.id ? board.id : 'N/A'}</td>
        <td>${admin.username ? admin.username : 'N/A'}</td>
        <td>${admin.password ? admin.password  : 'N/A'}</td>
        <td>${admin.role ? admin.role : 'N/A'}</td>
    `;

    // 테이블에 행 추가
    tableBody.appendChild(row);
}


// // 모달 열기 함수
// function showAddAdminModal() {
//     document.getElementById('addAdminModal').style.display = 'block';
// }
//
// // 모달 닫기 함수
// function closeAddAdminModal() {
//     document.getElementById('addAdminModal').style.display = 'none';
// }
//
// // 관리자 수정 함수 (예시)
// function editAdmin(adminName) {
//     alert('관리자 ' + adminName + '의 정보를 수정합니다.');
// }
//
// // 관리자 삭제 함수 (예시)
// function deleteAdmin(adminName) {
//     if (confirm('관리자 ' + adminName + '을(를) 삭제하시겠습니까?')) {
//         alert('관리자 ' + adminName + '을(를) 삭제했습니다.');
//     }
// }
//
// // 모달 외부 클릭 시 닫기
// window.onclick = function(event) {
//     if (event.target === document.getElementById('addAdminModal')) {
//         closeAddAdminModal();
//     }
// }