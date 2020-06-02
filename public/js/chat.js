const socket = io()

// DOM Elements
const $form = document.querySelector('#chatForm')
const $txtInput = $form.querySelector('input')
const $submitBtn = $form.querySelector('button')
const $locationBtn = document.querySelector('#sendLocation')
const $msg = document.querySelector('#messages')

// Templates
const msgTemplate = document.querySelector('#message-template').innerHTML
const urlTemplate = document.querySelector('#url-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('msg', (msg) => {
    if (msg.user.username === username.trim().toLowerCase()){
        const html = Mustache.render(msgTemplate, {
            username: 'Me',
            msg: msg.text,
            createdAt: moment(msg.createdAt).format('h:mm a')
        })
        $msg.insertAdjacentHTML('beforeend', html)
    } else {
        const html = Mustache.render(msgTemplate, {
            username: msg.user.username,
            msg: msg.text,
            createdAt: moment(msg.createdAt).format('h:mm a')
        })
        $msg.insertAdjacentHTML('beforeend', html)
    }
})

socket.on('locationMsg', (url) => {
    if (url.user.username === username.trim().toLowerCase()){
        const html = Mustache.render(urlTemplate, {
            username: 'Me',
            url: url.link,
            createdAt: moment(url.createdAt).format('h:mm a')
        })
        $msg.insertAdjacentHTML('beforeend', html)
    } else{
        const html = Mustache.render(urlTemplate, {
            username: url.user.username,
            url: url.link,
            createdAt: moment(url.createdAt).format('h:mm a')
        })
        $msg.insertAdjacentHTML('beforeend', html)
    }
})

$form.addEventListener('submit', (e) => {
    e.preventDefault()

    // disable the submit button
    $submitBtn.setAttribute('disabled', 'disabled')

    const userMsg = e.target.elements.userMsg.value
    socket.emit('sendMsg', 
        userMsg, 
        (error) => {
            
            // enable the submit button and clear and focus the textbox
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

    // disable location button and focus the textbox
    $locationBtn.setAttribute('disabled', 'disabled')
    $txtInput.focus()

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation', {
                lat: position.coords.latitude,
                long: position.coords.longitude
            },
            () => {
                console.log('Location shared!')
                // enable location button
                $locationBtn.removeAttribute('disabled')
            })
    })
})

socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
