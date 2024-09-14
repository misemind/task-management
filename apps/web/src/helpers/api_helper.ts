import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import config from "config";

const { api } = config;

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const authUser: any = sessionStorage.getItem("authUser")
const token = JSON.parse(authUser) ? JSON.parse(authUser).token : null;
if (token)
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: string) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url: string, params?: any): Promise<AxiosResponse> => {
    let response: Promise<AxiosResponse>;

    let paramKeys: string[] = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url: string, data: any) => {
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url: string, data: any) => {
    return axios.patch(url, data);
  };

  put = (url: string, data: any) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return axios.delete(url, { ...config });
  };
  downloadFile = async (url: string, params?: any, filename?: string, mimeType?: string): Promise<void> => {
    try {
      let paramKeys: string[] = [];

      if (params) {
        Object.keys(params).map(key => {
          paramKeys.push(key + '=' + params[key]);
          return paramKeys;
        });

        const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
        url = `${url}?${queryString}`;
      }

      const response: any = await axios.get(url, {
        responseType: 'blob', // Ensure the response is in blob format
      });
      console.log('!!!!!!!!!!!!', response);
      const blob = new Blob([response], { type: mimeType || response.type });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename || "download");
      document.body.appendChild(link);
      link.click();
      link.remove(); // Remove the link after triggering download

      window.URL.revokeObjectURL(downloadUrl); // Clean up the object URL
    } catch (error) {
      console.error("File download failed:", error);
      throw error; // You might want to handle this differently in your UI
    }
  };
}
const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };