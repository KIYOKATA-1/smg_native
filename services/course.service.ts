import axios from 'axios';
import { ICourseDetails, ContentData } from './course.types';

const API_URL = 'https://api.smg.kz/en/api'; // Базовый URL

export const CourseService = {
  getMyCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      console.log('Курсы успешно загружены:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке курсов:', error);
      throw error;
    }
  },

  getCourseById: async (token: string, course_id: string): Promise<ICourseDetails> => {
    console.log(`Запрос курса: courseId=${course_id}`);
    try {
      const response = await axios.get(`${API_URL}/courses/${course_id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log('Курс успешно загружен:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при загрузке курса:', error.response?.data || error.message);
      } else {
        console.error('Неизвестная ошибка:', error);
      }
      throw error;
    }
  },

  getLectureById: async (token: string, courseId: string, lectureId: string): Promise<ContentData> => {
    const url = `${API_URL}/course/${courseId}/lecture/${lectureId}`; // Изменение пути
    console.log(`Запрос лекции по URL: ${url}`);
    
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log('Лекция успешно загружена:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при загрузке лекции:', error.response?.data || error.message);
      } else {
        console.error('Неизвестная ошибка:', error);
      }
      throw error;
    }
  },
};
