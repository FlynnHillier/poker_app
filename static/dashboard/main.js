function on_page_load(){
    
    check_auth()
    .then((resolution)=>{
        console.log("hi")
        axios.get("/api/authorised/user").then((response)=>{

                document.getElementById("username").innerText = response.data.userID

            })
            .catch((err)=>{
                console.log("error")
            })
    })
    .catch((rejection)=>{
        return window.location.replace(rejection.follow)
    })

}


function check_auth(){
    return new Promise((resolve,reject)=>{
    
        axios.get("/api/authorised/").then((response)=>{
            console.log(response)
            if(response.data.result === false){
                reject({follow:response.data.next_url})
            } else{
                resolve()
            }
        })
    })
}

on_page_load()