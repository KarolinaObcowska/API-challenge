/**
 *  STEPS:
 *
 *  1. Declare a class to GET weather data, and GET the woeid, output received data
 *  2. Register an event listener and attach it to the GET requests chain from above, adjust UI loading state
 *  3. Prepare data for the UI in advance and try to use unified structure before outputting to the template
 *  4. Divide classes per function to have a more clean code approach and separation on concerns
 *  5. Add error/loading states and cover edge use cases
 *
 */

const BASE_API_ENDPOINT = 'https://www.metaweather.com/api/location';
const SEARCH_API = `${BASE_API_ENDPOINT}/search`

class Request {

    addCorsHeader() {
        $.ajaxPrefilter(options => {
            if (options.crossDomain && $.support.cors) {
                options.url = 'https://the-ultimate-api-challenge.herokuapp.com/' + options.url;
            }
        });
    }

    getLocation() {
        this.addCorsHeader();
        $.getJSON(SEARCH_API, { query: 'Warsaw' })
            .done(response => this.getWeatherData(response[0].woeid))
    }

    getWeatherData(location) {
        $.getJSON(`${BASE_API_ENDPOINT}/${location}`)
            .done(data => console.log(data))
    }
}

const req = new Request();
req.getLocation();