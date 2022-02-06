function signup_submit(){
    
    const username = document.getElementById("signup_username").value
    const password = document.getElementById("signup_password").value

    if(password == "" || username == ""){
        show_error("login_error_message","Username & Password fields cannot be left blank")
        return
    }


    // let req_body = JSON.stringify({
    //     signup_username:username,
    //     signup_password:password
    // })




    // const result = fetch("/signup",{
    //     method:"POST",
    //     body:req_body,
    //     headers:{
    //         "content-type":"application/json"
    // }
    // })


    let req_body = {
        signup_username:username,
        signup_password:password
    }


    const result = axios.post("/api/open/signup",req_body)



    result.then((result)=>{
    
        console.log(result)

        if(result.status == 200){
            window.location.replace(result.data.next_url)
        }

    }).catch((err)=>{
        console.log(err)
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