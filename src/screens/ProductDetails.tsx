import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { CourseService } from '../../services/course.service';
import { ICourseDetails } from '../../services/course.types';
import { ProductStyle } from '../../styles/Product';
import IMAGES from '../../assets/img/image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

type RootStackParamList = {
  ProductDetails: { courseIds: number[]; token: string };
  CourseDetails: { courseId: number; token: string };
};

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;
type ProductDetailsNavigationProp = NavigationProp<RootStackParamList, 'CourseDetails'>;

const ProductScreen = () => {
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
    return <ActivityIndicator size="large" style={ProductStyle.loader} />;
  }

  return (
    <SafeAreaView style={ProductStyle.container}>
      <View style={ProductStyle.courseContainer}>
        <View style={ProductStyle.topZone}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ProductStyle.backBtn}>
            <FontAwesomeIcon icon={faAngleLeft} size={24} color="#260094" />
          </TouchableOpacity>
          <Text style={ProductStyle.topZoneTitle}>
            Course
          </Text>
        </View>

        <FlatList
          style={ProductStyle.sbjctList}
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToCourse(item.id)} style={ProductStyle.product}>
              <Text style={ProductStyle.productTitle}>{item.name}</Text>
              <View style={ProductStyle.productData}>
                <Image
                  source={IMAGES.GROUP}
                  style={{ height: 40, width: 80, resizeMode: 'contain', marginVertical: 5 }}
                />
                <Text style={{ fontSize: 14, fontWeight: 'thin' }}>
                  + {item.students?.count || 0} студентов
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProductScreen;
