import config from './config';
// javascript helper class

// requiresAuth
// and credentials
// can both be stored globally
// through the signin function
// then passed as params here....
export default class Data {
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      
      options.headers['Authorization'] = `Basic ${encodedCredentials}`
    }

    return fetch(url, options);
  }

  async getUser(credentials) {
    const response = await this.api(`/users`, 'GET', null, true, credentials);
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      console.log(response);
      return response.json().then(data => {
        console.log(data);
        return data.errors;
      });
    }
    else {
      throw new Error(response);
    }
  }

  async  createCourse(course, credentials) {
    const response = await this.api('/courses', 'POST', course, true, credentials);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error("Something went wrong");
    }
  }

  // put method to edit courses

  async updateCourse(course, id, credentials) {
    const path = '/courses/' + id;

    const response = await this.api(path,'PUT', course, true, credentials);
    if (response.status === 204) {
      return [];
    }
    // response 400 indicates errors
    // return the errors so they can show users
    // whey their request wasn't accepted

    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }

    else if (response.status === 403) {
      return {errors: ["You may only update your courses"]}
    }

    else {
      throw new Error("Something went wrong");
    }
  }

  // view one particular course

  async viewCourse(id) {
    const path = '/courses/' + id;
    const response = await this.api(path); 
    if (response.status === 200) {
      return response.json().then(data => data);
    }

    else {
      throw new Error("Course not found");
    }
  }
  
  // get all the courses to show on main page
  async getCourses() {
    const response = await (await this.api('/courses')).json();
    return response;
  }

  async deleteCourse(id, credentials) {
    const path = '/courses/'+id;
    const response =  await (await this.api(path, 'DELETE', null, true, credentials))
    return response
  }
}