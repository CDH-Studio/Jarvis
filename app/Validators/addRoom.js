'use strict'

class addRoom {
  get rules() {
    return {
      // validation rules
      roomName: 'required|unique:rooms',
      location: 'required',
      telephoneNumber: 'required',
      tableSeats: 'required|integer',
      maximumCapacity: 'required|integer'
    }
  }

  //Error messages
  get messages() {
    return {
      'roomName.required': 'Woah now, {{ field }} is required.',
      'roomName.unique': 'Wait a second, the {{ field }} already exists',
      'location.required': 'Woah now, {{ field }} is required.',
      'telephoneNumber.required': 'Woah now, {{ field }} is required.',
      'tableSeats.required': 'Woah now, {{ field }} is required.',
      'maximumCapacity.required': 'Woah now, {{ field }} is required.'
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error)
      .flashAll();

    return this.ctx.response.redirect('back');
  }
}

module.exports = addRoom
