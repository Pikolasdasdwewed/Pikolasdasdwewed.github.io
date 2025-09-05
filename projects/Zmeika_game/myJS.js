// Глобальные переменные:
var FIELD_SIZE_X = 30; // строки
var FIELD_SIZE_Y = 30; // столбцы
var SNAKE_SPEED = 200; // Интервал между перемещениями змейки
var snake = []; // Сама змейка (массив ячеек)
var direction = 'y+'; // Направление движения змейки
var gameIsRunning = false; // Запущена ли игра
var snake_timer; // Таймер змейки
var food_timer; // Таймер для еды
var score = 0; // Результат

function init() {
    prepareGameField(); // Генерация поля

    var wrap = document.getElementsByClassName('wrap')[0];
    wrap.style.width = '600px';

    document.getElementById('snake-start').addEventListener('click', startGame);
    document.getElementById('snake-renew').addEventListener('click', refreshGame);

    // Отслеживание клавиш клавиатуры
    document.addEventListener('keydown', changeDirection);
}

/**
 * Функция генерации игрового поля
 */
function prepareGameField() {
    var game_table = document.createElement('table');
    game_table.setAttribute('class', 'game-table');

    for (var i = 0; i < FIELD_SIZE_X; i++) {
        var row = document.createElement('tr');
        row.className = 'game-table-row row-' + i;

        for (var j = 0; j < FIELD_SIZE_Y; j++) {
            var cell = document.createElement('td');
            cell.className = 'game-table-cell cell-' + i + '-' + j;
            row.appendChild(cell);
        }
        game_table.appendChild(row);
    }
    document.getElementById('snake-field').appendChild(game_table);
}

/**
 * Старт игры
 */
function startGame() {
    if (gameIsRunning) return; // если игра уже запущена, ничего не делаем

    // Очистка предыдущей змейки
    var cells = document.getElementsByClassName('game-table-cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove('snake-unit', 'snake-head', 'food-unit');
    }

    snake = [];  // очищаем массив змейки
    score = 0;   // сбрасываем счёт

    gameIsRunning = true;
    respawn(); // создаём новую змейку
    snake_timer = setInterval(move, SNAKE_SPEED);
    setTimeout(createFood, 500);
}


/**
 * Функция появления змейки на игровом поле
 */
function respawn() {
    // Центр поля
    var start_x = Math.floor(FIELD_SIZE_X / 2);
    var start_y = Math.floor(FIELD_SIZE_Y / 2);

    // Голова
    var snake_head = document.getElementsByClassName('cell-' + start_y + '-' + start_x)[0];
    // Хвост слева от головы (если start_x > 0)
    var snake_tail = document.getElementsByClassName('cell-' + start_y + '-' + (start_x - 1))[0];

    // Безопасная проверка
    if (!snake_head || !snake_tail) {
        alert('Ошибка: не удалось создать змейку в центре поля!');
        return;
    }

    // Добавляем классы
    snake_head.setAttribute('class', snake_head.getAttribute('class') + ' snake-unit');
    snake_tail.setAttribute('class', snake_tail.getAttribute('class') + ' snake-unit');

    // Сначала хвост, потом голова (для правильного движения)
    snake = []; // очищаем массив
    snake.push(snake_tail);
    snake.push(snake_head);

    // Направление движения вправо
    direction = 'x+';
}


/**
 * Движение змейки
 */
function move() {
    var snake_head = snake[snake.length - 1];
    var snake_head_classes = snake_head.getAttribute('class').split(' ');
    var coords = snake_head_classes[1].split('-');
    var coord_y = parseInt(coords[1]);
    var coord_x = parseInt(coords[2]);

    var new_unit;

    if (direction == 'x-') {
        new_unit = document.getElementsByClassName('cell-' + coord_y + '-' + (coord_x - 1))[0];
    } else if (direction == 'x+') {
        new_unit = document.getElementsByClassName('cell-' + coord_y + '-' + (coord_x + 1))[0];
    } else if (direction == 'y+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y - 1) + '-' + coord_x)[0];
    } else if (direction == 'y-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y + 1) + '-' + coord_x)[0];
    }

    // Проверки
    if (new_unit !== undefined && !isSnakeUnit(new_unit)) {
        new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
        snake.push(new_unit);

        if (!haveFood(new_unit)) {
            var removed = snake.splice(0, 1)[0];
            var classes = removed.getAttribute('class').split(' ');
            removed.setAttribute('class', classes[0] + ' ' + classes[1]);
        }
    } else {
        finishTheGame();
    }
}

/**
 * Проверка: элемент - часть змейки?
 */
function isSnakeUnit(unit) {
    return snake.includes(unit);
}

/**
 * Проверка: элемент - еда?
 */
function haveFood(unit) {
    var unit_classes = unit.getAttribute('class').split(' ');

    if (unit_classes.includes('food-unit')) {
        unit.setAttribute('class', unit_classes[0] + ' ' + unit_classes[1] + ' snake-unit');
        createFood();
        score++;
        return true;
    }
    return false;
}

/**
 * Создание еды
 */
function createFood() {
    var foodCreated = false;

    while (!foodCreated) {
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var food_cell = document.getElementsByClassName('cell-' + food_y + '-' + food_x)[0];
        var food_cell_classes = food_cell.getAttribute('class').split(' ');

        if (!food_cell_classes.includes('snake-unit')) {
            food_cell.setAttribute('class', food_cell.getAttribute('class') + ' food-unit');
            foodCreated = true;
        }
    }
}

/**
 * Изменение направления движения змейки
 */
function changeDirection(e) {
    switch (e.keyCode) {
        case 37: // влево
            if (direction != 'x+') direction = 'x-';
            break;
        case 38: // вверх
            if (direction != 'y-') direction = 'y+';
            break;
        case 39: // вправо
            if (direction != 'x-') direction = 'x+';
            break;
        case 40: // вниз
            if (direction != 'y+') direction = 'y-';
            break;
    }
}

/**
 * Завершение игры
 */
function finishTheGame() {
    gameIsRunning = false;
    clearInterval(snake_timer);
    alert('Вы проиграли! Ваш результат: ' + score.toString());
}

/**
 * Новая игра
 */
function refreshGame() {
    location.reload();
}

// Инициализация
window.onload = init;
