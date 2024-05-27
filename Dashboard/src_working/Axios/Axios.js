import Axios from "axios";


const AnalyticAxios = Axios.create({

    baseURL:`http://${window.location.hostname}:3005`
})

export default AnalyticAxios;



    