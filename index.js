import { v4 as uuidv4 } from './node_modules/uuid';

const html = document.documentElement;
const selectThemeButton = document.getElementById('themeSelector');
const clearTaskButton = document.querySelector('#clearTask');
const taskInputText = document.querySelector('#createTask');
const form = document.querySelector('form');
const taskList = document.querySelector('.list');
const elContainers = document.querySelectorAll('.container:not(:first-child)');

const tasks = taskList.children;

const setContainerDisplayNone = () => {
  elContainers.forEach((container) => {
    container.removeAttribute('style');
  });
};

const removeTaskFromList = (array, element, list) => {
  array.removeChild(element);

  if (list.length == 0) {
    setContainerDisplayNone();
  }
};

const createTaskElement = (inputText) => {
  const li = document.createElement('li');
  const label = document.createElement('label');
  const inputCheckbox = document.createElement('input');
  const p = document.createElement('p');
  const buttonDelete = document.createElement('button');
  const img = document.createElement('img');

  let id = uuidv4();

  li.classList.add('list__item', 'task');

  label.setAttribute('for', id);
  label.classList.add('sr-only');
  label.textContent = 'Check box to complete task';

  inputCheckbox.type = 'checkbox';
  inputCheckbox.name = 'complete';
  inputCheckbox.id = id;
  inputCheckbox.classList.add('list__item-input');

  inputCheckbox.addEventListener('change', () => {
    li.classList.toggle('completed');
  });

  p.classList.add('list__item-text');
  p.textContent = `${inputText}`;

  buttonDelete.type = 'button';
  buttonDelete.ariaLabel = 'remove task';
  buttonDelete.id = `remove-${id}`;
  buttonDelete.classList.add('list__btn-remove');

  buttonDelete.addEventListener('click', () => {
    removeTaskFromList(taskList, li, tasks);
  });

  img.src = './icon-cross.svg';

  li.appendChild(label);
  li.appendChild(inputCheckbox);
  li.appendChild(p);
  buttonDelete.appendChild(img);
  li.appendChild(buttonDelete);

  return li;
};

const addNewTask = () => {
  const formattedInputText = taskInputText.value.trim();
  if (formattedInputText !== '') {
    const taskElement = createTaskElement(formattedInputText);
    taskList.appendChild(taskElement);
    taskInputText.value = '';
  }
};

clearTaskButton.addEventListener('click', () => {
  const completedTasks = document.querySelectorAll('.completed');

  completedTasks.forEach((task) => {
    removeTaskFromList(taskList, task, tasks);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addNewTask();

  elContainers.forEach((container) => {
    if (!container.hasAttribute('style')) {
      container.style.display = 'flex';
    }
  });
});

selectThemeButton.addEventListener('click', () => {
  html.getAttribute('data-theme') == 'light'
    ? html.setAttribute('data-theme', 'dark')
    : html.setAttribute('data-theme', 'light');
});
