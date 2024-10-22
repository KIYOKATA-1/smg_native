import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthService } from '../../services/auth.service';

type RootStackParamList = {
  Profile: { token: string };
};

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = useCallback(async () => {
    try {
      const response = await AuthService.login(username, password);
      if (response) {
        navigation.navigate('Profile', { token: response.key });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Ошибка', error.message);
      } else {
        Alert.alert('Ошибка', 'Произошла неизвестная ошибка.');
      }
    }
  }, [username, password, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <TextInput
        style={styles.input}
        placeholder="Номер телефона"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Войти" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});

export default LoginScreen;
