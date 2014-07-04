'use strict';
/*global
ps*/

ps(
	'app.Model',
	['scope'],
	function(scope){
		var storage;

		/**
		 * Creates a new Model instance and hooks up the storage.
		 *
		 * @constructor
		 * @param {object} storage A reference to the client side storage class
		 */
		function Model(storageVal) {
			storage = storageVal;
		}

		/**
		 * Creates a new todo model
		 *
		 * @param {string} [title] The title of the task
		 * @param {function} [callback] The callback to fire after the model is created
		 */
		function create(title, callback) {
			title = title || '';
			callback = callback || function () {};

			var newItem = {
				title: title.trim(),
				completed: false
			};

			storage.save(newItem, callback);
		}

		/**
		 * Finds and returns a model in storage. If no query is given it'll simply
		 * return everything. If you pass in a string or number it'll look that up as
		 * the ID of the model to find. Lastly, you can pass it an object to match
		 * against.
		 *
		 * @param {string|number|object} [query] A query to match models against
		 * @param {function} [callback] The callback to fire after the model is found
		 *
		 * @example
		 * model.read(1, func); // Will find the model with an ID of 1
		 * model.read('1'); // Same as above
		 * //Below will find a model with foo equalling bar and hello equalling world.
		 * model.read({ foo: 'bar', hello: 'world' });
		 */
		function read(query, callback) {
			var queryType = typeof query;
			callback = callback || function () {};

			if (queryType === 'function') {
				callback = query;
				return storage.findAll(callback);
			} else if (queryType === 'string' || queryType === 'number') {
				query = parseInt(query, 10);
				storage.find({ id: query }, callback);
			} else {
				storage.find(query, callback);
			}
		}

		/**
		 * Updates a model by giving it an ID, data to update, and a callback to fire when
		 * the update is complete.
		 *
		 * @param {number} id The id of the model to update
		 * @param {object} data The properties to update and their new value
		 * @param {function} callback The callback to fire when the update is complete.
		 */
		function update(id, data, callback) {
			storage.save(data, callback, id);
		}

		/**
		 * Removes a model from storage
		 *
		 * @param {number} id The ID of the model to remove
		 * @param {function} callback The callback to fire when the removal is complete.
		 */
		function remove(id, callback) {
			storage.remove(id, callback);
		}

		/**
		 * WARNING: Will remove ALL data from storage.
		 *
		 * @param {function} callback The callback to fire when the storage is wiped.
		 */
		function removeAll(callback) {
			storage.drop(callback);
		}

		/**
		 * Returns a count of all todos
		 */
		function getCount(callback) {
			var todos = {
				active: 0,
				completed: 0,
				total: 0
			};

			storage.findAll(function (data) {
				data.forEach(function (todo) {
					if (todo.completed) {
						todos.completed++;
					} else {
						todos.active++;
					}

					todos.total++;
				});
				callback(todos);
			});
		}

		scope.public({
			create: create,
			read: read,
			update: update,
			remove: remove,
			removeAll: removeAll,
			getCount: getCount
		});

		return Model;
	}
);