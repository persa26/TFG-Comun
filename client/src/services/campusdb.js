import axios from "axios";
import Cookies from "js-cookie";

const CampusDB = axios.create({
  baseURL: "http://localhost:3080/api/v1",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `${Cookies.get("userToken")}`,
  },
});


export default {
  setUserLogged(token, userId) {
    Cookies.set("userToken", token);
    Cookies.set("userLogged", userId);
  },
  getUserLogged() {
    // Get user logged from store
    return Cookies.get("userLogged");
  },
  getUserToken() {
    return Cookies.get("userToken");
  },
  logout() {
    Cookies.remove("userToken");
    Cookies.remove("userLogged");
  },
  login(mail, password) {
    const user = {
      mail,
      password,
    };
    return CampusDB.post("/login", user);
  },
  getUsers() {
    return CampusDB.get("/users");
  },
  getUser(userId) {
    return CampusDB.get(`/users/${userId}`);
  },
  deleteUser() {
    return CampusDB.post("/users");
  },
  register(name, surname, mail, password) {
    const users = {
      name,
      surname,
      mail,
      password,
    };
    return CampusDB.post("users", users);
  },
  getStudents() {
    return CampusDB.get("/students");
  },
  getStudent(userId) {
    return CampusDB.get(`/students/${userId}`);
  },
  deleteStudent(studentId) {
    return CampusDB.delete(`/students/${studentId}`);
  },
  addStudent(newStudent) {
    // const students = { newStudent };


    console.log(newStudent);
    return CampusDB.post("/students", newStudent);
  },
  updateStudent(id, name, surname, mail, rfid) {
    const student = { id, name, surname, mail, rfid };
    return CampusDB.put(`/students`, student);

  },
  getGroups() {
    return CampusDB.get("/groups");
  },
  getGroup(groupId) {
    return CampusDB.get(`/groups/${groupId}`);
  },
  deleteGroup(groupId) {
    return CampusDB.delete(`/groups/${groupId}`);
  },
  addGroup(name) {
    const groups = { name };
    return CampusDB.post("groups", groups);
  },
  updateGroup(id, name) {
    const groups = { id, name };
    return CampusDB.put(`/groups/${id}`, groups);
  },
  ///////
  getLocations() {
    return CampusDB.get("/locations");
  },
  getLocation(locationId) {
    return CampusDB.get(`/locations/${locationId}`);
  },
  deleteLocation(locationId) {
    return CampusDB.delete(`/locations/${locationId}`);
  },
  addLocation(newLocation) {
    // const locations = { locationName, facialRecognitionRequired, rfidRequired };
    return CampusDB.post("locations", newLocation);
  },
  updateLocation(location) {
    // const locations = { id, locationName, facialRecognitionRequired, rfidRequired };
    console.log(location)
    return CampusDB.put(`/locations/${location.id}`, location);
  },
  getGroupLocations() {
    return CampusDB.get("/groupLocations");
  },
  getGroupLocation(groupLocationId) {
    return CampusDB.get(`/groupLocations/${groupLocationId}`);
  },
  deleteGroupLocation(groupLocationId) {
    return CampusDB.delete(`/groupLocations/${groupLocationId}`);
  },
  addGroupLocation(groupLocation) {
    // const groupLocations = { groupId, locationId, entryTime, exitTime };
    return CampusDB.post("groupLocations", groupLocation);
  },
  updateGroupLocation(groupLocations) {
    // const groupLocations = { id, groupId, locationId, entryTime, exitTime };
    delete groupLocations.editable;
    return CampusDB.put(`/groupLocations/${groupLocations.id}`, groupLocations);
  },
  ///////
  syncData(type) {
    switch (type) {
      case "syncgroupsdatafacerecognition":
        return CampusDB.get("/syncgroupsdatafacerecognition");
      case "syncimagesdatafacerecognition":
        return CampusDB.get("/syncimagesdatafacerecognition");
      case "syncstudentsdatafacerecognition":
        return CampusDB.get("/syncstudentsdatafacerecognition");
      default:
    }
  }
};

