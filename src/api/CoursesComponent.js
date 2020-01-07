import axios from "../utils/axios";

export function fetchPage(pageNo, sortby, type) {
  return axios.get(`/topics?page=${pageNo}&sort=${sortby},${type}`);
}
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

export function findByName(topicName) {
  return axios.get(`/topics/${topicName}`);
}

export function sortByName(topicName, type) {
  return axios.get(`/topics?sort=${topicName},${type}`);
}
