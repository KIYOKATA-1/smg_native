import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { CourseService } from '../../services/course.service';
import { ICourseDetails, ContentData } from '../../services/course.types';
import { WebView } from 'react-native-webview';
import { CourseStyle } from '../../styles/Course';

type RootStackParamList = {
  CourseDetails: { courseId: number; token: string };
};

type CourseDetailsRouteProp = RouteProp<RootStackParamList, 'CourseDetails'>;

const CourseDetailsScreen = () => {
  const route = useRoute<CourseDetailsRouteProp>();
  const { courseId, token } = route.params;

  const [activeTab, setActiveTab] = useState<'syllabus' | 'unscheduledTest'>('syllabus');
  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(null);

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

  const renderSyllabus = () => (
    <ScrollView>
      {(course?.course_weeks ?? []).map((week) => (
        <View key={week.id} style={CourseStyle.weekContainer}>
          <TouchableOpacity 
            style={CourseStyle.weekHeader} 
            onPress={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
          >
            <Text style={CourseStyle.weekText}>{week.name}</Text>
          </TouchableOpacity>
          {expandedWeek === week.id && (
            <View style={CourseStyle.lessonContainer}>
              {week.lessons_data.map((lesson, index) => (
                <View key={lesson.id} style={CourseStyle.lessonItem}>
                  <Text style={CourseStyle.lessonText}>{index + 1} урок</Text>
                  {lesson.lectures_data.map((lecture) => (
                    <TouchableOpacity 
                      key={lecture.id} 
                      onPress={() => setSelectedContent(lecture)}
                    >
                      <Text style={CourseStyle.contentText}>📄 {lecture.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {lesson.video_lessons_data.map((video) => (
                    <TouchableOpacity 
                      key={video.id} 
                      onPress={() => setSelectedContent(video)}
                    >
                      <Text style={CourseStyle.contentText}>🎥 {video.name}</Text>
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

  if (loading) {
    return (
      <View style={CourseStyle.loader}>
        <ActivityIndicator size="large" color="#7C77C6" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={CourseStyle.container}>
        <Text style={{ color: 'red', textAlign: 'center', fontSize: 18 }}>
          Курс не найден
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={CourseStyle.container}>
      <View style={CourseStyle.courseContainer}>
        <Text style={CourseStyle.title}>{course.name}</Text>
        <View style={CourseStyle.tabsContainer}>
          <TouchableOpacity 
            style={[
              CourseStyle.tabButton, 
              activeTab === 'syllabus' && CourseStyle.activeTab
            ]}
            onPress={() => setActiveTab('syllabus')}
          >
            <Text style={CourseStyle.tabText}>Силлабус</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              CourseStyle.tabButton, 
              activeTab === 'unscheduledTest' && CourseStyle.activeTab
            ]}
            onPress={() => setActiveTab('unscheduledTest')}
          >
            <Text style={CourseStyle.tabText}>Внеплановый тест</Text>
          </TouchableOpacity>
        </View>

        <View style={CourseStyle.contentContainer}>
          {activeTab === 'syllabus' ? renderSyllabus() : <Text>Тесты недоступны</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CourseDetailsScreen;
