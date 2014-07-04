'use strict';
/*global
ps*/
ps(
	'app.AppFacade',
	[
		'app.Store',
		'app.Model',
		'app.Template',
		'app.View',
		'app.Controller'
	],
	function (
		Store,
		Model,
		Template,
		View,
		Controller
	) {

		/**
		 * Sets up a brand new Todo list.
		 *
		 * @param {string} name The name of your new to do list.
		 */
		function AppFacade(name) {
			this.storage = new Store(name);
			this.model = new Model(this.storage);
			this.template = new Template();
			this.view = new View(this.template);
			this.controller = new Controller(this.model, this.view);
		}

		return AppFacade;
	}
);