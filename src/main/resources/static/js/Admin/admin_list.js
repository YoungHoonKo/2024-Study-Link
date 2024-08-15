// 모달 열기 함수
function showAddAdminModal() {
    document.getElementById('addAdminModal').style.display = 'block';
}

// 모달 닫기 함수
function closeAddAdminModal() {
    document.getElementById('addAdminModal').style.display = 'none';
}

// 관리자 수정 함수 (예시)
function editAdmin(adminName) {
    alert('관리자 ' + adminName + '의 정보를 수정합니다.');
}

// 관리자 삭제 함수 (예시)
function deleteAdmin(adminName) {
    if (confirm('관리자 ' + adminName + '을(를) 삭제하시겠습니까?')) {
        alert('관리자 ' + adminName + '을(를) 삭제했습니다.');
    }
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    if (event.target === document.getElementById('addAdminModal')) {
        closeAddAdminModal();
    }
}