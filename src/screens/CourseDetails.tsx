import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Dimensions 
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { CourseService } from '../../services/course.service';
import { ICourseDetails, ContentData } from '../../services/course.types';
import { WebView } from 'react-native-webview';

type RootStackParamList = {
  CourseDetails: { courseId: number; token: string };
};

type CourseDetailsRouteProp = RouteProp<RootStackParamList, 'CourseDetails'>;

const CourseDetailsScreen = () => {
  const route = useRoute<CourseDetailsRouteProp>();
  const { courseId, token } = route.params;

  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<ContentData | null>(null);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CourseService.getCourseById(token, courseId.toString());
      setCourse(data);
    } catch (error) {
      console.error('Ошибка при загрузке курса:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить курс. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleLectureSelect = (lecture: ContentData) => {
    setSelectedLecture(lecture);
  };

  const handleBackToCourse = () => {
    setSelectedLecture(null);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Курс не найден</Text>
      </View>
    );
  }

  if (selectedLecture) {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={handleBackToCourse}>
          <Text style={styles.backButton}>Назад к курсу</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selectedLecture.name}</Text>
        <Text style={styles.description}>{selectedLecture.description}</Text>
        <Text style={styles.content}>{selectedLecture.text}</Text>
        {selectedLecture.file ? (
          <View style={styles.pdfContainer}>
            <WebView
              source={{ uri: selectedLecture.file }}
              style={styles.pdf}
              onError={() => Alert.alert('Ошибка', 'Не удалось загрузить PDF.')}
            />
          </View>
        ) : (
          <Text>Файл PDF не найден.</Text>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{course.name}</Text>
      <Text style={styles.description}>{course.description}</Text>

      {course.course_weeks?.map((week) => (
        <View key={week.id} style={styles.weekContainer}>
          <TouchableOpacity 
            style={styles.weekHeader} 
            onPress={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
          >
            <Text style={styles.weekText}>{week.name}</Text>
          </TouchableOpacity>
          {expandedWeek === week.id && (
            <View style={styles.lessonContainer}>
              {week.lessons_data.map((lesson) => (
                <View key={lesson.id} style={styles.lessonItem}>
                  <Text style={styles.lessonText}>{lesson.name}</Text>
                  {lesson.lectures_data.map((lecture) => (
                    <TouchableOpacity 
                      key={lecture.id} 
                      onPress={() => handleLectureSelect(lecture)}
                    >
                      <Text style={styles.contentText}>{lecture.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 60, 
    backgroundColor: '#f0f0f0' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#333' 
  },
  description: { 
    fontSize: 16, 
    color: '#555', 
    marginBottom: 20 
  },
  content: {  // Добавлен стиль для content
    fontSize: 14, 
    color: '#333', 
    marginBottom: 20 
  },
  loaderContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    fontSize: 18, 
    color: 'red' 
  },
  backButton: { 
    fontSize: 18, 
    color: 'blue', 
    marginBottom: 10 
  },
  weekContainer: { 
    marginBottom: 15, 
    backgroundColor: '#4a4a4a', 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  weekHeader: { 
    padding: 15, 
    backgroundColor: '#2a2a2a', 
    borderBottomWidth: 1, 
    borderColor: '#444' 
  },
  weekText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  lessonContainer: { 
    padding: 10, 
    backgroundColor: '#3a3a3a' 
  },
  lessonItem: { 
    marginBottom: 10 
  },
  lessonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#ddd' 
  },
  contentText: { 
    fontSize: 16, 
    color: '#bbb', 
    marginLeft: 10 
  },
  pdfContainer: { 
    height: Dimensions.get('window').height / 2, 
    marginTop: 20 
  },
  pdf: { 
    flex: 1, 
    width: Dimensions.get('window').width 
  },
});

export default CourseDetailsScreen;
