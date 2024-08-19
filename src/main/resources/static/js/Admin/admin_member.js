document.addEventListener("DOMContentLoaded", function() {
    fetch("/api/admin/member" ,
    {
        method : "GET",
        headers : {
            'access' : localStorage.getItem("access")
        }
    }).then(response =>  {
        console.log(response)

    }).catch(error =>{
        console.error("errpr")
    })

});


