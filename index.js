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

window.addEventListener('resize', () => {
  setFilterDocumentStructure();
});

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
  if (element.id == 'filterAll') {
    removeStyleAttribute(allTasks);
  }
  if (element.id == 'filterActive') {
    removeStyleAttribute(activeTasks);
    setDisplayNone(completedTasks);
  }
  if (element.id == 'filterCompleted') {
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
  let count = document.querySelectorAll(activeTasks).length;

  if (count > 0) {
    if (count < 2) {
      taskCount.textContent = `${count} item left`;
    } else {
      taskCount.textContent = `${count} items left`;
    }
  } else {
    taskCount.textContent = '';
  }
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
    updateContainerDisplay();
  }, 350);
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
  li.setAttribute('draggable', 'true');

  li.addEventListener('dragstart', () => {
    li.classList.add('dragging');
  });
  li.addEventListener('dragend', () => {
    li.classList.remove('dragging');
  });

  label.setAttribute('for', id);
  label.classList.add('sr-only');
  label.textContent = 'Check box to complete task';

  inputCheckbox.type = 'checkbox';
  inputCheckbox.name = 'complete';
  inputCheckbox.id = id;
  inputCheckbox.classList.add('list__item-input');

  inputCheckbox.addEventListener('change', () => {
    const selectedFilter = document.querySelector('.selected');
    li.classList.toggle('completed');

    updateListDisplay(selectedFilter);
    updateTaskCount();
  });

  p.classList.add('list__item-text');
  p.textContent = `${inputText}`;

  buttonDelete.type = 'button';
  buttonDelete.ariaLabel = 'remove task';
  buttonDelete.id = `remove-${id}`;
  buttonDelete.classList.add('list__btn-remove');

  buttonDelete.addEventListener('click', () => {
    removeTaskFromList(taskList, li);
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
  updateContainerDisplay();
});

selectThemeButton.addEventListener('click', () => {
  if (html.getAttribute('data-theme') == 'light') {
    html.setAttribute('data-theme', 'dark');
    themeLogo.src = './icon-moon.svg';
    themeLogo.style.transform = 'rotate(360deg)';
  } else {
    html.setAttribute('data-theme', 'light');
    themeLogo.src = './icon-sun.svg';
    themeLogo.removeAttribute('style');
  }
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
