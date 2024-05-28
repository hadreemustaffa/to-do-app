import { v4 as uuidv4 } from 'uuid';

const html = document.documentElement;
const selectThemeButton = document.getElementById('themeSelector');
const clearTaskButton = document.querySelector('#clearTask');
const taskInputText = document.querySelector('#createTask');
const form = document.querySelector('form');
const taskList = document.querySelector('.list');
const elContainers = document.querySelectorAll('.container:not(:first-child)');
const themeLogo = document.querySelector('.logo');
const main = document.querySelector('main');
const filterContainer = document.querySelector('.filter');
const filterButtons = document.querySelectorAll('.filter__btn');
const taskCount = document.querySelector('.control__task-count');

const tasks = taskList.children;
const allTasks = '.list__item.task';
const completedTasks = '.list__item.task.completed';
const activeTasks = '.list__item.task:not(.completed)';

const saveTasksToLocalStorage = () => {
  const tasksArray = Array.from(tasks).map((task) => ({
    id: task.querySelector('input').id,
    text: task.querySelector('p').textContent,
    completed: task.classList.contains('completed'),
  }));
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
};

const saveThemeToLocalStorage = () => {
  const selectedTheme = html.getAttribute('data-theme');
  localStorage.setItem('theme', selectedTheme);
};

const loadTasksFromLocalStorage = () => {
  const tasksArray = JSON.parse(localStorage.getItem('tasks')) || [];
  tasksArray.forEach((task) => {
    const taskElement = createTaskElement(task.text, task.id, task.completed);
    taskList.appendChild(taskElement);
  });
  updateContainerDisplay();
  updateTaskCount();

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }
};

const setFilterDocumentStructure = () => {
  const isLargeScreen = window.innerWidth >= 760;
  const isInMain = filterContainer.parentElement === main;

  if (isLargeScreen) {
    filterContainer.classList.remove('container');
    if (isInMain) {
      taskCount.insertAdjacentElement('afterend', filterContainer);
    }
  } else if (!isLargeScreen && !isInMain) {
    main.appendChild(filterContainer);
    filterContainer.classList.add('container');
  }
};

setFilterDocumentStructure();

window.addEventListener('resize', setFilterDocumentStructure);

const updateThemeIcon = (theme) => {
  if (theme === 'light') {
    themeLogo.src = './icon-sun.svg';
    themeLogo.removeAttribute('style');
  } else {
    themeLogo.src = './icon-moon.svg';
    themeLogo.style.transform = 'rotate(360deg)';
  }
};

const removeStyleAttribute = (elements) => {
  document.querySelectorAll(elements).forEach((element) => {
    element.removeAttribute('style');
    element.classList.remove('filtered');
  });
};

const setDisplayNone = (elements) => {
  document.querySelectorAll(elements).forEach((element) => {
    element.classList.add('filtered');
    setTimeout(() => {
      element.style.display = 'none';
    }, 350);
  });
};

const updateListDisplay = (element) => {
  if (element.id === 'filterAll') {
    removeStyleAttribute(allTasks);
  } else if (element.id === 'filterActive') {
    removeStyleAttribute(activeTasks);
    setDisplayNone(completedTasks);
  } else if (element.id === 'filterCompleted') {
    removeStyleAttribute(completedTasks);
    setDisplayNone(activeTasks);
  }
};

const filterList = (btnElement) => {
  document.querySelector('.selected')?.classList.remove('selected');
  btnElement.classList.add('selected');
  updateListDisplay(btnElement);
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterList(button);
  });
});

const updateTaskCount = () => {
  const count = document.querySelectorAll(activeTasks).length;
  taskCount.textContent =
    count > 0 ? `${count} ${count === 1 ? 'item' : 'items'} left` : '';
};

const updateContainerDisplay = () => {
  updateTaskCount();
  elContainers.forEach((container) => {
    if (tasks.length > 0) {
      container.style.display = 'flex';
    } else {
      container.removeAttribute('style');
    }
  });
};

const removeTaskFromList = (parentElement, element) => {
  element.classList.add('removing');
  setTimeout(() => {
    parentElement.removeChild(element);
    saveTasksToLocalStorage();
    updateContainerDisplay();
  }, 350);
};

const createTaskElement = (inputText, id = uuidv4(), completed = false) => {
  const li = document.createElement('li');
  li.classList.add('list__item', 'task');
  if (completed) li.classList.add('completed');
  li.setAttribute('draggable', 'true');

  li.addEventListener('dragstart', () => li.classList.add('dragging'));
  li.addEventListener('dragend', () => li.classList.remove('dragging'));

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.classList.add('sr-only');
  label.textContent = 'Check box to complete task';

  const inputCheckbox = document.createElement('input');
  inputCheckbox.type = 'checkbox';
  inputCheckbox.name = 'complete';
  inputCheckbox.id = id;
  inputCheckbox.classList.add('list__item-input');
  inputCheckbox.checked = completed;
  inputCheckbox.addEventListener('change', () => {
    const selectedFilter = document.querySelector('.selected');
    li.classList.toggle('completed');
    saveTasksToLocalStorage();
    updateListDisplay(selectedFilter);
    updateTaskCount();
  });

  const p = document.createElement('p');
  p.classList.add('list__item-text');
  p.textContent = inputText;

  const buttonDelete = document.createElement('button');
  buttonDelete.type = 'button';
  buttonDelete.ariaLabel = 'remove task';
  buttonDelete.id = `remove-${id}`;
  buttonDelete.classList.add('list__btn-remove');
  buttonDelete.addEventListener('click', () => {
    removeTaskFromList(taskList, li);
  });

  const img = document.createElement('img');
  img.src = './icon-cross.svg';

  buttonDelete.appendChild(img);
  li.append(label, inputCheckbox, p, buttonDelete);

  return li;
};

const addNewTask = () => {
  const formattedInputText = taskInputText.value.trim();
  if (formattedInputText !== '') {
    const taskElement = createTaskElement(formattedInputText);
    taskList.appendChild(taskElement);
    taskInputText.value = '';
    saveTasksToLocalStorage();
    updateContainerDisplay();
  }
};

clearTaskButton.addEventListener('click', () => {
  document.querySelectorAll('.completed').forEach((task) => {
    removeTaskFromList(taskList, task);
  });
  saveTasksToLocalStorage();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addNewTask();
  updateContainerDisplay();
});

selectThemeButton.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  updateThemeIcon(newTheme);
  saveThemeToLocalStorage();
});

taskList.addEventListener('dragover', (e) => {
  e.preventDefault();
  const dragElement = document.querySelector('.dragging');
  const afterElement = getDragAfterElement(taskList, e.clientY);
  if (afterElement == null) {
    taskList.appendChild(dragElement);
  } else {
    taskList.insertBefore(dragElement, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll("li[draggable='true']"),
  ];
  return (
    draggableElements.find((element) => {
      const box = element.getBoundingClientRect();
      return y < box.top + box.height / 2;
    }) || null
  );
}

document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);
