const Filter = require('bad-words');
const users = [];

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are required'
    };
  }

  // Check if username or room name are profane
  const filter = new Filter();

  if (filter.isProfane(username) || filter.isProfane(room)) {
    return {
      error: 'Profane names are not allowed!'
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => user.room === room && user.username === username);

  // Validate username
  if (existingUser) {
    return {
      error: 'Please choose a different username!'
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id); // returns user if found or returns undefined

const getUsersInRoom = (room) => users.filter((user) => user.room === room); // returns array of users if found or returns empty array

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
