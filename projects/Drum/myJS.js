$(function () {
    // Отлавливаем события "Нажатие на клавишу"
    $(document).keydown(function (event) {
        // Создаем переменную, в которую помещаем div с подходящим data-key
        var key = $(this).find('.key[data-key=' + event.which + ']');

        // Находим на странице тег audio с нужным data-key
        var audio = $(this).find('audio[data-key=' + event.which + ']')[0];

        // Присваеваем активный класс к клавише, чтобы подсветить её
        key.addClass('playing');

        // Проверяем существует ли audio-тег
        if (!audio) return;

        // Сбрасываем и воспроизводим звук
        audio.currentTime = 0;
        audio.play();
    });

    // Отслеживаем событие, когда пользователь отпускает кнопку
    $(document).keyup(function (event) {
        // снова создаем переменную с нужным data-key
        var key = $(this).find('.key[data-key=' + event.which + ']');

        // Убираем подсветку
        key.removeClass('playing');
    });
});
