/**
 * File Name: AddRoom.js
 * Description: Validator used to validate input fields in Add Room Page (Admin)
 * Instructions: Use this validator by adding ".validator('AddRoom')" to your route in /routes.js
 **/
'use strict';

class AddFeature {
	// Validate and return all fields
	get validateAll () {
		return true;
	}

	// Validation rules
	get rules () {
		return {
			featureNameEnglish: 'required|max:30',
			featureNameFrench: 'required|max:30',
			featureCategory: 'required|integer'
		};
	}

	// Custom error messages
	get messages () {
		return {
			'required': 'You must provide a feature name',
			'featureName.max': 'feature name can only be 30 characters long'
		};
	}

	async fails (error) {
		this.ctx.session.withErrors(error).flashAll();
		this.ctx.session.flash({ error: 'Please provide both English and French names (max: 20 Char)' });
		return this.ctx.response.redirect('back');
	}
}

module.exports = AddFeature;
