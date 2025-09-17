async function kolbasz(){
    document.body.style.backgroundColor = "lime"
    const response = await fetch('/users')
    const result = await response.json()
    console.log(result)
}