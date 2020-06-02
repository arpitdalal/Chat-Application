const generateMsg = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMsg = (coords) => {
    return {
        link: `https://google.com/maps?q=${coords.lat},${coords.long}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMsg,
    generateLocationMsg
}