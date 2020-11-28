import ModelService from 'modelservice'
import { create } from 'apisauce'

class UserService extends ModelService 
{
    constructor()
    {
        super();
        var token = AuthToken.fromNext()
        var headers = { Accept: 'application/vnd.github.v3+json'}
        if (token) {
            headers.Authorization = token.authorizationString();
        }
        this.api = create({
            baseURL: 'http://localhost:3000',
            headers: headers,
        });
    }

    get()
    {
        const response = await this.api.get('/api/user');
        // TODO: Handle more of these errors.
        if (response.problem) {
            switch (response.problem) {
            case 'CLIENT_ERROR':
                if (response.status == 401)
                {
                    return null
                }
                break;
            default:
                break;
            }
        }
        return response.data.data;
    }

    create(obj)
    {
        const response = await this.api.get('/api/user');
        // TODO: Handle more of these errors.
        if (response.problem) {
            switch (response.problem) {
            case 'CLIENT_ERROR':
                if (response.status == 401)
                {
                    return null
                }
                break;
            default:
                break;
            }
        }
        return response.data.data;
    }

    getEmployeeById(employeeId)
    {
        const response = await this.api.get('/api/user');
        // TODO: Handle more of these errors.
        if (response.problem) {
            switch (response.problem) {
            case 'CLIENT_ERROR':
                if (response.status == 401)
                {
                    return null
                }
                break;
            default:
                break;
            }
        }
        return response.data.data;
    }

    updateEmployee(employee, employeeId)
    {
        const response = await this.api.get('/api/user');
        // TODO: Handle more of these errors.
        if (response.problem) {
            switch (response.problem) {
            case 'CLIENT_ERROR':
                if (response.status == 401)
                {
                    return null
                }
                break;
            default:
                break;
            }
        }
        return response.data.data;
    }

    deleteEmployee(employeeId)
    {
        return axios.delete(EMPLOYEE_API_BASE_URL + '/' + employeeId);
    }
}

export default new UserService()