const socket = io()

//Elements
const $form = document.querySelector('#chatForm')
const $txtInput = $form.querySelector('input')
const $submitBtn = $form.querySelector('button')
const $locationBtn = document.querySelector('#sendLocation')

socket.on('msg', (msg) => {
    console.log(msg)
})

$form.addEventListener('submit', (e) => {
    e.preventDefault()

    // disable the submit button
    $submitBtn.setAttribute('disabled', 'disabled')

    const userMsg = e.target.elements.userMsg.value
    socket.emit('sendMsg', 
        userMsg, 
        (error) => {
            
            // enable the submit button
            $submitBtn.removeAttribute('disabled')
            $txtInput.value = ''
            $txtInput.focus()

            if(error){
                return alert(error)
            }
            console.log('Message delivered!')
        })
})

$locationBtn.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Your browser do not support geolocation!')
    }

    // disable location button
    $locationBtn.setAttribute('disabled', 'disabled')
    $txtInput.focus()

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', 
            `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`, 
            () => {
                console.log('Location shared!')
                // enable location button
                $locationBtn.removeAttribute('disabled')
            })
    })
})