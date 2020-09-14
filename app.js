window.onload = function () {

	let btn = document.querySelector('.addBtn');
	let input = document.querySelector('.addTxt');
	let container = document.querySelector('.list');
	let todo;
	let delete_btn = document.querySelector('.delete');

	function toLocal() {
		todo = container.innerHTML;
		localStorage.setItem('todos', todo);
	}


	btn.addEventListener('click', addToDos);

	input.addEventListener('keydown', (event) => {
		if (event.keyCode === 13) {
			addToDos();
		}
	})


	function addToDos() {
		if (input.value != '' && input.value != null && input.value != undefined) {
			let out = '';
			out = container.innerHTML;
			out += `
			<li class="element" draggable="true">
			<label class="edit" contenteditable="true"> ${input.value} </label>
			<img class="tick" src="tick.png">
			<img class="dustbin" src="trash.png">
			</li>
		`;

			container.innerHTML = out;
			input.value = '';
			toLocal();
			changeTasks();
		}
	}

	function changeTasks() {

		let tasks = document.querySelectorAll('.element');
		let checks = document.querySelectorAll('.tick');
		let dustbin = document.querySelectorAll('.dustbin');
		let edits = document.querySelectorAll('.edit');

		checks.forEach((elem, index) => {
			elem.addEventListener('click', () => {
				if (!tasks[index].classList.contains('text-line')) {
					tasks[index].classList.add('text-line');
				} else {
					tasks[index].classList.remove('text-line');
				}
				toLocal();
			});
		});

		dustbin.forEach((elem, index) => {
			elem.addEventListener('click', () => {
				tasks[index].remove();
				toLocal();
			});
		});


		delete_btn.addEventListener('click', () => {
			tasks.forEach(elem => {
				elem.remove();
				toLocal();
			});
		});


		edits.forEach(elem => {
			elem.addEventListener('focusout', () => {
				toLocal();
			});
		});

		edits.forEach(elem => {
			elem.addEventListener('keydown', (e) => {

				if (e.keyCode === 13) {
					e.preventDefault(); //отменяем стандартное действие энтера
					elem.blur(); //убираем фокус с инпута
					toLocal();
				}
			});
		});


		/*если инпут пустой и мы нажимаем вне его или на энтер ,то он удаляется*/

		edits.forEach((elem, index) => {
			elem.addEventListener('focusout', () => {
				if (elem.textContent == '') {
					tasks[index].remove();
					toLocal();
				} else {
					toLocal();
				}
			});

		});


		/*если инпут пустой, то после обновления мы его убираем,оптимальный вариант*/
		// edits.forEach((elem, index) => {
		// 	if (elem.textContent === '') {
		// 		tasks[index].remove();
		// 		toLocal();
		// 	}
		// });

	}


	function dragTasks() {

		container.addEventListener(`dragstart`, (evt) => {
			evt.target.classList.add(`selected`);
		})

		container.addEventListener(`dragend`, (evt) => {
			evt.target.classList.remove(`selected`);
		});

		const getNextElement = (cursorPosition, currentElement) => {
			const currentElementCoord = currentElement.getBoundingClientRect();
			const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

			const nextElement = (cursorPosition < currentElementCenter) ? currentElement : currentElement.nextElementSibling;

			return nextElement;
		};

		container.addEventListener(`dragover`, (evt) => {
			evt.preventDefault();

			let activeElement = container.querySelector(`.selected`);
			let currentElement = evt.target;
			let isMoveable = activeElement !== currentElement && currentElement.classList.contains(`element`);

			if (!isMoveable) {
				return;
			}
			const nextElement = getNextElement(evt.clientY, currentElement);

			if (nextElement && activeElement === nextElement.previousElementSibling || activeElement === nextElement) {
				return;
			}
			container.insertBefore(activeElement, nextElement);

			toLocal();
		});


	}

	dragTasks();


	if (localStorage.getItem('todos')) {
		container.innerHTML = localStorage.getItem('todos');
		changeTasks();
	}

}



// localStorage.clear();
