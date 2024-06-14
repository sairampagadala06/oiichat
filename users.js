const users = [];

const addUser = ({ pass, name, room,id}) => {
//   const existingUser = users.find((user) => user.room === room && user.name === name);

//   if(!name || !room) return { error: 'Username and room are required.' };
//   if(existingUser) return { error: 'Username is taken.' };
  const user = { pass, name, room ,id};
  users.push(user)
  console.log(user);
  return  { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (pass) => users.find((user) => user.pass === pass);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);
export { addUser, removeUser, getUser, getUsersInRoom };