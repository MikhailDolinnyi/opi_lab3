// Оборачиваем код в обработчик события DOMContentLoaded, чтобы убедиться, что элементы DOM загружены
document.addEventListener("DOMContentLoaded", function () {
    const center_coordinate_plate = 250;


    const defaultRValue = "3";

    const radioButtons = document.querySelectorAll('input[name="data-form\:rSelect"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            radius = this.value;
            updateGraph(radius);
        });
    });

    // Установим значение по умолчанию, если ничего не выбрано
    if (radioButtons.length > 0 && ![...radioButtons].some(radio => radio.checked)) {
        const defaultRadio = [...radioButtons].find(radio => radio.value === defaultRValue);
        if (defaultRadio) {
            defaultRadio.checked = true;
        }
    }

    function checkDot(x, y, r) {
        return checkFirstQuarter(x, y, r) || checkSecondQuarter() ||
            checkThirdQuarter(x, y, r) || checkFourthQuarter(x, y, r);
    }

    function checkFirstQuarter(x, y, r) {
        if (x >= 0 && y >= 0) {
            // Треугольник со сторонами R/2
            return y <= (-x + r / 2);
        }
        return false;
    }

    function checkSecondQuarter() {
        return false;
    }

    function checkThirdQuarter(x, y, r) {
        if (x <= 0 && y <= 0) {
            // Квадрат
            return x >= -r && y >= -r;
        }
        return false;
    }

    function checkFourthQuarter(x, y, r) {
        if (x >= 0 && y <= 0) {
            // Условие: x^2 + y^2 <= R^2
            return x * x + y * y <= r * r;
        }
        return false;
    }







    function changeTimeZone() {
        const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.querySelectorAll(".now-time").forEach(cell => {
            const mscTimeString = cell.textContent.trim(); // Исходное время
            const [datePart, timePart] = mscTimeString.split(" "); // Разделяем дату и время
            const moscowDate = new Date(`${datePart}T${timePart}+03:00`); // Создаём объект Date в московском времени

            if (!isNaN(moscowDate)) { // Проверяем корректность времени
                const options = {
                    timeZone: clientTimeZone,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    fractionalSecondDigits: 3,
                };

                const clientTime = new Intl.DateTimeFormat("en-GB", options).format(moscowDate);

                cell.textContent = clientTime.replaceAll("/", "-").replace(",", ""); // Обновляем текст ячейки
            }
        });
    }



    // Классы валидации и функции валидации
    class InvalidValueException extends Error {
        constructor(message) {
            super(message);
            this.name = "InvalidValueException";
        }
    }

    class Validator {
        validate(value) {
            throw new Error("Метод validate() нужно переопределить");
        }
    }

    class YValidator extends Validator {
        validate(value) {
            if (isNaN(value)) {
                throw new InvalidValueException("Неверное значение Y");
            }

            const decimalPart = String(value).trim().split('.')[1];
            if (decimalPart && decimalPart.length > 15) {
                throw new InvalidValueException("Слишком много знаков после запятой");
            }

            const y = Number(value);
            if (y < -5 || y > 3) {
                throw new InvalidValueException("Число Y не входит в диапазон");
            }

            return true;
        }
    }

    class XValidator extends Validator {
        validate(value) {
            if (isNaN(value)) {
                throw new InvalidValueException("Неверное значение X");
            }

            const x = Number(value);
            if (x < -2 || x > 2) {
                throw new InvalidValueException("Число X не входит в диапазон");
            }
            return true;
        }
    }

    class RValidator extends Validator {
        validate(value) {
            if (!value) {
                throw new InvalidValueException("Пожалуйста, выберите значение R");
            }
            return true;
        }
    }

    const xValidator = new XValidator();
    const yValidator = new YValidator();
    const rValidator = new RValidator();

    function validateFormInput(values) {
        xValidator.validate(values.x);
        yValidator.validate(values.y);
        rValidator.validate(values.r);
    }


    function handleClick(event) {
        const svg = document.getElementById("plate");
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const coords = point.matrixTransform(svg.getScreenCTM().inverse());

        const r = document.querySelector('input[name="data-form:rSelect"]:checked')?.value;
        let x = (coords.x - 250) / 33;
        let y = (250 - coords.y) / 33;


        try {
            validateFormInput({x: x.toFixed(2), y: y.toFixed(2), r: r});


            document.querySelector('input[id$=":x"]').value = x.toFixed(2);
            document.querySelector('input[id$=":y"]').value = y.toFixed(2);
            document.querySelector('input[name="data-form:rSelect"][value="' + r + '"]').checked = true;

            // Отправляем форму через стандартное JSF-событие
            // validateAndSubmitForm();
            document.getElementById("data-form:submit").click();
        } catch (e) {
            alert(e.message);
        }
    }

    let allowAjaxRequest = false;

    window.validateAndSubmitForm = function () {
        const form = document.getElementById("data-form");
        const formData = new FormData(form);
        const values = {
            x: formData.get('data-form:x'),
            y: formData.get('data-form:y'),
            r: formData.get('data-form:rSelect')
        };

        const errorDiv = document.getElementById("error");

        try {
            validateFormInput(values);
            errorDiv.hidden = true;
            allowAjaxRequest = true; // Валидация прошла, разрешаем отправку
            return true;
        } catch (e) {
            errorDiv.hidden = false;
            errorDiv.textContent = e.message;
            allowAjaxRequest = false; // Валидация не прошла, запрещаем отправку
            return false;
        }
    }


    // Привязываем обработчик события для клика по SVG
    document.getElementById("plate").addEventListener("click", handleClick);

    // Обновление графика при изменении R
    let radius = document.querySelector('input[name="data-form\:rSelect"]:checked')?.value;
    if (radius) {
        updateGraph(radius);
    }


    function updateGraph(r) {
        const scaleFactor = r / 3;

        document.getElementById("rect").setAttribute("width", 99 * scaleFactor);
        document.getElementById("rect").setAttribute("height", 100 * scaleFactor);
        document.getElementById("rect").setAttribute("x", 250 - 100 * scaleFactor);
        document.getElementById("rect").setAttribute("y", 251);


        // Update the arc path (same as before)
        document.getElementById("arc").setAttribute("d", `M ${250 + 100 * scaleFactor} 251 A ${100 * scaleFactor} ${100 * scaleFactor} 0 0 1 251 ${250 + 100 * scaleFactor} L 251 251 Z`);

        // Update the triangle points (same as before)
        document.getElementById("triangle").setAttribute("points", `251,249 251,${250 - 50 * scaleFactor} ${250 + 50 * scaleFactor},249`);

        // Update other markers and labels (same as before)
        document.getElementById("mark-neg-rx").setAttribute("x1", 250 - 100 * scaleFactor);
        document.getElementById("mark-neg-rx").setAttribute("x2", 250 - 100 * scaleFactor);

        document.getElementById("mark-rx").setAttribute("x1", 250 + 100 * scaleFactor);
        document.getElementById("mark-rx").setAttribute("x2", 250 + 100 * scaleFactor);

        document.getElementById("mark-ry").setAttribute("y1", 250 - 100 * scaleFactor);
        document.getElementById("mark-ry").setAttribute("y2", 250 - 100 * scaleFactor);

        document.getElementById("mark-neg-ry").setAttribute("y1", 250 + 100 * scaleFactor);
        document.getElementById("mark-neg-ry").setAttribute("y2", 250 + 100 * scaleFactor);

        document.getElementById("label-neg-rx").setAttribute("x", 250 - 120 * scaleFactor);
        document.getElementById("label-rx").setAttribute("x", 250 + 103 * scaleFactor);

        document.getElementById("label-neg-ry").setAttribute("y", 250 + 110 * scaleFactor);
        document.getElementById("label-ry").setAttribute("y", 250 - 96 * scaleFactor);

        drawPoints()

    }


    function drawPoints() {
        console.log("drawPoints called");
        const svg = document.getElementById("plate");
        // Очищаем старые точки перед отрисовкой новых
        svg.querySelectorAll(".data-point").forEach(point => point.remove());

        // Находим все точки в #points-data
        const points = document.querySelectorAll("#points-data .point");

        points.forEach(point => {
            // Извлекаем данные из атрибутов
            const x = parseFloat(point.getAttribute("data-x"));
            const y = parseFloat(point.getAttribute("data-y"));
            const result = point.getAttribute("data-result") === "true";

            // Преобразуем координаты для SVG-системы (центр 250,250 и масштаб)
            const svgX = center_coordinate_plate + (x * 33);
            const svgY = center_coordinate_plate - (y * 33);

            // Создаем круг для точки
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", svgX);
            circle.setAttribute("cy", svgY);
            circle.setAttribute("r", 2);
            circle.setAttribute("fill", checkDot(x,y,document.querySelector('input[name="data-form\:rSelect"]:checked')?.value) ? "green" : "red");
            circle.classList.add("data-point");

            // Добавляем точку на svg
            svg.appendChild(circle);
        });
    }



    // Таймер для дебаунсинга
    let debounceTimer = null;

// MutationObserver для отслеживания изменений в <td id="result">
    const resultElement = document.getElementById("result");
    if (resultElement) {
        // Создаём MutationObserver
        const observer = new MutationObserver(function () {
            // Отключаем Observer перед выполнением действий, чтобы избежать повторного вызова
            observer.disconnect();

            // Сбрасываем предыдущий таймер, если изменения происходят слишком быстро
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            // Устанавливаем новый таймер
            debounceTimer = setTimeout(() => {
                changeTimeZone(); // Выполняем обновление часового пояса

                const rValue = parseFloat(document.querySelector('input[name="data-form\:rSelect"]:checked')?.value);
                if (!isNaN(rValue)) {
                    drawPoints(rValue / 3, true); // Вызываем обновление графика
                }

                debounceTimer = null; // Сбрасываем таймер после выполнения

                // Включаем Observer обратно после завершения действий
                observer.observe(resultElement, {
                    childList: true,
                    subtree: true
                });
            }, 100); // Интервал в 100 мс (можно настроить по необходимости)
        });
        // Включаем Observer для отслеживания изменений
        observer.observe(resultElement, {
            childList: true,
            subtree: true
        });
    }

    drawPoints(); // Изначальная отрисовка точек
    changeTimeZone();


});