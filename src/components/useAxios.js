import axios from 'axios';

function useAxios() {
    const get = async (url, params) => {
        const res = await axios.get(url, params);
        let results = res.data.results;
        results = results.map((item) => {
            return { ...item, title: item.name || item.title };
        });
        return results;
    };

    return { get };
}

export default useAxios;
