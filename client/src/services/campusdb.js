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
  deleteStudent() {
    return CampusDB.post("/students");
  },
  addStudent(name, surname, mail, password) {
    const students = {
      name,
      surname,
      mail,
      password,
    };
    return CampusDB.post("students", students);
  },
  getGroups() {
    return CampusDB.get("/groups");
  },
  getGroup(groupId) {
    return CampusDB.get(`/groups/${groupId}`);
  },
  deleteGroup(groupId) {
    console.log("groupId", groupId)
    return CampusDB.delete(`/groups/${groupId}`);
  },
  addGroup(name) {
    const groups = { name };
    return CampusDB.post("groups", groups);
  },
  updateGroup(id, name) {
    const groups = { id, name };
    console.log("groupId", id)
    console.log("groups", groups)
    return CampusDB.put(`/groups/${id}`, groups);
  }
};

