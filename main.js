"use strict";
// ===============================
// ==============   Elements
function createIcon(name, src) {
    const img = document.createElement("img");
    img.setAttribute("src", src);
    img.setAttribute("class", "icon");
    return img;
}
function createList(name) {
    const list = document.createElement("ul");
    list.setAttribute("class", name);
    return list;
}
function createContainer(name) {
    const list = document.createElement("div");
    list.setAttribute("class", name);
    return list;
}
function createElemList(name, content) {
    const elem = document.createElement("li");
    elem.setAttribute("class", name);
    elem.textContent = content;
    return elem;
}
function createTitle(content, size) {
    const elem = document.createElement(`h${size}`);
    elem.textContent = content;
    return elem;
}
// ===============================
// ==============   Components
const COMPONENT_CLASSNAME = "component";
function createCityInfo(data) {
    const component = createContainer(`${COMPONENT_CLASSNAME} city_infos`);
    component.appendChild(createTitle("City Infos", 3));
    const list = createList("citinfo");
    for (const [key, value] of Object.entries(data)) {
        list.appendChild(createElemList(key, `${key} : ${value}`));
    }
    component.appendChild(list);
    return component;
}
function createCurrentCondition(data) {
    const component = createContainer(`${COMPONENT_CLASSNAME} curr_cond`);
    component.appendChild(createTitle("Current condition", 3));
    const list = createList("curr_cond");
    for (const [key, value] of Object.entries(data)) {
        if (key === "icon" || key === "icon_big") {
            component.appendChild(createIcon(key, value));
        }
        else {
            list.appendChild(createElemList(key, `${key} : ${value}`));
        }
    }
    component.appendChild(list);
    return component;
}
function createDay(data, i) {
    const component = createContainer(`${COMPONENT_CLASSNAME} day`);
    component.appendChild(createTitle(`Jour : ${i}`, 3));
    const list = createList("infos-day");
    list.appendChild(createTitle("Infos générales", 4));
    for (const [key, value] of Object.entries(data)) {
        let elem;
        if (key === "hourly_data") {
            component.appendChild(createTitle("Hourly date", 4));
            elem = createContainer("hourly_data");
            for (const [_key, _value] of Object.entries(value)) {
                const elemChild = createContainer(`time-${key}`);
                elemChild.appendChild(createElemList("time", _key));
                elemChild.appendChild(createIcon("icon", _value.ICON));
                elemChild.appendChild(createElemList("elem", _value.CONDITION));
                elem.appendChild(elemChild);
            }
        }
        else if (key === "icon" || key === "icon_big") {
            elem = createIcon(key, `${value}`);
        }
        else {
            list.appendChild(createElemList(key, `${key} : ${value}`));
            elem = list;
        }
        component.appendChild(elem);
    }
    return component;
}
function createForecastInfo(data) {
    const component = createContainer(`${COMPONENT_CLASSNAME} forecast_infos`);
    component.appendChild(createTitle(`Forecast infos`, 3));
    const list = createList("forecast_info");
    for (const [key, value] of Object.entries(data)) {
        list.appendChild(createElemList(key, `${key} : ${value}`));
    }
    component.appendChild(list);
    return component;
}

// ===============================
// ==============   MAIN
const url = 'https://www.prevision-meteo.ch/services/json/';
const _button = document.querySelector('button');
_button.addEventListener('click', event => {
    event.preventDefault();
    requestApi(event);
});
function requestApi(event) {
    event.preventDefault();
    const city = document.querySelector('form input[name="city"]');
    const display = document.querySelector("#display");
    display.innerHTML = "";
    fetch(`${url}${city.value}`)
        .then(data => data.json())
        .then(data => {
            display.appendChild(createCityInfo(data.city_info));
            display.appendChild(createCurrentCondition(data.current_condition));
            display.appendChild(createDay(data.fcst_day_0, 1));
            display.appendChild(createDay(data.fcst_day_1, 2));
            display.appendChild(createDay(data.fcst_day_2, 3));
            display.appendChild(createDay(data.fcst_day_3, 4));
            display.appendChild(createForecastInfo(data.forecast_info));
        })
        .catch(error => console.log('error', error));
}
