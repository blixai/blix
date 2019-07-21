import axios from 'axios'

const getName = async () => {
    try {
        let response = await axios.get(`/api/v1/name`)
        return response
    } catch (err) {
        throw err
    }
}

const postName = async (name) => {
    try {
        let response = await axios.post(`/api/v1/name`, name)
        return response
    } catch (err) {
        throw err
    }
}

const putName = async (name, id) => {
    try {
        let response = await axios.put(`/api/v1/name/${id}`, name)
        return response
    } catch (err) {
        throw err
    }
}

const deleteName = async (id) => {
    try {
        let response = await axios.delete(`/api/v1/name/${id}`)
        return response
    } catch (err) {
        throw err
    }
}

export {
    getName,
    postName,
    putName,
    deleteName
}