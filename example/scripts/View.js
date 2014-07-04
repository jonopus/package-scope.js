'use strict';
/*global
ps*/

ps(
    'app.View',
    [
        'scope',
        'qsa',
        'qs',
        '$on',
        '$live',
        '$parent'
    ],
    function(
        scope,
        qsa,
        qs,
        $on,
        $live,
        $parent
    ){
        var
        template,
        ENTER_KEY,
        ESCAPE_KEY,
        $todoList,
        $todoItemCounter,
        $clearCompleted,
        $main,
        $footer,
        $toggleAll,
        $newTodo,
        dataset,
        checked,
        value;

        /**
         * View that abstracts away the browser's DOM completely.
         * It has two simple entry points:
         *
         *   - bind(eventName, handler)
         *     Takes a todo application event and registers the handler
         *   - render(command, parameterObject)
         *     Renders the given command with the options
         */
        function View(templateVal) {
            template = templateVal;

            ENTER_KEY = 13;
            ESCAPE_KEY = 27;

            $todoList = qs('#todo-list');
            $todoItemCounter = qs('#todo-count');
            $clearCompleted = qs('#clear-completed');
            $main = qs('#main');
            $footer = qs('#footer');
            $toggleAll = qs('#toggle-all');
            $newTodo = qs('#new-todo');
        }

        function removeItem(id) {
            var elem = qs('[data-id="' + id + '"]');

            if (elem) {
                $todoList.removeChild(elem);
            }
        }

        function clearCompletedButton(completedCount, visible) {
            $clearCompleted.innerHTML = template.clearCompletedButton(completedCount);
            $clearCompleted.style.display = visible ? 'block' : 'none';
        }

        function setFilter(currentPage) {
            qs('#filters .selected').className = '';
            qs('#filters [href="#/' + currentPage + '"]').className = 'selected';
        }

        function elementComplete(id, completed) {
            var listItem = qs('[data-id="' + id + '"]');

            if (!listItem) {
                return;
            }

            listItem.className = completed ? 'completed' : '';

            // In case it was toggled from an event and not by clicking the checkbox
            qs('input', listItem).checked = completed;
        }

        function editItem(id, title) {
            var listItem = qs('[data-id="' + id + '"]');

            if (!listItem) {
                return;
            }

            listItem.className = listItem.className + ' editing';

            var input = document.createElement('input');
            input.className = 'edit';

            listItem.appendChild(input);
            input.focus();
            input.value = title;
        }

        function editItemDone(id, title) {
            var listItem = qs('[data-id="' + id + '"]');

            if (!listItem) {
                return;
            }

            var input = qs('input.edit', listItem);
            listItem.removeChild(input);

            listItem.className = listItem.className.replace('editing', '');

            qsa('label', listItem).forEach(function (label) {
                label.textContent = title;
            });
        }

        function render(viewCmd, parameter) {
            var viewCommands = {
                showEntries: function () {
                    $todoList.innerHTML = template.show(parameter);
                },
                removeItem: function () {
                    removeItem(parameter);
                },
                updateElementCount: function () {
                    $todoItemCounter.innerHTML = template.itemCounter(parameter);
                },
                clearCompletedButton: function () {
                    clearCompletedButton(parameter.completed, parameter.visible);
                },
                contentBlockVisibility: function () {
                    $main.style.display = $footer.style.display = parameter.visible ? 'block' : 'none';
                },
                toggleAll: function () {
                    $toggleAll.checked = parameter.checked;
                },
                setFilter: function () {
                    setFilter(parameter);
                },
                clearNewTodo: function () {
                    $newTodo.value = '';
                },
                elementComplete: function () {
                    elementComplete(parameter.id, parameter.completed);
                },
                editItem: function () {
                    editItem(parameter.id, parameter.title);
                },
                editItemDone: function () {
                    editItemDone(parameter.id, parameter.title);
                }
            };

            viewCommands[viewCmd]();
        }

        function itemId(element) {
            var li = $parent(element, 'li');
            return parseInt(li.dataset.id, 10);
        }

        function bindItemEditDone(handler) {
            $live('#todo-list li .edit', 'blur', function () {
                if (!dataset.iscanceled) {
                    handler({
                        id: itemId(this),
                        title: value
                    });
                }
            });

            $live('#todo-list li .edit', 'keypress', function (event) {
                if (event.keyCode === ENTER_KEY) {
                    // Remove the cursor from the input when you hit enter just like if it
                    // were a real form
                    blur();
                }
            });
        }

        function bindItemEditCancel(handler) {
            $live('#todo-list li .edit', 'keyup', function (event) {
                if (event.keyCode === ESCAPE_KEY) {
                    dataset.iscanceled = true;
                    blur();

                    handler({id: itemId(this)});
                }
            });
        }

        function bind(event, handler) {
            if (event === 'newTodo') {
                $on($newTodo, 'change', function () {
                    handler($newTodo.value);
                });

            } else if (event === 'removeCompleted') {
                $on($clearCompleted, 'click', function () {
                    handler();
                });

            } else if (event === 'toggleAll') {
                $on($toggleAll, 'click', function () {
                    handler({completed: checked});
                });

            } else if (event === 'itemEdit') {
                $live('#todo-list li label', 'dblclick', function () {
                    handler({id: itemId(this)});
                });

            } else if (event === 'itemRemove') {
                $live('#todo-list .destroy', 'click', function () {
                    handler({id: itemId(this)});
                });

            } else if (event === 'itemToggle') {
                $live('#todo-list .toggle', 'click', function () {
                    handler({
                        id: itemId(this),
                        completed: checked
                    });
                });

            } else if (event === 'itemEditDone') {
                bindItemEditDone(handler);

            } else if (event === 'itemEditCancel') {
                bindItemEditCancel(handler);
            }
        }

        scope.public({
            render: render,
            bind: bind
        });

        return View;
    }
);