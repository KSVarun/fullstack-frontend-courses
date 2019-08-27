import axios from "../utils/axios";

export function fetchAllTopics() {
  return axios.get(`/topics`);
}

export function updateTopic(id, requestBody) {
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve(requestBody);
  //   }, 1000);
  // });
  return axios.put(`/topics/${id}`, requestBody);
}

export function deleteTopic(id) {
  return axios.delete(`/topics/${id}`);
}

export function addNewTopic(topic) {
  return axios.post(`/topics/`, topic);
}
