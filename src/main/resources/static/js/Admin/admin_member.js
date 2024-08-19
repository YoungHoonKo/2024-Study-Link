document.addEventListener("DOMContentLoaded", function() {
    fetch("/api/admin/member" ,
    {
        method : "GET",
        headers : {
            'access' : localStorage.getItem("access")
        }
    }).then(response =>  {
        console.log(response.json())

    }).catch(error =>{
        console.error("errpr")
    })

});


