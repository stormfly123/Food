import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Animated,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'Find your new favorite restaurant',
    message:
      'Yum yum!! Get your delicious meal from your favourite resturants with ease.....',
    action: 'Continue',
  },
  {
    title: 'Satisfy Your Cravings ',
    message: 'You get on work,studying or resting. we get on breakfast, lunch and dinnerr....    ',
    action: 'Continue',
  },
  {
    title: "We've got you covered",
    message:
      'No need for queues and long wait.The food is for the City..',
    action: 'Start exploring',
  },
];

const elements = [
  {
    uri: 'https://images.unsplash.com/photo-1570275239925-4af0aa93a0dc?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    position: [-70, 15],
    rotate: '15deg',
  },
  {
    uri: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    position: [180, 50],
    rotate: '-10deg',
  },
  {
    uri: 'https://b3368562.smushcdn.com/3368562/wp-content/uploads/2023/12/image-58.png?lossy=2&strip=1&webp=1',
    position: [540, 50],
    rotate: '20deg',
  },
  {
    uri: 'https://guccilounge.net/wp/wp-content/uploads/2020/11/boli8.jpg',
    position: [860, 25],
    rotate: '-4deg',
  },
];

function Background() {
  return (
    <View style={styles.elements}>
      {elements.map(({ uri, position: [x, y], rotate }, index) => (
        <View
          style={[
            styles.element,
            {
              zIndex: elements.length - index,
            },
          ]}
          key={index}>
          <Image
            style={[
              styles.elementImage,
              {
                width: width * 0.8,
                height: width * 0.6,
                top: y,
                left: x,
                transform: [{ rotate }],
              },
            ]}
            source={{ uri }}
          />
        </View>
      ))}
    </View>
  );
}

export default function Example() {
  const [slide, setSlide] = useState(0);
  const navigation = useNavigation(); // Get the navigation object

  const swiper = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

  const contentOpacityRanges = Array.from({ length: slides.length }).reduce(
    (acc, _, index) => {
      const screenWidth = index * width;
      const screenWidthMiddle = screenWidth + width / 2;

      acc.inputRange.push(screenWidth, screenWidthMiddle);
      // opacity 1 when screen is presented, 0.2 when screens are switching (mid point).
      acc.outputRange.push(1, 0.2);

      return acc;
    },
    {
      inputRange: [],
      outputRange: [],
    },
  );
  const contentOpacity = scrollX.interpolate(contentOpacityRanges);

  const animatedBackgroundLeft = scrollX.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1, 0, -1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          left: animatedBackgroundLeft,
        }}>
        <Background />
      </Animated.View>
      <Swiper
        ref={swiper}
        showsPagination={false}
        loop={false}
        onIndexChanged={setSlide}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={1}>
        {slides.map(({ title, message, action }, index) => {
          return (
            <Animated.View
              style={[styles.slide, { opacity: contentOpacity }]}
              key={index}>
              <Text style={styles.slideTitle}>{title}</Text>
              <Text style={styles.slideText}>{message}</Text>

              <TouchableOpacity
                onPress={() => {
                  if (action === 'Start exploring') {
                    navigation.navigate('SignIn'); // Navigate to Signup screen
                  } else {
                    swiper.current.scrollTo(slide + 1, true);
                  }
                }}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>{action}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Swiper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  elements: {
    width: width * slides.length,
    height: 0.6 * height,
    position: 'absolute',
    top: 47,
    left: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  /** Element */
  element: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  elementImage: {
    borderRadius: 24,
  },
  /** Slide */
  slide: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  slideTitle: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '600',
    color: '#0d0d0d',
    marginBottom: 12,
  },
  slideText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0d0d0d',
  },
  /** Button */
  button: {
    backgroundColor: '#ff914c',
    padding: 18,
    borderRadius: 12,
    marginTop: 48,
    marginBottom: 36,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
