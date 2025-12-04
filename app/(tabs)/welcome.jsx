import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import GradientBackground from '../../components/GradientBackground.jsx';
import SignupBottomSheet from '../../components/SignupBottomSheet.jsx';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8;
const ITEM_SPACING = (width - ITEM_WIDTH) / 2;

const data = [
  { image: require('../../assets/images/welcome/image_1.png') },
  { image: require('../../assets/images/welcome/image_2.png') },
  { image: require('../../assets/images/welcome/image_3.png') },
  { image: require('../../assets/images/welcome/image_4.png') },
];

export default function Welcome() {
  const sheetRef = useRef(null);
  const router = useRouter();
  const [isOpen, setisOpen] = useState(true);
  const snapPoints = ["40%"];

  const scrollX = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleSnapPress = useCallback((index) => {                               
    sheetRef.current?.present(index);
    setisOpen(true);  
  }, []);

  const handleTermsPress = () => {
    Linking.openURL('https://www.example.com/terms').catch(() => {});
  };

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Gradient Background */}
          <View style={StyleSheet.absoluteFill}>
            <GradientBackground />
          </View>
          
          {/* Logo at top */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          {/* Content */}
          <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 80 }}>
            <View style={{ alignItems: 'center' }}>
              <Animated.FlatList
                data={data}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: ITEM_SPACING, paddingBottom: 0 }} 
                snapToInterval={ITEM_WIDTH}
                decelerationRate="fast"
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                  return <AnimatedItem item={item} index={index} scrollX={scrollX} />;
                }}
              />
              <Dots data={data} scrollX={scrollX} />
              <View style={styles.content}>
                <Text style={styles.title}>See Beyond the{"\n"}Surface</Text>
                <Text style={styles.tagline}>Gain control over your condition.</Text>
    
                <TouchableOpacity
                  style={styles.primaryButton}                                      
                  onPress={() => handleSnapPress(0)}>
                  <Text style={styles.primaryButtonText}>Let's Get Started</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTermsPress} style={styles.termsContainer} activeOpacity={0.7}>     
                  <Text style={styles.termsText}>
                    By continuing you agree to our <Text style={styles.termsLink}>Terms & Conditions</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={sheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onDismiss={() => setisOpen(false)}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  appearsOnIndex={0}       
                  disappearsOnIndex={-1}   
                  opacity={0.45}           
                  pressBehavior="close"    
                />
              )}
            >
              <BottomSheetView>
                <SignupBottomSheet
                  onPick={(role) => {
                    sheetRef.current?.dismiss();
                    
                    setTimeout(() => {
                      if (role === 'create') router.push('/create');
                      else if (role === 'login') router.push('/signin');
                    }, 220);
                  }}
                  onClose={() => sheetRef.current?.dismiss()}
                />
              </BottomSheetView>
            </BottomSheetModal>
          </BottomSheetModalProvider>
        </View>
      </GestureHandlerRootView>
    );
  }

function AnimatedItem({ item, index, scrollX }) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], 'clamp');
    
    const rotateZ = interpolate(
      scrollX.value,
      inputRange,
      [15, 0, -15], 
      'clamp'
    );
    
    // Add vertical offset for arc/curve
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [40, 0, 40], // Cards on sides move down
      'clamp'
    );
    
    return {
      transform: [
        { scale },
        { rotateZ: `${rotateZ}deg` },
        { translateY }
      ],
    };
  });

  return (
    <Animated.View style={[styles.item, animatedStyle]}>      
      <View style={styles.innerItem}>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="cover" 
        />
      </View>
    </Animated.View>
  );
}

function Dots({ data, scrollX }) {
  return (
    <View style={styles.dotsContainer}>
      {data.map((_, index) => {
        return <Dot key={index} index={index} scrollX={scrollX} />;
      })}
    </View>
  );
}

function Dot({ index, scrollX }) {
  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH],
      [8, 16, 8],
      'clamp'
    );
    return {
      width,
    };
  });
  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  logoContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 50,
  },
  item: {
    width: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerItem: {
    width: '100%',
    height: '70%',
    backgroundColor: 'whiteSmoke',
    borderRadius: 16,
    marginBottom: 0, 
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -0, 
  },
  dot: {
    height: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  content: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffffff',
    textAlign: 'left',
    marginLeft: -90,
    marginTop: 40,
    lineHeight: 34,
  },
  tagline: {
    fontSize: 14,
    color: '#ffffffff',
    textAlign: 'left',
    marginLeft: -90,
    marginTop: 8,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#ffffffff',
    paddingVertical: 13,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    marginTop: 35,
  },
  primaryButtonText: {
    color: '#2a94feff',
    fontWeight: '700',
    fontSize: 16,
  },
  termsContainer: {
    marginTop: 19,
    paddingHorizontal: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#ffffffff',
    textAlign: 'center',
  },
    termsLink: {
      color: '#ffffffff',
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
  });