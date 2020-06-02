const generateMsg = (user, text) => {
    return {
        user,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMsg = (user, coords) => {
    return {
        user,
        link: `https://google.com/maps?q=${coords.lat},${coords.long}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMsg,
    generateLocationMsg
}