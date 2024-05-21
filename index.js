const html = document.documentElement;
const selectThemeButton = document.getElementById('themeSelector');
const clearTaskButton = document.querySelector('#clearTask');
const titleLink = document.querySelector('.title a');
const taskInputText = document.querySelector('#createTask');
const tasksDummy = document.querySelectorAll('.list__item.task');
const form = document.querySelector('form');
const taskList = document.querySelector('.list');

let tasks = [];
let id = 0;

const createTaskElement = (inputText) => {
  const li = document.createElement('li');
  const label = document.createElement('label');
  const inputCheckbox = document.createElement('input');
  const p = document.createElement('p');
  const buttonDelete = document.createElement('button');
  const img = document.createElement('img');

  li.classList.add('list__item', 'task');

  label.setAttribute('for', `checkbox${id + 1}`);
  label.classList.add('sr-only');
  label.textContent = 'Check box to complete task';

  inputCheckbox.type = 'checkbox';
  inputCheckbox.name = 'complete';
  inputCheckbox.id = `${id + 1}`;
  inputCheckbox.classList.add('list__item-input');

  inputCheckbox.addEventListener('change', () => {
    li.classList.toggle('completed');
  });

  p.classList.add('list__item-text');
  p.textContent = `${inputText}`;

  buttonDelete.type = 'button';
  buttonDelete.ariaLabel = 'remove task';
  buttonDelete.id = `removeTask${id + 1}`;
  buttonDelete.classList.add('list__btn-remove');

  buttonDelete.addEventListener('click', () => {
    taskList.removeChild(li);
  });

  img.src = './images/icon-cross.svg';

  li.appendChild(label);
  li.appendChild(inputCheckbox);
  li.appendChild(p);
  buttonDelete.appendChild(img);
  li.appendChild(buttonDelete);

  id++;
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
    taskList.removeChild(task);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addNewTask();
});

selectThemeButton.addEventListener('click', () => {
  html.getAttribute('data-theme') == 'light'
    ? html.setAttribute('data-theme', 'dark')
    : html.setAttribute('data-theme', 'light');
});
