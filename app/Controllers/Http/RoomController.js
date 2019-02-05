'use strict'
const Room = use('App/Models/Room');

class RoomController {
  async addRoom({ request }) {
    try{
      const body = request.post();
      const room = new Room()
      room.name = body.name
      room.num = body.num

      await room.save()
    } catch(err) {
      console.log(err)
    }
  }
}

module.exports = RoomController
