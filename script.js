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
		if (this.tasksList.length === 0) {toDo.innerHTML = ''; return};
		this.tasksList.forEach(function(item, i){
			displayTask += `
			<li>
				<input type='checkbox' id='item_${i}' ${item.isDone? 'checked' : ''}>
				<label for='item_${i}'>${item.date +' '+ item.name}</label>
				<button class="delete" id='button_item_${i}'><img src="img/basket.svg"></button>
			</li>
			`;
			toDo.innerHTML = displayTask;
			});
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

	filterIsDone(status) {
		if (status === isDone) {
			let newTasksList = this.tasksList;
			this.tasksList = this.tasksList.filter(task => task.isDone===true);
			this.displayTasks();
			this.tasksList = newTasksList;
		} else {
			let newTasksList = this.tasksList;
			this.tasksList = this.tasksList.filter(task => task.isDone===false);
			this.displayTasks();
			this.tasksList = newTasksList;
		}
	}

	filterDate(date, exactDay) {
		if (exactDay) {
			let newTasksList = this.tasksList;
			this.tasksList = this.tasksList.filter(task => task.date.split('.').reverse().join('-') == date);
			this.displayTasks();
			this.tasksList = newTasksList;
		} else {
			let newTasksList = this.tasksList;
			this.tasksList = this.tasksList.filter(task => new Date(task.date.split('.').reverse().join('-')) <= new Date(date));
			this.displayTasks();
			this.tasksList = newTasksList;
		}	
}
}

class Task {

	constructor(name, date) {
		this.name = name;
		this.isDone = false;
		this.date = date;
	}
}

let toDo = document.querySelector('.toDo');
let addMessage = document.querySelector('.message');
let addButton = document.querySelector('.add');
let addDate = document.getElementById('date');
let all = document.querySelector('.all');
let isDone = document.querySelector('.isDone');
let isNotDone = document.querySelector('.isNotDone');
let todayFilter = document.querySelector('.today');
let thisWeekFilter = document.querySelector('.thisWeek');
let setDateFilter = document.querySelector('.setDateButton');
let setDateInput = document.getElementById('setDate');
let tasksList = new TaskManager();

addButton.addEventListener('click', function() {
	let name = addMessage.value;
	let dateArray = addDate.value.split('-');
	let date = dateArray.reverse().join('.');
	tasksList.addTask(name, date);
});

all.addEventListener('click', function() {
	tasksList.displayTasks();
});

isDone.addEventListener('click', function() {
	tasksList.filterIsDone(isDone);
});

isNotDone.addEventListener('click', function() {
	tasksList.filterIsDone(isNotDone);
});

todayFilter.addEventListener('click', function() {
	let today = new Date();
	today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	tasksList.filterDate(today, 0);
});

thisWeekFilter.addEventListener('click', function() {
	let today = new Date();
	let thisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 168, 0, 0, 0);
	let thisWeekArray = [thisWeek.getFullYear(),thisWeek.getMonth()+1,thisWeek.getDate()];
	thisWeek = thisWeekArray.join('-').replace(/(^|\/)(\d)(?=\/)/g,"$10$2");
	tasksList.filterDate(thisWeek, 0);
});

setDateFilter.addEventListener('click', function() {
	let setDate = setDateInput.value;
	tasksList.filterDate(setDate, 1);
});