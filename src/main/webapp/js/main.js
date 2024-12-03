// Оборачиваем код в обработчик события DOMContentLoaded, чтобы убедиться, что элементы DOM загружены
document.addEventListener("DOMContentLoaded", function () {
    const center_coordinate_plate = 250;

    let mutation_counter = 0;

    const defaultRValue = "3";

    let counter = 0;

    const table = document.getElementById("result-table");

    function isTableEmpty() {
        // Находим все строки таблицы, кроме заголовков (<th>)
        const rows = table.querySelectorAll("tr:not(:first-child)");

        // Если строк больше 0, то таблица не пуста
        return rows.length === 0;
    }


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

    class EntityValidator extends Validator {
        validate(value) {
            if (!value) {
                throw new InvalidValueException("Пожалуйста, выберите Entity");
            }
            return true;
        }
    }

    const xValidator = new XValidator();
    const yValidator = new YValidator();
    const rValidator = new RValidator();
    const entityValidator = new EntityValidator();

    function validateFormInput(values) {
        xValidator.validate(values.x);
        yValidator.validate(values.y);
        rValidator.validate(values.r);
        entityValidator.validate(values.e)
    }


    function handleClick(event) {
        const svg = document.getElementById("plate");
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const coords = point.matrixTransform(svg.getScreenCTM().inverse());

        const r = document.querySelector('input[name="data-form:rSelect"]:checked')?.value;
        const e = document.querySelector('input[name="data-form:entity"]:checked')?.value;
        let x = (coords.x - 250) / 33;
        let y = (250 - coords.y) / 33;


        try {
            validateFormInput({x: x.toFixed(2), y: y.toFixed(2), r: r, e: e});


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
            r: formData.get('data-form:rSelect'),
            e: formData.get('data-form:entity')
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

        drawPoints(scaleFactor, false)

    }


    function drawPoints(scale = 1, new_point = false) {
        console.log("drawPoints called with r = ", scale, "and new_point = ", new_point);
        console.trace("Trace for drawPoints call");
        let svg = document.getElementById("plate");
        // Очищаем старые точки перед отрисовкой новых
        svg.querySelectorAll(".data-point").forEach(point => {
                point.remove()

            }
        )// Находим все точки в #points-data
        let points = document.querySelectorAll("#points-data .point");

        let pointsArray
        let otherPoints
        let lastPoints


        if (new_point === true) {
            counter++;

            console.log(counter)

            // Преобразуем NodeList в массив
            pointsArray = Array.from(points);

            // Последние i точек
            lastPoints = pointsArray.slice(-counter);

            console.log(lastPoints)

            // Все точки, кроме последних i
            otherPoints = pointsArray.slice(0, pointsArray.length - counter);
            console.log(otherPoints)
        } else {

            lastPoints = 0
            otherPoints = Array.from(points)
            counter = 0
            console.log(otherPoints)

        }


        // Отрисовываем другие точки с обычной формулой
        otherPoints.forEach(point => {
            const x = parseFloat(point.getAttribute("data-x"));
            const y = parseFloat(point.getAttribute("data-y"));
            const result = point.getAttribute("data-result") === "true";

            const svgX = center_coordinate_plate + (x * (scale * 33));
            const svgY = center_coordinate_plate - (y * (scale * 33));
            console.log("old points svg x :", svgX, "svg y : ", svgY, "\n x = ", x, " y = ", y, " scale = ", scale)


            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", svgX);
            circle.setAttribute("cy", svgY);
            circle.setAttribute("r", 2);
            circle.setAttribute("fill", result ? "green" : "red");
            circle.classList.add("data-point");

            svg.appendChild(circle);
        });

        if (lastPoints !== 0) {
            // Отрисовываем последние i точек с изменённой формулой
            lastPoints.forEach(point => {
                const x = parseFloat(point.getAttribute("data-x"));
                const y = parseFloat(point.getAttribute("data-y"));
                const result = point.getAttribute("data-result") === "true";

                const svgX = center_coordinate_plate + (x * 33);  // Используем другую формулу
                const svgY = center_coordinate_plate - (y * 33); // Используем другую формулу
                console.log("new_point\n svg x :", svgX, "svg y : ", svgY, "\n x = ", x, " y = ", y, " scale = ", scale)

                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", svgX);
                circle.setAttribute("cy", svgY);
                circle.setAttribute("r", 2);
                circle.setAttribute("fill", result ? "green" : "red");
                circle.classList.add("data-point");

                svg.appendChild(circle);
            });
        }
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


                mutation_counter++
                console.log(mutation_counter, '-------------------')
                changeTimeZone(); // Выполняем обновление часового пояса

                if (mutation_counter !== 1 || isTableEmpty()) {

                    const rValue = parseFloat(document.querySelector('input[name="data-form\:rSelect"]:checked')?.value);
                    if (!isNaN(rValue)) {
                        drawPoints(rValue / 3, true); // Вызываем обновление графика
                    }
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

    changeTimeZone();


});