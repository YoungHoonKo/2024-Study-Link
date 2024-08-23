document.addEventListener("DOMContentLoaded", function() {
    fetch("/api/admin/board", {  // URL 수정
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
function populateTable(board) {
    const tableBody = document.querySelector('#boardTable tbody');

    // 행 추가
    const row = document.createElement('tr');

    // 각 데이터를 테이블에 추가
    row.innerHTML = `
        <td>${board.id ? board.id : 'N/A'}</td>
        <td>${board.boardWriter ? board.boardWriter : 'N/A'}</td>
        <td>${board.boardTitle ? board.boardTitle : 'N/A'}</td>
        <td>${board.boardPass ? board.boardPass : 'N/A'}</td>
    `;

    // 테이블에 행 추가
    tableBody.appendChild(row);
}
