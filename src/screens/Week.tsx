import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { ICourseWeek } from '../../services/course.types';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { CourseService } from '../../services/course.service';

interface WeekProps {
  week: ICourseWeek;
  userIsTeacher: boolean;
  refetch: () => void;
  token: string; 
  courseId: number; 
}

const Week: React.FC<WeekProps> = ({ week, userIsTeacher, refetch, token, courseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const combinedDataByLesson = week.lessons_data.map((lesson) => ({
    lessonOrder: lesson.order,
    lessonId: lesson.id,
    data: [...lesson.lectures_data, ...lesson.test_data, ...lesson.video_lessons_data]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }));

  const handleLessonClick = (type: string, id: number) => {
    if (type === 'lecture') {
      navigation.navigate('LectureDetails', { lectureId: id, courseId, token });
    } else if (type === 'video') {
      navigation.navigate('VideoLessonDetails', { videoLessonId: id });
    }
  };

  const createLesson = useCallback(async () => {
    if (!token || !courseId) {
      Alert.alert('Ошибка', 'Не удалось создать урок. Параметры не заданы.');
      return;
    }

    try {
      const response = await CourseService.createWeekLesson(
        token, 
        `Урок ${week.lessons_data.length + 1}`, 
        week.id, 
        courseId
      );
      console.log('Создан урок:', response);
      refetch(); // Обновление данных после создания урока
    } catch (error) {
      console.error('Ошибка при создании урока:', error);
      Alert.alert('Ошибка', 'Не удалось создать урок. Попробуйте позже.');
    }
  }, [token, week, courseId, refetch]);

  return (
    <View style={styles.weekContainer}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.weekHeader}>
          <Text style={styles.weekTitle}>{week.name}</Text>
        </View>
      </TouchableOpacity>

      {isOpen && (
        <ScrollView style={styles.lessonContainer}>
          {combinedDataByLesson.map((lesson, index) => (
            <View key={lesson.lessonId} style={styles.lessonItem}>
              <Text style={styles.lessonOrder}>Урок {index + 1}</Text>
              {lesson.data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleLessonClick(item.type, item.id)}
                >
                  <Text style={styles.lessonText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          {userIsTeacher && (
            <TouchableOpacity onPress={createLesson}>
              <Text style={styles.addLessonButton}>Добавить урок</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  weekContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekTitle: {
    fontSize: 18,
    color: '#fff',
  },
  lessonContainer: {
    marginTop: 10,
  },
  lessonItem: {
    marginBottom: 10,
  },
  lessonOrder: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 5,
  },
  lessonText: {
    fontSize: 14,
    color: '#bbb',
  },
  addLessonButton: {
    marginTop: 10,
    color: '#46BD84',
  },
});

export default Week;
