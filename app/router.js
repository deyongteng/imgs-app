'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller } = app;
	// GET
	router.get('/', controller.home.index);

	// POST
	router.post('/files/upload',controller.upload.index);
};
