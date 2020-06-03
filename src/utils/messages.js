const generateMsg = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMsg = (username, coords) => {
    return {
        username,
        link: `https://google.com/maps?q=${coords.lat},${coords.long}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMsg,
    generateLocationMsg
}