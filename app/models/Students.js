const Students = (user) => {
    user.id = Number;
    user.name = String;
    user.surname = String;
    // user.password = String;
    user.mail = String;
    user.photo = String;
    user.rfid = String;
    // user.creationDate = Number;
}

module.exports = { Students }