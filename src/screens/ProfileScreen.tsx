import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';

const BACKEND_URL = 'https://api.smg.kz/en/api';

type RootStackParamList = {
  Profile: { token: string };
  ProductDetails: { courseIds: number[] };
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface UserData {
  first_name: string;
  last_name: string;
  phone: string;
}

interface Product {
  id: number;
  name: string;
  course: number[];
}

const ProfileScreen = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const { token } = route.params || {};
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'ProductDetails'>>(); // Навигация с типизацией

  const [userData, setUserData] = useState<UserData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      Alert.alert('Ошибка', 'Токен не найден. Пожалуйста, войдите заново.');
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await axios.get<UserData>(`${BACKEND_URL}/user/`, {
          headers: { Authorization: `Token ${token}` },
        });
        console.log('User Data:', userResponse.data);
        setUserData(userResponse.data);

        const productsResponse = await axios.get<{ results: Product[] }>(
          `${BACKEND_URL}/courses/products/?limit=100`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        console.log('Products:', productsResponse.data.results);
        setProducts(productsResponse.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить данные. Проверьте интернет-подключение.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleProductPress = (courseIds: number[]) => {
    navigation.navigate('ProductDetails', { courseIds });
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      {userData && (
        <View style={styles.userInfo}>
          <Text>
            Имя: {userData.first_name} {userData.last_name}
          </Text>
          <Text>Телефон: {userData.phone}</Text>
        </View>
      )}
      <Text style={styles.subtitle}>Мои Продукты</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleProductPress(item.course)}>
            <View style={styles.product}>
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  userInfo: { marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  product: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default ProfileScreen;
