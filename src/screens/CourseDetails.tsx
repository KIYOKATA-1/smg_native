import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { CourseService } from '../../services/course.service';
import { ICourseDetails } from '../../services/course.types';

type RootStackParamList = {
  CourseDetails: { courseId: number; token: string };
  LectureDetails: { courseId: number; lectureId: number; token: string };
};

type CourseDetailsRouteProp = RouteProp<RootStackParamList, 'CourseDetails'>;
type NavigationPropLecture = NavigationProp<RootStackParamList, 'LectureDetails'>;

const CourseDetailsScreen = () => {
  const route = useRoute<CourseDetailsRouteProp>();
  const navigation = useNavigation<NavigationPropLecture>();
  const { courseId, token } = route.params;

  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const fetchCourse = useCallback(async () => {
    try {
      const data = await CourseService.getCourseById(token, courseId.toString());
      setCourse(data);
    } catch (error) {
      console.error('Ошибка при загрузке курса:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId, token]);

  const navigateToLecture = (lectureId: number) => {
    navigation.navigate('LectureDetails', { courseId, lectureId, token });
  };

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>Курс не найден</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{course.name}</Text>
      <Text style={styles.description}>{course.description}</Text>

      {course.course_weeks?.map((week) => (
        <View key={week.id} style={styles.weekContainer}>
          <TouchableOpacity onPress={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}>
            <Text style={styles.weekText}>{week.name}</Text>
          </TouchableOpacity>
          {expandedWeek === week.id && (
            <View style={styles.lessonContainer}>
              {week.lessons_data.map((lesson) => (
                <View key={lesson.id} style={styles.lessonItem}>
                  <Text style={styles.lessonText}>📖 {lesson.name}</Text>
                  {lesson.lectures_data.map((lecture) => (
                    <TouchableOpacity 
                      key={lecture.id} 
                      onPress={() => navigateToLecture(lecture.id)}
                    >
                      <Text style={styles.contentText}>📚 {lecture.name}</Text>
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
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  description: { fontSize: 16, color: '#555', marginBottom: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  weekContainer: { marginBottom: 15 },
  weekText: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  lessonContainer: { marginTop: 10, paddingLeft: 20 },
  lessonItem: { marginBottom: 10 },
  lessonText: { fontSize: 18, fontWeight: 'bold', color: '#ddd' },
  contentText: { fontSize: 16, color: '#bbb', marginLeft: 10 },
});

export default CourseDetailsScreen;
