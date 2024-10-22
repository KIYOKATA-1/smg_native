import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { CourseService } from '../../services/course.service';
import { ICourseDetails } from '../../services/course.types';
import { ITeacher } from '../../services/course.types';

type RootStackParamList = {
  ProductDetails: { courseIds: number[]; token: string };
  CourseDetails: { courseId: number; token: string };
};

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;
type ProductDetailsNavigationProp = NavigationProp<RootStackParamList, 'CourseDetails'>;

const ProductDetailsScreen = () => {
  const route = useRoute<ProductDetailsRouteProp>();
  const navigation = useNavigation<ProductDetailsNavigationProp>();
  const { courseIds, token } = route.params;

  const [courses, setCourses] = useState<ICourseDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await Promise.all(
          courseIds.map((id) => CourseService.getCourseById(token, id.toString()))
        );
        setCourses(data);
      } catch (error) {
        console.error('Ошибка при загрузке курсов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [courseIds, token]);

  const navigateToCourse = (courseId: number) => {
    navigation.navigate('CourseDetails', { courseId, token });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.courseItem} onPress={() => navigateToCourse(item.id)}>
            <Text style={styles.courseName}>{item.name}</Text>
            
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  courseItem: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 10 },
  courseName: { fontSize: 18, fontWeight: 'bold' },
  courseDescription: { fontSize: 14, color: '#555' },
});

export default ProductDetailsScreen;
