import axios from 'axios'

export function analyze(name, value) {
    return async () => {
        const url = 'http://localhost:8080/api/analysis/' + name + '/' + value
        try {
            const response = await axios.get(url);

            response.error = false
            return response;


        }catch (e) {
            console.log(e)
            let response = {};
            response.data = e.response && e.response.data && e.response.data.message ? e.response.data.message : e.toString()
            response.error = true;
            return response;
        }
    }
}
