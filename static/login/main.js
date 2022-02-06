function login_submit(){
    
    const username = document.getElementById("login_username").value
    const password = document.getElementById("login_password").value

    if(password == "" || username == ""){
        show_error("login_error_message","Username & Password fields cannot be left blank")
        return
    }


    let req_body = JSON.stringify({
        username:username,
        password:password
    })

    fetch("/api/open/login",{
        method:"POST",
        body:req_body,
        headers:{
            "content-type":"application/json"
    }
    })




}


function show_error(error_id,error_message_text){
    let error_message = document.getElementById(error_id)
    error_message.innerText = error_message_text

    error_message.hidden = false
}

function hide_error(error_id){
    document.getElementById(error_id).hidden = true
}