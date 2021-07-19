class FetchForecast {
    constructor() {
        this.baseApiEndpoint = 'https://www.metaweather.com/api/location';
        this.searchApi = `${this.baseApiEndpoint}/search`;
        this.addCorsHeader();
    }

    addCorsHeader() {
        $.ajaxPrefilter(options => {
            if (options.crossDomain && $.support.cors) {
                options.url = 'https://the-ultimate-api-challenge.herokuapp.com/' + options.url;
            }
        });
    }

    getLocation(query, callback) {
        $.getJSON(this.searchApi, { query })
            .done(data => callback(data))
            .fail(() => callback(null))
    }

    getWeatherData(location, callback) {
        $.getJSON(`${this.baseApiEndpoint}/${location}`)
            .done(data => callback(data))
            .fail(() => callback(null))
    }
}

class DomElements {
    constructor() {
        this.forecast = $('#forecast-box');
        this.searchForm = $('#search-form');
        this.searchBox = $('#search-box');
        this.error = $('#error-box');
        this.loader = $('#loader-box');
    }

    showLoader() {
        this.loader.removeClass('d-none');
    };

    hideLoader() {
        this.loader.addClass('d-none');
    };

    showForecast() {
        this.hideError();
        this.forecast.removeClass('d-none');
        this.forecast.addClass('d-flex');
    }

    showSearchBox() {
        this.searchBox.removeClass('d-none')
        this.searchBox.addClass('d-flex');
    }

    hideSearchBox() {
        this.searchBox.removeClass('d-flex');
        this.searchBox.addClass('d-none')
    }

    showError(msg) {
        this.hideLoader();
        this.showSearchBox();
        this.error.removeClass('d-none');
        this.error.addClass('d-block');
        this.error.html(`<span>${msg}</span>`)
    };

    hideError() {
        this.error.addClass('d-none')
    }

}

class dataMiddleware {
    constructor() {
        this.displayWeather = new displayWeather();
        this.DomElements = new DomElements();
    };

    collectTodayWeatherDetail(data) {
        return {
            predictability: {
                value: data.predictability,
                unit: '%',
            },
            humidity: {
                value: data.humidity,
                unit: '%',
            },
            wind: {
                value: Math.round(data.wind_speed),
                unit: 'km/h',
            },
            'air pressure': {
                value: data.air_pressure,
                unit: 'mb',
            },
            'max temp': {
                value: Math.round(data.max_temp),
                unit: '°C',
            },
            'min temp': {
                value: Math.round(data.min_temp),
                unit: '°C',
            },
        }
    }

    collectTodayWeather(data) {
        return {
            currentWeekday: moment(data.applicable_date).format('dddd'),
            todaysFullDate: moment(data.applicable_date).format('MMMM Do'),
            locationName: data.title,
            todaysImgUrl: data.weather_state_abbr,
            todaysTemp: Math.round(data.the_temp),
            weatherState: data.weather_state_name,
        }
    }

    prepareData(data) {
        const {
            predictability,
            humidity,
            wind_speed,
            air_pressure,
            max_temp,
            min_temp,
            applicable_date,
            the_temp,
            weather_state_abbr,
            weather_state_name,
        } = data.consolidated_weather[0];

        const todayWeather = this.collectTodayWeather({
            applicable_date,
            weather_state_abbr,
            weather_state_name,
            the_temp,
            title: data.title,
        });
        const todaysWeatherDetails = this.collectTodayWeatherDetail({
            predictability,
            humidity,
            wind_speed,
            air_pressure,
            max_temp,
            min_temp,
        });

        this.displayWeather.showTodayForecast(todayWeather);
        this.prepareTodaysWeatherDetails(todaysWeatherDetails);
        this.prepareNextDaysWeather(data.consolidated_weather);
        this.DomElements.hideLoader();
        this.DomElements.showForecast();
    }

    prepareTodaysWeatherDetails(forecast) {
        $.each(forecast, (key, value) => {
            this.displayWeather.showTodayForecastDetail({
                name: key.toUpperCase(),
                value: value.value,
                unit: value.unit,
            });
        });
    };

    prepareNextDaysWeather(forecast) {
        $.each(forecast, (index, value) => {
            if (index < 1) return;

            const dayImg = value.weather_state_abbr;
            const maxTmp = Math.round(value.max_temp);
            const weekDay = moment(value.applicable_date).format('dddd').substring(0, 3);

            this.displayWeather.showNextDaysForecast({ dayImg, maxTmp, weekDay });
        });
    }
}

class displayWeather {
    constructor() {
        this.imgURL = 'https://www.metaweather.com/static/img/weather';
    }

    showTodayForecastDetail({ name, value, unit }) {
        $(`#forecast-details`).append(`
            <div class="d-flex justify-content-between">
                <span class="font-weight-bolder">${name}</span>
                <span>${value} ${unit}</span>
            </div>
        `);
    };

    showTodayForecast(forecast) {
        $('#forecast-card-weekday').html(forecast.currentWeekday);
        $('#forecast-card-date').html(forecast.todaysFullDate);
        $('#forecast-card-location').html(forecast.locationName);
        $('#forecast-card-img').attr('src', `${this.imageURL}/${forecast.todaysImgUrl}.svg`);
        $('#forecast-card-temp').html(forecast.todaysTemp);
        $('#forecast-card-description').html(forecast.weatherState);
    };

    showNextDaysForecast({ dayImg, weekDay, maxTmp }) {
        $('#forecast-details-week').append(`
            <li class="forecastBox__week-day d-flex flex-column justify-content-center align-items-center p-2 weather-day">
                <img class="mb-2" width="30" src="${this.imageURL}/${dayImg}.svg" />
                <span class="mb-2">${weekDay}</span>
                <span class="font-weight-bold">${maxTmp}&deg</span>
            </li>
        `);
    };
}

class Controller {
    constructor() {
        this.FetchForecast = new FetchForecast();
        this.DomElements = new DomElements();
        this.dataMiddleware = new dataMiddleware();
        this.registerEventListener();
    }

    inProgress() {
        this.DomElements.showLoader();
        this.DomElements.hideSearchBox();
    }

    getQuery() {
        return $('#search-query').val().trim();
    }

    fetchWeather(query) {
        this.FetchForecast.getLocation(query, location => {
            if (!location || location.length === 0) {
                this.DomElements.showError('Could not find this location, try again')
            }
            this.FetchForecast.getWeatherData(location[0].woeid, (data) => {
                if (!data) {
                    this.DomElements.showError('Error');
                    return;
                }
                this.dataMiddleware.prepareData(data)
            });
        });
    }

    onSubmit() {
        const query = this.getQuery;
        if (!query) return;

        this.inProgress();
        this.fetchWeather(query);

    }

    registerEventListener() {
        this.DomElements.searchForm.on('submit', e => {
            e.preventDefault();
            this.onSubmit();
        })
    }
}

const request = new Controller();
