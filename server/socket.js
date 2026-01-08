let socketIO = null;

export const setIO = (io) => {
  socketIO = io;
};

export const getIO = () => {
  return socketIO;
};
