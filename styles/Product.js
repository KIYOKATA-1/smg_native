import { StyleSheet } from "react-native";
export const ProductStyle = StyleSheet.create({
  container: {
    flex: 1, 
  },
  courseContainer: {
    justifyContent: 'start',
    backgroundColor: '#F0F0F5',
    height: '100%',
    width: '100%',
    alignItems: 'start',
    display: 'flex',
    position: 'relative',
    gap: 10,
    paddingVertical: 10,
  },
  loaderContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loader: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    color: '#7C77C6',

  },
  sbjctList:{
    width: '100%',
    borderRadius: 30,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopColor: '#260094',
    padding: 20,
    maxHeight: '100%', 
    borderTopWidth: 1,
  },
  product:{
    display: 'flex',
    padding: 10,
    borderWidth: 2,
    width: '100%',
    height: 'auto',
    borderColor: '#260094',
    alignItems: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productTitle:{
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#260094'
  },
  productData:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  
  topZone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10 
  },
  backBtn: {
    borderWidth: 2,
    marginRight: 10,
    width: 30,
    height: 30,
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#260094'
  },
  topZoneTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#260094'
  },
});
