'use strict';
/*global
ps*/

ps(
	'app.Controller',
	['scope'],
	function(scope){
		var
		model,
		view,
		activeRoute,
		lastActiveRoute;
		/**
		 * Takes a model and view and acts as the controller between them
		 *
		 * @constructor
		 * @param {object} model The model instance
		 * @param {object} view The view instance
		 */
		function Controller(modelVal, viewVal) {
			model = modelVal;
			view = viewVal;

			view.bind('newTodo', function (title) {
				addItem(title);
			});

			view.bind('itemEdit', function (item) {
				editItem(item.id);
			});

			view.bind('itemEditDone', function (item) {
				editItemSave(item.id, item.title);
			});

			view.bind('itemEditCancel', function (item) {
				editItemCancel(item.id);
			});

			view.bind('itemRemove', function (item) {
				removeItem(item.id);
			});

			view.bind('itemToggle', function (item) {
				toggleComplete(item.id, item.completed);
			});

			view.bind('removeCompleted', function () {
				removeCompletedItems();
			});

			view.bind('toggleAll', function (status) {
				toggleAll(status.completed);
			});
		}

		/**
		 * Loads and initialises the view
		 *
		 * @param {string} '' | 'active' | 'completed'
		 */
		function setView(locationHash) {
			var route = locationHash.split('/')[1];
			var page = route || '';
			updateFilterState(page);
		}

		/**
		 * An event to fire on load. Will get all items and display them in the
		 * todo-list
		 */
		function showAll() {
			model.read(function (data) {
				view.render('showEntries', data);
			});
		}

		/**
		 * Renders all active tasks
		 */
		function showActive() {
			model.read({ completed: false }, function (data) {
				view.render('showEntries', data);
			});
		}

		/**
		 * Renders all completed tasks
		 */
		function showCompleted() {
			model.read({ completed: true }, function (data) {
				view.render('showEntries', data);
			});
		}

		/**
		 * An event to fire whenever you want to add an item. Simply pass in the event
		 * object and it'll handle the DOM insertion and saving of the new item.
		 */
		function addItem(title) {
			
			if (title.trim() === '') {
				return;
			}

			model.create(title, function () {
				view.render('clearNewTodo');
				filter(true);
			});
		}

		/*
		 * Triggers the item editing mode.
		 */
		function editItem(id) {
			model.read(id, function (data) {
				view.render('editItem', {id: id, title: data[0].title});
			});
		}

		/*
		 * Finishes the item editing mode successfully.
		 */
		function editItemSave(id, title) {
			if (title.trim()) {
				model.update(id, {title: title}, function () {
					view.render('editItemDone', {id: id, title: title});
				});
			} else {
				removeItem(id);
			}
		}

		/*
		 * Cancels the item editing mode.
		 */
		function editItemCancel(id) {
			model.read(id, function (data) {
				view.render('editItemDone', {id: id, title: data[0].title});
			});
		}

		/**
		 * By giving it an ID it'll find the DOM element matching that ID,
		 * remove it from the DOM and also remove it from storage.
		 *
		 * @param {number} id The ID of the item to remove from the DOM and
		 * storage
		 */
		function removeItem(id) {
			model.remove(id, function () {
				view.render('removeItem', id);
			});

			filter();
		}

		/**
		 * Will remove all completed items from the DOM and storage.
		 */
		function removeCompletedItems() {
			model.read({ completed: true }, function (data) {
				data.forEach(function (item) {
					removeItem(item.id);
				});
			});

			filter();
		}

		/**
		 * Give it an ID of a model and a checkbox and it will update the item
		 * in storage based on the checkbox's state.
		 *
		 * @param {number} id The ID of the element to complete or uncomplete
		 * @param {object} checkbox The checkbox to check the state of complete
		 *                          or not
		 * @param {boolean|undefined} silent Prevent re-filtering the todo items
		 */
		function toggleComplete(id, completed, silent) {
			model.update(id, { completed: completed }, function () {
				view.render('elementComplete', {
					id: id,
					completed: completed
				});
			});

			if (!silent) {
				filter();
			}
		}

		/**
		 * Will toggle ALL checkboxe's on/off state and completeness of models.
		 * Just pass in the event object.
		 */
		function toggleAll(completed) {
			model.read({ completed: !completed }, function (data) {
				data.forEach(function (item) {
					toggleComplete(item.id, completed, true);
				});
			});

			filter();
		}

		/**
		 * Updates the pieces of the page which change depending on the remaining
		 * number of todos.
		 */
		function updateCount() {
			model.getCount(function (todos) {
				view.render('updateElementCount', todos.active);
				view.render('clearCompletedButton', {
					completed: todos.completed,
					visible: todos.completed > 0
				});

				view.render('toggleAll', {checked: todos.completed === todos.total});
				view.render('contentBlockVisibility', {visible: todos.total > 0});
			});
		}

		/**
		 * Re-filters the todo items, based on the active route.
		 * @param {boolean|undefined} force  forces a re-painting of todo items.
		 */
		function filter(force) {
			activeRoute = activeRoute.charAt(0).toUpperCase() + activeRoute.substr(1);

			// Update the elements on the page, which change with each completed todo
			updateCount();

			// If the last active route isn't "All", or we're switching routes, we
			// re-create the todo item elements, calling:
			//   this.show[All|Active|Completed]();
			if (force || lastActiveRoute !== 'All' || lastActiveRoute !== activeRoute) {
				scope.this['show' + activeRoute]();
			}

			lastActiveRoute = activeRoute;
		}

		/**
		 * Simply updates the filter nav's selected states
		 */
		function updateFilterState(currentPage) {
			// Store a reference to the active route, allowing us to re-filter todo
			// items as they are marked complete or incomplete.
			activeRoute = currentPage;

			if (currentPage === '') {
				activeRoute = 'All';
			}

			filter();

			view.render('setFilter', currentPage);
		}

		scope.public({
			setView: setView,
			showAll: showAll,
			showActive: showActive,
			showCompleted: showCompleted,
			addItem: addItem,
			editItem: editItem,
			editItemSave: editItemSave,
			editItemCancel: editItemCancel,
			removeItem: removeItem,
			removeCompletedItems: removeCompletedItems,
			toggleComplete: toggleComplete,
			toggleAll: toggleAll
		});

		return Controller;
	}
);