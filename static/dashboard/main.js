function on_run(){
    document.getElementById("cookie")

    const result = fetch("/api/authorised/user",{
        method:"GET",
        headers:{
            "content-type":"application/json"
        }
    })

    

}

on_run()