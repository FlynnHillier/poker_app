function login_submit(){
    
    const username = document.getElementById("login_username").value
    const password = document.getElementById("login_password").value

    if(password == "" || username == ""){
        show_error("login_error_message","Username & Password fields cannot be left blank")
        return
    }


    let req_body ={
        username:username,
        password:password
    }

    axios.post("/api/open/login",req_body)
    .then((response)=>{
        if(response.data.result === true){
            window.location.replace(response.data.next_url)
        }  else{
            document.getElementById("login_error_message").innerText = response.data.message
        }
    })
    .catch((err)=>{
        throw err
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