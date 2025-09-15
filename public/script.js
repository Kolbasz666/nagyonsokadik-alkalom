function kolbasz(){
    document.body.style.backgroundColor = "lime"
    fetch('/user',{
        method:"POST",
        body: JSON.stringify({
            username:'szalonna'
        }),
        headers:{
            'Content-Type':'Application/JSON'
        }
    })
}