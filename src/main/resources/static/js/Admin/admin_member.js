document.addEventListener("DOMContentLoaded", function() {
    fetch("/api/admin/member" ,
    {
        method : "GET",
        headers : {
            'access' : localStorage.getItem("access")
        }
    }).then(response =>  {
        const data = response.json();
        console.log(data)
        for(i = 0; i < data.length; i++){
            populateTable(data[i]);
        }
        // JSON 데이터를 자바스크립트 객체로 변환


    }).catch(error =>{
        console.error("error", error)
    })
});


// 테이블에 데이터를 추가하는 함수
function populateTable(data) {
    const tableBody = document.querySelector('#userTable');

    // 데이터가 없는 경우 early return
    if (!data || !data.user) {
        console.error('No user data available');
        return;
    }

    const user = data.user;

    // 행 추가
    const row = document.createElement('tr');

    // 각 데이터를 테이블에 추가
    row.innerHTML = `
        <td>${user.username ? user.username : 'N/A'}</td>
        <td>${user.password ? user.password : 'N/A'}</td>
        <td>${user.role ? user.role : 'N/A'}</td>
        <td>${user.status ? user.status : 'N/A'}</td>
    `;

    // 테이블에 행 추가
    tableBody.appendChild(row);
}