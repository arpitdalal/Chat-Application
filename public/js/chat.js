const socket = io()

// DOM Elements
const $form = document.querySelector('#chatForm')
const $txtInput = $form.querySelector('input')
const $submitBtn = $form.querySelector('button')
const $locationBtn = document.querySelector('#sendLocation')
const $msg = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// Templates
const msgTemplate = document.querySelector('#message-template').innerHTML
const adminMsgTemplate = document.querySelector('#messageAdmin-template').innerHTML
const urlTemplate = document.querySelector('#url-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('msg', (msg) => {
    if (msg.username === username.trim().toLowerCase()){
        const html = Mustache.render(msgTemplate, {
            username: 'Me',
            msg: msg.text,
            createdAt: moment(msg.createdAt).format('h:mm a'),
            className: 'me'
        })
        $msg.insertAdjacentHTML('beforeend', html)
    } else if (msg.username === 'Admin'){
        const html = Mustache.render(adminMsgTemplate, {
            msg: msg.text,
            className: 'Admin'
        })
        $msg.insertAdjacentHTML('beforeend', html)
    } else {
        const html = Mustache.render(msgTemplate, {
            username: msg.username,
            msg: msg.text,
            createdAt: moment(msg.createdAt).format('h:mm a'),
            className: msg.username
        })
        $msg.insertAdjacentHTML('beforeend', html)
    }
})

socket.on('locationMsg', (url) => {
    if (url.username === username.trim().toLowerCase()){
        const html = Mustache.render(urlTemplate, {
            username: 'Me',
            url: url.link,
            createdAt: moment(url.createdAt).format('h:mm a'),
            className: 'me'
        })
        $msg.insertAdjacentHTML('beforeend', html)
    } else{
        const html = Mustache.render(urlTemplate, {
            username: url.username,
            url: url.link,
            createdAt: moment(url.createdAt).format('h:mm a'),
            className: url.username
        })
        $msg.insertAdjacentHTML('beforeend', html)
    }
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
})

socket.on('disconnect', function () {
    window.location = "/"
});

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
        socket.emit('sendLocation', {
                lat: position.coords.latitude,
                long: position.coords.longitude
            },
            () => {
                // enable location button
                $locationBtn.removeAttribute('disabled')
            })
    })
})

document.querySelector('#leaveBtn').addEventListener('click', () => {
    socket.disconnect()
})
