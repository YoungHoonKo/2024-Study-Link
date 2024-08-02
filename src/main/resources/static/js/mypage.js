document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('access');

    async function validateToken(token) {
        try {
            const response = await fetch('/api/auth/validate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access':token
                },
                body: JSON.stringify(token)  // JSON 형식으로 토큰을 전송합니다.
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Token validation failed:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    async function checkTokenAndRedirect() {
        const isValid = await validateToken(token);
        console.log(isValid);
        if (isValid) {
            console.log("Token is valid");
        } else {
            console.log("Token is invalid. Redirecting...");
            window.location.href = "/";
        }
    }

    checkTokenAndRedirect();
});