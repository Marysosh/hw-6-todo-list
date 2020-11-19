class TaskManager {

	constructor() {
		this.tasksList = [];
	}

	addTask(name, date) {
		this.tasksList.push(new Task(name, date));
		this.displayTasks();
	}

	deleteTask(id) {
		this.tasksList.splice(id, 1);
		this.displayTasks();
	}

	changeTaskStatus(id) {
		this.tasksList[id].isDone = !this.tasksList[id].isDone;
	}

	displayTasks() {
		let taskManager = this;
		let displayTask = '';
		toDo.innerHTML = ''; 
		this.tasksList.forEach((task, number) => createNewTask(task, number));

		this.tasksList.forEach(function(item, i){
			let newButton = document.getElementById('button_item_'+i);
			newButton.addEventListener('click', function() {
			taskManager.deleteTask(this.id.split('button_item_')[1]);
			});
			let newCheckBox = document.getElementById('item_'+i);
			newCheckBox.addEventListener('click', function() {
				taskManager.changeTaskStatus(this.id.split('item_')[1]);
			});
		});
	}

	filterTasks(filterFunction) {
		let newTasksList = this.tasksList;
		this.tasksList = this.tasksList.filter(filterFunction);
		this.displayTasks();
		this.tasksList = newTasksList;
	}
}

class Task {

	constructor(name, date) {
		this.name = name;
		this.isDone = false;
		this.date = date;
	}
}

function filterByStatus(isDone) {
	return task => task.isDone === isDone;
}

function filterByDate(date, exactDay) {
	if (exactDay) {
		return task => task.date.split('.').reverse().join('-') == date
	} else {
		return task => new Date(task.date.split('.').reverse().join('-')) <= new Date(date)
	}
}

function createNewTask(task, number) {
	let newTask = document.createElement('li');
	let taskInput = document.createElement('input');
	let taskLabel = document.createElement('label');
	let taskButton = document.createElement('button');
	let buttonImg = document.createElement('img');

	taskInput.type = 'checkbox';
	taskInput.id = 'item_' + number;
	taskInput.checked = task.isDone;

	taskLabel.innerHTML = task.date +' '+ task.name;
	taskLabel.for = 'item_' + number;

	buttonImg.setAttribute('src', 'img/basket.svg');

	taskButton.setAttribute('class', 'delete');
	taskButton.id = 'button_item_' + number;
	taskButton.append(buttonImg);

	newTask.append(taskInput);
	newTask.append(taskLabel);
	newTask.append(taskButton);

	toDo.append(newTask);
}

class ButtonListenerFactory {
	constructor() {
		this.createButton = function(listenerType) {
			let displayButton;
			if (listenerType === 'addButton') displayButton = new AddBtn();
			else if (listenerType === 'all') displayButton = new AllBtn();
			else if (listenerType === 'isDone') displayButton = new IsDoneBtn();
			else if (listenerType === 'isNotDone') displayButton = new IsNotDoneBtn();
			else if (listenerType === 'todayFilter') displayButton = new TodayFilterBtn();
			else if (listenerType === 'thisWeekFilter') displayButton = new ThisWeekBtn();
			else displayButton = new SetDateFilterBtn();
			displayButton.node.addEventListener('click', function(){
				displayButton.buttonMethod();
			})
			return displayButton
		}
	}
}

class AddBtn {
	constructor() {
		this.node = document.querySelector('.add');
		this.buttonMethod = () => {
			let name = addMessage.value;
			let dateArray = addDate.value.split('-');
			let date = dateArray.reverse().join('.');
			return tasksList.addTask(name, date)
		};
	}
}

class AllBtn {
	constructor() {
		this.node = document.querySelector('.all');
		this.buttonMethod = () => tasksList.displayTasks();
	}
}

class IsDoneBtn {
	constructor() {
		this.node = document.querySelector('.isDone');
		this.buttonMethod = () => tasksList.filterTasks(filterByStatus(true));
	}
}

class IsNotDoneBtn {
	constructor() {
		this.node = document.querySelector('.isNotDone');
		this.buttonMethod = () => tasksList.filterTasks(filterByStatus(false));
	}
}

class TodayFilterBtn {
	constructor() {
		this.node = document.querySelector('.today');
		this.buttonMethod = () => {
			let today = new Date();
			today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
			return tasksList.filterTasks(filterByDate(today, 0));
		}
	}
}

class ThisWeekBtn {
	constructor() {
		this.node = document.querySelector('.thisWeek');
		this.buttonMethod = () => {
			let today = new Date();
			let thisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 168, 0, 0, 0);
			let thisWeekArray = [thisWeek.getFullYear(),thisWeek.getMonth()+1,thisWeek.getDate()];
			thisWeek = thisWeekArray.join('-').replace(/(^|\/)(\d)(?=\/)/g,"$10$2");
			return tasksList.filterTasks(filterByDate(thisWeek, 0));
		}
	}
}

class SetDateFilterBtn {
	constructor() {
		this.node = document.querySelector('.setDateButton');
		this.buttonMethod = () => {
			let setDate = setDateInput.value;
			return tasksList.filterTasks(filterByDate(setDate, 1));
		}
	}
}

function initial() {
	const factory = new ButtonListenerFactory();
	const addButton = factory.createButton('addButton');
	const all = factory.createButton('all');
	const isDone = factory.createButton('isDone');
	const isNotDone = factory.createButton('isNotDone');
	const todayFilter = factory.createButton('todayFilter');
	const thisWeekFilter = factory.createButton('thisWeekFilter');
	const setDateFilter = factory.createButton('setDateFilter');
}

let toDo = document.querySelector('.toDo');
let addMessage = document.querySelector('.message');
let addDate = document.getElementById('date');
let setDateInput = document.getElementById('setDate');
let tasksList = new TaskManager();

initial();