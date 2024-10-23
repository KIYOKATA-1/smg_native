import { StyleSheet, Dimensions } from 'react-native';

export const CourseStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
  },
  courseContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loader: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    color: '#7C77C6',

  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#7C77C6',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  weekContainer: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#4a4a4a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  weekHeader: {
    padding: 15,
    backgroundColor: '#2a2a2',
    borderBottomWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    display: 'flex',
  },
  weekText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  lessonContainer: {
    padding: 10,
    backgroundColor: '#3a3a3a',
    display: 'flex',
  },
  lessonItem: {
    marginBottom: 10,
  },
  lessonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ddd',
  },
  contentContainer:{
    borderWidth: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: 15,
    borderColor: '#444',
    borderRadius: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#bbb',
    marginLeft: 10,
  },
});
