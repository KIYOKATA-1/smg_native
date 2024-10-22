import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { CourseService } from '../../services/course.service';
import { ContentData } from '../../services/course.types';

type RootStackParamList = {
  LectureDetails: { courseId: number; lectureId: number; token: string };
};

type LectureDetailsRouteProp = RouteProp<RootStackParamList, 'LectureDetails'>;

const LectureDetailsScreen = () => {
  const route = useRoute<LectureDetailsRouteProp>();
  const { courseId, lectureId, token } = route.params;

  const [lecture, setLecture] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLecture = useCallback(async () => {
    try {
      const data = await CourseService.getLectureById(token, courseId.toString(), lectureId.toString());
      setLecture(data);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить лекцию. Пожалуйста, попробуйте позже.');
      console.error('Ошибка при загрузке лекции:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId, lectureId, token]);

  useEffect(() => {
    fetchLecture();
  }, [fetchLecture]);

  const openFile = async () => {
    if (lecture?.file) {
      const supported = await Linking.canOpenURL(lecture.file);
      if (supported) {
        await Linking.openURL(lecture.file);
      } else {
        Alert.alert('Ошибка', 'Не удалось открыть файл.');
        console.error('Не удалось открыть файл:', lecture.file);
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (!lecture) {
    return (
      <View style={styles.container}>
        <Text>Лекция не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{lecture.name}</Text>
      <Text style={styles.description}>{lecture.description}</Text>
      <Text style={styles.content}>{lecture.text}</Text>

      {lecture.file && (
        <TouchableOpacity onPress={openFile} style={styles.button}>
          <Text style={styles.buttonText}>Открыть файл</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  description: { fontSize: 16, color: '#555', marginBottom: 20 },
  content: { fontSize: 14, color: '#333', marginBottom: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default LectureDetailsScreen;
